# PlotFarm

> Intership Project

## Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | Next.js (TypeScript)|
| Backend   | Node.js + Express   |
| Database  | PostgreSQL          |
| ORM       | Prisma              |
| Dev Tools | Docker, pgAdmin     |

---

## Prerequisites

Make sure you have these installed before getting started:

| Tool | Version | Download |
|------|---------|----------|
| Docker Desktop | Latest | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) |
| Node.js | LTS | [nodejs.org](https://nodejs.org) |
| Git | Latest | [git-scm.com](https://git-scm.com) |

> After installing Docker Desktop, make sure to **launch it** and keep it running in the background whenever you work on the project.

---

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd PlotFarm
```

### 2. Set up your environment

```bash
cp .env.example .env
```

Open `.env` and fill in values. The defaults work for local development but **change the passwords** before sharing or deploying.

### 3. Start the project

```bash
docker compose up --build -d
```

The first build will take a few minutes as Docker downloads images and installs dependencies. Subsequent starts are much faster.

---

## Services

Once running, you can access:

| Service  | URL                   | Description              |
|----------|-----------------------|--------------------------|
| Frontend | http://localhost:3000 | Next.js app              |
| Backend  | http://localhost:3001 | Express API              |
| pgAdmin  | http://localhost:5050 | Database GUI             |
| Postgres | localhost:5432        | Direct DB connection     |

### Connecting pgAdmin to the database

1. Open http://localhost:5050
2. Log in with `PGADMIN_EMAIL` and `PGADMIN_PASSWORD` from your `.env`
3. Right click **Servers** → **Register** → **Server**
4. Under **General**, set Name to anything (e.g. `PlotFarm`)
5. Under **Connection**:
   - Host: `db`
   - Port: `5432`
   - Username: your `POSTGRES_USER`
   - Password: your `POSTGRES_PASSWORD`

---

## Commands

```bash
# Start containers (after first build)
docker compose up -d

# Stop containers
docker compose down

# Rebuild after Dockerfile or dependency changes
docker compose up --build -d

# Watch logs (all services)
docker compose logs -f

# Watch logs (specific service)
docker compose logs -f backend
docker compose logs -f frontend

# Open a shell inside a container
docker compose exec backend sh
docker compose exec frontend sh
```

---

## Database & Prisma

```bash
# Create a new migration after editing schema.prisma
docker compose exec backend npx prisma migrate dev --name your_migration_name

# Open Prisma Studio (visual DB editor in browser)
docker compose exec backend npx prisma studio
```

### Workflow for schema changes

1. Edit `backend/prisma/schema.prisma`
2. Run `docker compose exec backend npx prisma migrate dev --name describe_your_change`
3. Commit the generated migration files in `backend/prisma/migrations/`

> Never manually edit migration files. Let Prisma generate them.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | Database username | `app_user` |
| `POSTGRES_PASSWORD` | Database password | `changeme` |
| `POSTGRES_DB` | Database name | `app_db` |
| `PGADMIN_EMAIL` | pgAdmin login email | `admin@admin.com` |
| `PGADMIN_PASSWORD` | pgAdmin login password | `changeme` |
| `NODE_ENV` | Node environment | `development` |
| `PORT` | Backend port | `3001` |
| `NEXT_PUBLIC_API_URL` | Backend URL (used by frontend) | `http://localhost:3001` |

---

## Troubleshooting

**Containers won't start**

Make sure Docker Desktop is running, then try `docker compose down` and `docker compose up --build -d` again.

**Database connection errors**

The backend waits for Postgres to be healthy before starting, but if you still see errors give it a few seconds and check `docker compose logs db`.

**Port already in use**

Another process is using one of the ports (3000, 3001, 5050, 5432). Either stop that process or change the port in `docker-compose.yml` and `.env`.

**Changes not reflecting**

If you changed a Dockerfile or added a new dependency, you need to rebuild: `docker compose up --build -d`.
