# Stage 1: Install dependencies and build the app
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build Next.js
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Ensure directories exist before copying (handles empty public dir)
RUN mkdir -p ./public ./.next/static

# Copy output files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Copy public dir only if it exists (use || true to avoid failure)
RUN --mount=type=bind,from=builder,source=/app/public,target=/tmp/public \
    cp -r /tmp/public/. ./public/ 2>/dev/null || true

EXPOSE 3000
CMD ["node", "server.js"]
