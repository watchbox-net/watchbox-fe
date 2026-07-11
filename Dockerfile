# syntax=docker/dockerfile:1.7

# 1단계: 의존성 설치
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund

# 2단계: 빌드
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 빌드 시 환경변수 주입 (NEXT_PUBLIC_* 는 브라우저 번들에 빌드 타임 인라인)
# - NEXT_PUBLIC_ENV : local/dev/prod 분기 (otel-browser, 기타 브라우저 코드에서 사용)
# - NEXT_PUBLIC_APPLE_LOGIN_ENABLED : 애플 로그인 버튼 노출 on/off ('true' 일 때만)
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_APPLE_LOGIN_ENABLED
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV
ENV NEXT_PUBLIC_APPLE_LOGIN_ENABLED=$NEXT_PUBLIC_APPLE_LOGIN_ENABLED

# Node 힙 상한 (JVM의 -Xmx 대응)
# → 4GB 박스에 prod 스택 상주분(~2.5-3GB)을 제외하면 빌드 여유가 ~1-1.5GB뿐이라
#   빌드가 메모리를 무한정 잡아 호스트를 압박하지 않도록 천장을 막음 (스왑이 비상 백스톱)
ENV NODE_OPTIONS="--max-old-space-size=896"

RUN npm run build

# 3단계: 실행 (경량 이미지)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Next.js file tracer가 instrumentation.ts의 동적 의존성을 놓치므로 OTel 패키지 강제 포함
# (@vercel/otel 내부에서 @opentelemetry/* 다수를 동적 로드 → standalone에 누락 → register() 호출 전 import 실패)
COPY --from=builder /app/node_modules/@vercel ./node_modules/@vercel
COPY --from=builder /app/node_modules/@opentelemetry ./node_modules/@opentelemetry

EXPOSE 3000
CMD ["node", "server.js"]