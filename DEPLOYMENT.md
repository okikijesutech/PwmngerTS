# 🚀 Hosting & Deployment Guide (Zero-Cost)

PwmngerTS is a modern monorepo that can be hosted entirely for free using industry-leading platforms. Follow these steps to get your private vault live.

---

## 🏗️ Prerequisites
- [GitHub Account](https://github.com) (To host your source code)
- [Supabase Account](https://supabase.com) (For the PostgreSQL database)
- [Render Account](https://render.com) (For the Node.js API)
- [Vercel Account](https://vercel.com) (For the React Web Vault)

---

## 1. 💾 Database: Supabase Setup
Supabase provides a powerful, free PostgreSQL database.

1.  **Create Project**: Log in to Supabase and click **New Project**.
2.  **Set Password**: Choose a strong database password and **save it**.
3.  **Get Connection String**:
    - Navigate to your project's **main dashboard** (the page you see right after clicking into your project).
    - Look for the large **"Connect"** button at the top of the page.
    - A sidebar/drawer will open. Select **"Connection String"**.
    - Choose the **URI** tab.
    - Ensure **Transaction** mode is selected (Port 6543) for best performance with Render.
    - Copy the URL and replace `[YOUR-PASSWORD]` with the password you saved in Step 2.
    - *Example:* `postgresql://postgres:my-pass@db.xyz.supabase.co:6543/postgres?pgbouncer=true`

> [!TIP]
> **Forgot your password?** You can reset it by going to **Settings** (bottom of left sidebar) -> **Project Settings** -> **Database**.

---

## ⚙️ 2. Backend API: Render Setup
Render will host your Node.js backend and handle automatic database migrations.

1.  **New Web Service**: In Render, click **New +** -> **Web Service**.
2.  **Connect Repo**: Select your `PwmngerTS` repository.
3.  **Configuration**:
    - **Name**: `pwmnger-api`
    - **Environment**: `Node`
    - **Build Command**: `pnpm install && pnpm --filter backend build`
    - **Start Command**: `pnpm --filter backend exec prisma migrate deploy && pnpm --filter backend start`
4.  **Add Environment Variables**:
    - `DATABASE_URL`: (The Supabase connection string)
    - `JWT_SECRET`: 9e84b1021e79c1aec8b335d0ca048e29211ba88bc7c25b7c2d3aaed362084912
    - `NODE_ENV`: `production`

> [!NOTE]
> The free tier spins down after 15 minutes of inactivity. The first request after a break may take 30-50 seconds to "wake up" the server.

---

## 🎨 3. Frontend: Vercel Setup
Vercel hosts the React Web Vault with global CDN delivery.

1.  **New Project**: In Vercel, click **Add New** -> **Project**.
2.  **Import Repo**: Select `PwmngerTS`.
3.  **Project Settings**:
    - **Framework Preset**: `Vite`
    - **Root Directory**: `apps/web`
4.  **Build & Output Settings**: (Vercel usually auto-detects these for Vite)
    - **Build Command**: `pnpm run build`
    - **Output Directory**: `dist`
5.  **Environment Variables**:
    - `VITE_API_URL`: `https://pwmnger-api.onrender.com` (Your Render URL)
6.  **Deploy**: Click **Deploy**. Your vault should be live at `https://your-project.vercel.app`.

---

## � 4. CLI Deployment (Advanced)
If you prefer triggering deployments from your terminal, you have two options:

### Option A: Deploy Hooks (Recommended for CLI)
Render provides a unique "Deploy Hook" URL for every service. You can trigger a deploy by simply sending a `POST` request.

1.  In your Render Dashboard, go to your Web Service -> **Settings**.
2.  Scroll down to the **Deploy Hook** section.
3.  Copy the URL (it looks like `https://api.render.com/deploy/srv-xxx?key=yyy`).
4.  To deploy from your terminal, run:
    ```bash
    curl -X POST https://api.render.com/deploy/srv-xxx?key=yyy
    ```

### Option B: Official Render CLI
For deeper integration, you can use the official Render CLI (distributed as a binary).

1.  **Install (Windows)**:
    - Visit the [Render CLI Releases](https://github.com/renderinc/cli/releases) page.
    - Download the latest `render-windows-amd64.zip`.
    - Extract the `render.exe` file.
    - Add the folder containing `render.exe` to your system's **PATH** environment variable.
2.  **Login**:
    ```bash
    render login
    ```
3.  **Deploy**:
    ```bash
    render deploys create --service-id srv-xxx
    ```

---

## �📁 Environment Variables Summary

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Render | Connection string from Supabase Database settings. |
| `JWT_SECRET` | Render | Secret used to sign authentication tokens. |
| `VITE_API_URL` | Vercel | The public URL of your deployed Render backend. |

---

## 🧩 Extension & Mobile Sync
To sync your browser extension or mobile app with your new hosting:
1.  Open the Extension/App settings inside the UI.
2.  Update the **API URL** to point to your new Render backend.
3.  Alternatively, update the `VITE_API_URL` in `apps/extension/.env` before building.

---

## 🛠️ Troubleshooting & Support
- **CORS Errors**: Ensure your Render backend allows requests from your Vercel domain (Check `backend/.env` or source code).
- **Prisma Failures**: If the build fails on Render, double-check that your `DATABASE_URL` is correct and accessible.
- **Spin-down**: If the app feels stuck on "Logging in", it's likely the Render backend is waking up from sleep.

**Need help?** Open an issue on [GitHub](https://github.com/okikijesutech/PwmngerTS/issues).
