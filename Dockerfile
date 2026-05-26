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

# pino-opentelemetry-transport는 worker thread에서 동적으로 의존 패키지를 require함.
# Next.js standalone 트레이서가 동적 require를 추적하지 못해 누락되므로 직접 복사.
COPY --from=builder /app/node_modules/pino-abstract-transport ./node_modules/pino-abstract-transport
COPY --from=builder /app/node_modules/@opentelemetry ./node_modules/@opentelemetry

EXPOSE 3000
CMD ["node", "server.js"]