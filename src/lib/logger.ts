import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

// 로컬(NODE_ENV=development): transport 없이 stdout JSON 출력만 함. OTel 관련 env 불필요.
// 운영(NODE_ENV=production): pino-opentelemetry-transport가 OTLP HTTP로 OTel Collector에 전송.
//   → 필요한 env: OTEL_EXPORTER_OTLP_ENDPOINT (exporter가 자동으로 읽어 /v1/logs 로 전송)
export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isProduction ? 'info' : 'debug'),
  ...(isProduction && {
    transport: {
      target: 'pino-opentelemetry-transport',
      options: {
        resourceAttributes: {
          'service.name': 'watchbox-next',
          'service.version': process.env.APP_VERSION ?? 'unknown',
          'deployment.environment': process.env.NEXT_PUBLIC_ENV ?? 'unknown',
        },
      },
    },
  }),
});
