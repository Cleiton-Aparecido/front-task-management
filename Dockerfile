# Etapa 1 — Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Permite passar a URL da API na hora do build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package*.json ./
RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Etapa 2 — Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copia TUDO do builder, incluindo node_modules, .next, next.config.ts, etc.
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
