FROM node:20-alpine AS base

# 1. Instalar dependências
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./

# CORREÇÃO: Copiamos a pasta prisma antes do npm ci para que o
# script 'postinstall' ("prisma generate") encontre o schema.prisma
COPY prisma ./prisma

# Instala dependências (incluindo devDependencies)
RUN npm ci

# 2. Build da aplicação
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gera o cliente Prisma (garantindo que está atualizado)
RUN npx prisma generate

# Build do Next.js
RUN npx next build

# 3. Imagem de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
