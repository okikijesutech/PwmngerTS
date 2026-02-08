# 🧪 PwmngerTS Testing Sandbox

The PwmngerTS sandbox is an isolated, Docker-based environment designed for testing new features, performing security audits, and experimenting without affecting any production data.

## 🚀 Quick Start

1.  **Prerequisites:** Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/) installed.
2.  **Environment Setup:**
    ```bash
    cp .env.example .env
    ```
3.  **Spin up the Sandbox:**
    ```bash
    docker-compose up --build
    ```
4.  **Access Points:**
    - **Web Vault:** [http://localhost:3000](http://localhost:3000)
    - **Backend API:** [http://localhost:4000](http://localhost:4000)
    - **Database (PostgreSQL):** `localhost:5432`

---

## 🛠 Sandbox Scenarios

### 1. Feature Testing
Test new UI components or backend logic in isolation.
- Edit code in `apps/web` or `backend`.
- Rebuild specific services: `docker-compose up --build web` or `docker-compose up --build backend`.

### 2. Database Migrations
Test Prisma schema changes safely.
- Run migrations inside the container:
  ```bash
  docker-compose exec backend npx prisma migrate dev
  ```

### 3. Network Latency Simulation
Simulate real-world conditions using tools like `pumba` or manual network throttling in Chrome DevTools to see how the "Zero-Knowledge" sync performs under stress.

---

## 🔒 Security Isolation

To run a "True Sandbox" (completely disconnected from the internet):
1.  Disconnect your machine from Wi-Fi/Ethernet.
2.  The Docker containers communicate via an internal network and do NOT need internet access to function for local vault operations.
3.  This is ideal for testing potentially "malicious" browser extensions or scripts that might try to exfiltrate data.

---

## 🧹 Resetting the Sandbox
To wipe all data and start fresh:
```bash
docker-compose down -v
```
*(This removes the `postgres_data` volume and all registered users).*
