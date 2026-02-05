# Build Stage
FROM node:23-alpine AS builder

WORKDIR /app

# Install PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace config
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/

# Copy workspace packages
COPY packages/ ./packages/

# Install dependencies & Build Packages first
RUN pnpm install
RUN pnpm -r build

# Copy Web Source
COPY apps/web ./apps/web

# Build Web App
WORKDIR /app/apps/web
RUN pnpm build

# Serve Stage
FROM nginx:alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
