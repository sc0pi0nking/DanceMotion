# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables (from build args)
# Note: SUPABASE_SERVICE_ROLE_KEY is NOT included here - it's only injected at runtime
# Note: ADMIN_EMAIL/ADMIN_PASSWORD are NOT included - they come via env_file at runtime only
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL

# Set as environment variables during build
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

# Increase Node.js memory limit to prevent SIGSEGV during build
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

# ---- run ----
FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production

# Install sharp dependencies for image optimization
RUN apk add --no-cache libc6-compat

COPY --from=build /app ./

# Runtime environment variables (werden von docker-compose via env_file gesetzt)
# SUPABASE_SERVICE_ROLE_KEY wird NUR zur Runtime injiziert (nicht im Image)

EXPOSE 3000
CMD ["npm", "run", "start"]
