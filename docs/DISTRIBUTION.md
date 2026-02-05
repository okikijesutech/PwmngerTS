# Distribution & Deployment Guide

This document outlines the procedures for deploying the PwmngerTS Server and distributing the Client applications.

## 📦 Architecture Overview

PwmngerTS consists of two primary components that must be distributed/hosted:
1.  **Server (Backend + Web Vault)**: Dockerized Node.js application.
2.  **Client (Browser Extension)**: Unpacked Chrome Extension.

## 🌐 Server Deployment (Self-Hosting)

For security and availability, the server should be hosted on a secure VPS or dedicated hardware.

### Prerequisites
- Docker Engine & Docker Compose
- Reverse Proxy (Nginx/Caddy) with TLS/SSL Termination (Required for crypto operations)
- Domain Name

### Deployment Steps

1.  **Clone Source**:
    ```bash
    git clone https://github.com/okikijesutech/PwmngerTS.git /opt/pwmnger
    ```

2.  **Environment Configuration**:
    Create `/opt/pwmnger/backend/.env`. Ensure high-entropy secrets.

    ```env
    DATABASE_URL="postgresql://user:pass@db:5432/pwmnger"
    JWT_SECRET="<generate-256-bit-secret>"
    PORT=4000
    ```

3.  **Service Orchestration**:
    ```bash
    docker-compose up -d --build
    ```

4.  **TLS Termination**:
    Configure your reverse proxy to forward traffic to `localhost:3000` (Web) and `localhost:4000` (API).
    *Note: The Web Vault requires a Secure Context (HTTPS) for `window.crypto.subtle` to function.*

## 🧩 Extension Distribution

The browser extension is the primary interface for credential autofill.

### Build Artifacts
Generate the production build:
```bash
cd apps/extension
pnpm install && pnpm build
```
The artifact will be located at `apps/extension/dist`.

### Distribution Channels

#### 1. Internal/Manual Distribution (enterprise/power-users)
- Package the `dist` directory into a ZIP archive (`pwmnger-extension-vX.X.X.zip`).
- Distribute via secure internal channels.
- Users install via `chrome://extensions` > "Load Unpacked" (Developer Mode).

#### 2. Chrome Web Store (Public)
- Create a Developer Dashboard account.
- Upload the ZIP archive main package.
- **Privacy Policy**: Ensure you disclose that data is end-to-end encrypted and no analytics are collected.
