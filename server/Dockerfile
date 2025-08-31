# ---------- builder ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # 1) deps для сборки
    COPY package*.json ./
    RUN npm ci
    
    # 2) исходники
    COPY . .
    
    # 3) генерим prisma client и собираем nest в dist/
    RUN npx prisma generate
    RUN npm run build
    
    # ---------- runner ----------
    FROM node:20-alpine
    WORKDIR /app
    ENV NODE_ENV=production
    
    # tini (аккуратный shutdown)
    RUN apk add --no-cache tini
    ENTRYPOINT ["/sbin/tini","--"]
    
    # 1) только прод-зависимости
    COPY --from=builder /app/package*.json ./
    RUN npm ci --omit=dev
    
    # 2) перенести сгенерированный prisma client из builder
    COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
    COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
    
    # 3) билд и схема
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    
    EXPOSE 3001
    
    # применяем миграции и стартуем API
    CMD sh -c "npx prisma migrate deploy && node dist/main.js"
    