import pino from 'pino';
import { trace, context } from '@opentelemetry/api';
import { suppressTracing } from '@opentelemetry/core';

const isProduction = process.env.NODE_ENV === 'production';

// pino level → OTel SeverityNumber/Text (https://opentelemetry.io/docs/specs/otel/logs/data-model/#field-severitynumber)
const SEVERITY_NUMBER: Record<number, number> = {
  10: 1, 20: 5, 30: 9, 40: 13, 50: 17, 60: 21,
};
const SEVERITY_TEXT: Record<number, string> = {
  10: 'TRACE', 20: 'DEBUG', 30: 'INFO', 40: 'WARN', 50: 'ERROR', 60: 'FATAL',
};

// 로컬(NODE_ENV=development): stdout JSON 출력. OTel 관련 env 불필요.
// 운영(NODE_ENV=production): OTLP/JSON HTTP로 OTel Collector에 직접 전송.
//   → 필요한 env: OTEL_EXPORTER_OTLP_ENDPOINT (ex. http://otel-collector:4318)
//   → worker thread 없이 main thread에서 native fetch로 전송 (pino-opentelemetry-transport 미사용)
class OtelHttpDestination {
  private readonly url: string;
  private readonly resource: unknown[];

  constructor() {
    const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318';
    this.url = `${endpoint}/v1/logs`;
    this.resource = [
      { key: 'service.name',            value: { stringValue: 'watchbox-next' } },
      { key: 'service.version',         value: { stringValue: process.env.APP_VERSION ?? 'unknown' } },
      { key: 'deployment.environment',  value: { stringValue: process.env.NEXT_PUBLIC_ENV ?? 'unknown' } },
    ];
  }

  write(data: string) {
    try {
      const { msg, level, time, pid: _pid, hostname: _h, ...attrs } = JSON.parse(data);

      // 현재 active span에서 trace context 추출 → logRecord에 첨부
      // → Grafana에서 Loki 로그 ↔ Tempo trace 자동 점프 가능
      const spanCtx = trace.getActiveSpan()?.spanContext();

      const logRecord: Record<string, unknown> = {
        timeUnixNano: String(time * 1_000_000),
        severityNumber: SEVERITY_NUMBER[level] ?? 9,
        severityText: SEVERITY_TEXT[level] ?? 'INFO',
        body: { stringValue: msg ?? '' },
        attributes: Object.entries(attrs).map(([key, value]) => ({
          key,
          value: { stringValue: typeof value === 'string' ? value : JSON.stringify(value) },
        })),
      };

      if (spanCtx) {
        // OTLP/JSON 스펙: traceId/spanId는 hex string으로 logRecord 최상위 필드
        // https://opentelemetry.io/docs/specs/otlp/#json-protobuf-encoding
        logRecord.traceId = spanCtx.traceId;
        logRecord.spanId = spanCtx.spanId;
        logRecord.flags = spanCtx.traceFlags;
      }

      const body = {
        resourceLogs: [{
          resource: { attributes: this.resource },
          scopeLogs: [{
            scope: { name: 'watchbox-next' },
            logRecords: [logRecord],
          }],
        }],
      };

      // suppressTracing 컨텍스트 안에서 fetch 호출
      // → @vercel/otel의 fetch instrumentation이 이 fetch를 무시 (trace에 안 박힘)
      // → 로그 송신이 요청 trace의 자식 span으로 오염되는 것 방지
      // fetch 자체는 await 안 해서 여전히 fire-and-forget (응답 시간 영향 X)
      context.with(suppressTracing(context.active()), () => {
        fetch(this.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).catch(() => {});
      });
    } catch {}
  }
}

const appEnv = process.env.NEXT_PUBLIC_ENV ?? 'local';

// local : stdout JSON (개발 로컬)
// dev   : stdout + OTel Collector (개발 서버, docker logs로도 확인 가능)
// prod  : OTel Collector만 (운영 서버)
export const logger = !isProduction
  ? pino({ level: process.env.LOG_LEVEL ?? 'debug' })
  : appEnv === 'prod'
    ? pino({ level: process.env.LOG_LEVEL ?? 'info' }, new OtelHttpDestination() as never)
    : pino(
        { level: process.env.LOG_LEVEL ?? 'info' },
        pino.multistream([
          { stream: process.stdout },
          { stream: new OtelHttpDestination() as never },
        ]),
      );
