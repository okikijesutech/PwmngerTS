# 🚀 Deployment Guide (Zero-Cost Hosting)

PwmngerTS is optimized for a modular, monorepo-friendly deployment. Follow this guide to host your secure vault and backend for free.

## 🏗 Prerequisites
- A **GitHub Account**.
- A **Vercel Account** (Frontend).
- A **Render Account** (Backend).
- A **Supabase Account** (Database).

---

## 1. 💾 Database: Supabase (PostgreSQL)
Supabase provides a generous free tier for PostgreSQL.

1.  Create a new project in [Supabase](https://supabase.com).
2.  Navigate to **Project Settings** -> **Database**.
3.  Copy the **Connection String** (Transaction mode, Port 6543).
4.  It should look like: `postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:6543/postgres?pgbouncer=true`
5.  **Save this for the Backend setup.**

---

## 2. ⚙️ Backend: Render (Node.js API)
Render allows you to host web services for free (with spin-down).

1.  Connect your GitHub repo to [Render](https://render.com).
2.  Create a **New Web Service**.
3.  **Settings:**
    - **Build Command:** `pnpm install && pnpm run build --filter=backend`
    - **Start Command:** `pnpm run start --filter=backend`
    - **Root Directory:** Leave as `.` (root).
4.  **Environment Variables:**
    - `DATABASE_URL`: (The value from Supabase)
    - `JWT_SECRET`: (A long random string)
    - `PORT`: `4000` (or leave default, Render detects automatically)
5.  **Note:** The free tier spins down after inactivity; the first request might take ~30s.

---

## 3. 🎨 Frontend: Vercel (Web Vault)
Vercel is the best platform for React/Vite applications.

1.  Connect your GitHub repo to [Vercel](https://vercel.com).
2.  Select the project and configure:
    - **Framework Preset:** `Vite`
    - **Root Directory:** `apps/web`
3.  **Environment Variables:**
    - `VITE_API_URL`: `https://your-backend-url.onrender.com`
4.  Vercel will automatically detect the `pnpm` workspace and deploy.

---

## 📁 Environment Variables Checklist

| Variable | Scope | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Backend | PostgreSQL connection string from Supabase. |
| `JWT_SECRET` | Backend | Secret for signing session tokens. |
| `VITE_API_URL` | Frontend | URL of your deployed Render backend. |

---

## 🧩 Extension & Mobile
For these platforms, you only need to ensure the `API_URL` points to your deployed Render backend:
- **Extension:** Update `apps/extension/src/background/background.ts` (or relevant sync logic).
- **Mobile:** Update `apps/mobile/constants/Config.ts` (if applicable).
