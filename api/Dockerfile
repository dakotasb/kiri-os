FROM node:20-slim AS deps
WORKDIR /app

# build tools needed for better-sqlite3 native compilation
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

# ── runtime ──────────────────────────────────────────────────────
FROM node:20-slim AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000
CMD ["node", "server.js"]
