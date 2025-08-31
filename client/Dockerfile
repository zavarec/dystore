# ---------- builder ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci
    
    COPY . .
    RUN npm run build   # создаст .next
    
    # ---------- runner ----------
    FROM node:20-alpine
    WORKDIR /app
    ENV NODE_ENV=production
    
    # deps для рантайма
    COPY --from=builder /app/package*.json ./
    RUN npm ci --omit=dev
    
    # копируем конфиги
    COPY --from=builder /app/next.config.js ./next.config.js
    COPY --from=builder /app/next-i18next.config.js ./next-i18next.config.js
    
    # статика и билд
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    
    EXPOSE 3000
    CMD ["npm","run","start","--","-p","3000","-H","0.0.0.0"]
    