# ---------- builder ----------
    FROM node:20-bookworm-slim AS builder
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci --no-audit --no-fund
    
    # ВАЖНО: скопируем всё, чтобы билду были доступны конфиги и локали
    COPY . .
    
    RUN npm run build   # создаст .next
    
    # ---------- runner ----------
    FROM node:20-bookworm-slim
    WORKDIR /app
    ENV NODE_ENV=production
    
    COPY --from=builder /app/package*.json ./
    RUN npm ci --omit=dev --no-audit --no-fund
    
    # Билд-артефакты и нужные конфиги/локали
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/next.config.js ./next.config.js
    COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js
    # COPY --from=builder /app/public/locales ./public/locales
    
    EXPOSE 3000
    CMD ["npm","run","start","--","-p","3000","-H","0.0.0.0"]
    