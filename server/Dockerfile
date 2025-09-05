# ---------- builder ----------
    FROM node:20-bookworm-slim AS builder
    WORKDIR /app

    # OpenSSL нужен уже на стадии билдов (иногда prisma generate его проверяет)
    RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
    
    COPY package*.json ./
    RUN npm i -g npm@10.8.2 && npm ci --no-audit --no-fund
    
    COPY . .
    RUN npx prisma generate

    RUN npm run build
    
    # ---------- runner ----------
    FROM node:20-bookworm-slim
    WORKDIR /app
    ENV NODE_ENV=production

    # OpenSSL в рантайме: нужен для prisma engines и migrate deploy
    RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
    
    COPY --from=builder /app/package*.json ./
    RUN npm ci --omit=dev --no-audit --no-fund

    # Обязательно копируем prisma (schema + migrations!)
    COPY --from=builder /app/prisma ./prisma

    COPY --from=builder /app/dist ./dist
    
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    
    EXPOSE 3001
    CMD ["sh","-lc","npx prisma migrate deploy && node dist/main.js"]
    