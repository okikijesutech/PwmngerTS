# Deployment Guide

PwmngerTS is designed to be easily self-hosted using Docker.

## Prerequisites
*   [Docker](https://docs.docker.com/get-docker/) & Docker Compose installed.
*   Git installed.

## Quick Start (Production)

1.  **Clone the repository**
    ```bash
    git clone https://github.com/okikijesutech/PwmngerTS.git
    cd PwmngerTS
    ```

2.  **Start the specific services**
    ```bash
    docker-compose up -d --build
    ```
    
    This command starts:
    *   **PostgreSQL Database** (Port 5432)
    *   **Backend API** (Port 4000)
    *   **Web App** (Port 3000)

3.  **Access the App**
    *   Web Interface: [http://localhost:3000](http://localhost:3000)
    *   API Health: [http://localhost:4000/health](http://localhost:4000/health)

## Environment Variables

The `docker-compose.yml` comes with default values for local testing. For production, **you must update these**:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `POSTGRES_PASSWORD` | Database password | `password` |
| `JWT_SECRET` | Secret for signing auth tokens | `change_this_secret` |
| `DATABASE_URL` | Connection string for Prisma | `postgresql://...` |

## Updating

To update to the latest version:

```bash
git pull
docker-compose up -d --build
```

## Troubleshooting

**Database Connection Error?**
The backend waits for Postgres to be ready. If it fails initially, it will restart automatically. Check logs with:
```bash
docker-compose logs -f backend
```
