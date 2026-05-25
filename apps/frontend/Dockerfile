# ================================
# Stage 1: Base / Build
# ================================
# Use Node 24 Alpine to build the React app
FROM node:24-alpine AS base

WORKDIR /app

RUN npm install -g pnpm

# Copy workspace and lockfile first
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copy root tsconfig — needed because frontend tsconfig extends it
COPY tsconfig.json ./

# Copy package.json files only — Docker cache trick
# If dependencies haven't changed, pnpm install is skipped on rebuild
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Install exact dependency versions from lockfile
RUN pnpm install --frozen-lockfile

# Copy source code after install to maximize cache hits
COPY apps/frontend ./apps/frontend
COPY packages/shared ./packages/shared

WORKDIR /app/apps/frontend

# Build React app — outputs static files to dist/
# After this step Node.js is no longer needed
RUN pnpm build

# ================================
# Stage 2: Production
# ================================
# Use nginx to serve static files — much lighter than running Node in production
# nginx is a battle-tested, high-performance web server
FROM nginx:alpine AS production

# Copy the compiled static files from build stage into nginx's serving directory
COPY --from=base /app/apps/frontend/dist /usr/share/nginx/html

# Copy our custom nginx config — handles React Router and API proxying
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# nginx listens on port 80 by default
EXPOSE 80

# Start nginx in the foreground
# "daemon off" is required for Docker — containers need a foreground process to stay alive
CMD ["nginx", "-g", "daemon off;"]
