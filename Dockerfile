# Drakonimi Platform - Next.js Dockerfile
# Optimized for Raspberry Pi (ARM64) with network resilience

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat bash
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Robust npm install with retry logic and cache mounting
RUN --mount=type=cache,target=/root/.npm \
    set -ex && \
    MAX_ATTEMPTS=10 && \
    ATTEMPT=1 && \
    DELAY=5 && \
    until npm ci --prefer-offline --no-audit --progress=false || [ $ATTEMPT -eq $MAX_ATTEMPTS ]; do \
        echo "npm ci failed (attempt $ATTEMPT/$MAX_ATTEMPTS). Retrying in ${DELAY}s..." && \
        sleep $DELAY && \
        ATTEMPT=$((ATTEMPT + 1)) && \
        DELAY=$((DELAY * 2)) && \
        [ $DELAY -gt 60 ] && DELAY=60; \
    done && \
    [ $ATTEMPT -eq $MAX_ATTEMPTS ] && echo "npm ci failed after $MAX_ATTEMPTS attempts" && exit 1 || \
    echo "npm ci succeeded on attempt $ATTEMPT"

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1

# Accept Convex URL as build arg
ARG NEXT_PUBLIC_CONVEX_URL
ENV NEXT_PUBLIC_CONVEX_URL=$NEXT_PUBLIC_CONVEX_URL

ARG NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

ARG NEXT_PUBLIC_APP_TAGLINE
ENV NEXT_PUBLIC_APP_TAGLINE=$NEXT_PUBLIC_APP_TAGLINE

ARG NEXT_PUBLIC_BIFROEST_URL
ENV NEXT_PUBLIC_BIFROEST_URL=$NEXT_PUBLIC_BIFROEST_URL

# Build Next.js with standalone output
RUN npm run build && \
    npm prune --production

# ============================================
# Stage 3: Runner
# ============================================
FROM node:20-alpine AS runner
WORKDIR /app

# Accept runtime environment variables
ARG NEXT_PUBLIC_CONVEX_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_TAGLINE
ARG NEXT_PUBLIC_BIFROEST_URL

# Environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_CONVEX_URL=$NEXT_PUBLIC_CONVEX_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_TAGLINE=$NEXT_PUBLIC_APP_TAGLINE
ENV NEXT_PUBLIC_BIFROEST_URL=$NEXT_PUBLIC_BIFROEST_URL

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["node", "server.js"]
