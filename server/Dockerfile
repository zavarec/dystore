# ---------- builder ----------
    FROM node:20-bookworm-slim AS builder
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm i -g npm@10.8.2 && npm ci --no-audit --no-fund
    
    COPY . .
    RUN npx prisma generate
    RUN npm run build
    
    # ---------- runner ----------
    FROM node:20-bookworm-slim
    WORKDIR /app
    ENV NODE_ENV=production
    
    COPY --from=builder /app/package*.json ./
    RUN npm ci --omit=dev --no-audit --no-fund
    
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    
    EXPOSE 3001
    CMD ["sh","-lc","npx prisma migrate deploy && node dist/main.js"]
    