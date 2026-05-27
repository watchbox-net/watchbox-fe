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

# 빌드 시 환경변수 주입 (NEXT_PUBLIC_* 는 빌드 타임에 필요)
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL

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