import pino from 'pino';

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

      const body = {
        resourceLogs: [{
          resource: { attributes: this.resource },
          scopeLogs: [{
            scope: { name: 'watchbox-next' },
            logRecords: [{
              timeUnixNano: String(time * 1_000_000),
              severityNumber: SEVERITY_NUMBER[level] ?? 9,
              severityText: SEVERITY_TEXT[level] ?? 'INFO',
              body: { stringValue: msg ?? '' },
              attributes: Object.entries(attrs).map(([key, value]) => ({
                key,
                value: { stringValue: typeof value === 'string' ? value : JSON.stringify(value) },
              })),
            }],
          }],
        }],
      };

      fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).catch(() => {});
    } catch {}
  }
}

export const logger = isProduction
  ? pino({ level: process.env.LOG_LEVEL ?? 'info' }, new OtelHttpDestination() as never)
  : pino({ level: process.env.LOG_LEVEL ?? 'debug' });
