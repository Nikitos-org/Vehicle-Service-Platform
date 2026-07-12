FROM node:24-slim AS base

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/auth-service/package.json apps/auth-service/package.json
COPY packages/backend-shared/package.json packages/backend-shared/package.json

RUN npm ci --ignore-scripts

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/auth-service/node_modules ./apps/auth-service/node_modules
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./
COPY apps/auth-service ./apps/auth-service
COPY packages/backend-shared ./packages/backend-shared

RUN npm run build -w auth-service

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4204

COPY package.json package-lock.json ./
COPY apps/auth-service/package.json apps/auth-service/package.json
COPY packages/backend-shared/package.json packages/backend-shared/package.json

RUN npm ci --omit=dev --ignore-scripts --workspace auth-service --workspace @vsp/backend-shared --include-workspace-root=false

COPY --from=builder /app/apps/auth-service/package.json ./apps/auth-service/package.json
COPY --from=builder /app/apps/auth-service/dist ./apps/auth-service/dist
COPY --from=builder /app/packages/backend-shared/package.json ./packages/backend-shared/package.json
COPY --from=builder /app/packages/backend-shared/dist ./packages/backend-shared/dist

WORKDIR /app/apps/auth-service

EXPOSE 4204

CMD ["node", "dist/src/main.js"]
