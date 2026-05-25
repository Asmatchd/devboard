# ================================
# Stage 1: Base / Build
# ================================
# Use Node 24 Alpine — lightweight Linux distro, smaller image size
FROM node:24-alpine AS base

# Set working directory inside the container
WORKDIR /app

# Install pnpm globally inside the container
RUN npm install -g pnpm

# Copy workspace config first — pnpm needs this to understand the monorepo structure
COPY pnpm-workspace.yaml ./

# Copy lockfile — required for --frozen-lockfile to work
# This guarantees the container gets exact same versions as local machine
COPY pnpm-lock.yaml ./

# Copy root package.json
COPY package.json ./

# Copy root tsconfig — needed because frontend tsconfig extends it
COPY tsconfig.json ./

# Copy only package.json files first (not source code)
# This is a Docker caching trick — if package.json hasn't changed,
# Docker skips the pnpm install step on the next build (much faster)
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies using exact versions from lockfile
RUN pnpm install --frozen-lockfile

# Now copy the actual source code
# Done after install so code changes don't invalidate the dependency cache
COPY apps/backend ./apps/backend
COPY packages/shared ./packages/shared

# Move into the backend app directory
WORKDIR /app/apps/backend

# Compile TypeScript → JavaScript into dist/
RUN pnpm build

# ================================
# Stage 2: Production
# ================================
FROM node:24-alpine AS production

WORKDIR /app

RUN npm install -g pnpm

# Copy the entire workspace node_modules and app structure
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=base /app/apps/backend/dist ./apps/backend/dist
COPY --from=base /app/packages/shared ./packages/shared
COPY --from=base /app/package.json ./package.json

EXPOSE 3001

# Point to the correct dist location
CMD ["node", "apps/backend/dist/index.js"]
