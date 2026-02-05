FROM node:20-alpine AS base

ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

# Install OS deps for Prisma / bcrypt
RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure DATABASE_URL is set at build if Prisma needs it (can be dummy)
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production \
  PORT=3000

# Don't run as root in the final image
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]

