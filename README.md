# k8s-demo-be

NestJS API for the Kubernetes sample profile app.

Sibling repos:

- `k8s-demo-fe` – Next.js UI
- `k8s-demo-infra` – docker-compose + Kubernetes manifests ([system overview](../k8s-demo-infra/docs/overview.md))

## API

| Method | Path               | Description         |
|--------|--------------------|---------------------|
| GET    | `/get-profile`     | Fetch user profile  |
| POST   | `/update-profile`  | Upsert user profile |
| GET    | `/profile-picture` | Serve profile image |
| GET    | `/health`          | Health check        |

Profile fields: `name`, `title`, `email`, `skills` (+ photo via `/profile-picture`).

## Profile image

- **UI:** click the profile placeholder/picture to upload (JPEG/PNG/WebP).
- **Manual:** put a file in `images/` as `profile.jpg` (or `.png` / `.webp`).
- If none is present, the UI shows an initials placeholder.

See [images/README.md](./images/README.md).

## Manual local development

Run Mongo with Docker, and this API with npm (no Kubernetes).

```bash
# 1) env
cp .env.example .env

# 2) MongoDB only (enough for the API)
docker compose up -d mongodb

# Optional: also start Mongo Express UI on :8081
# docker compose up -d
# # or: docker compose up -d mongodb mongo-express

# 3) API
npm install
npm run start:dev
```

API: http://localhost:8000  
Health: http://localhost:8000/health

Then start the frontend from `k8s-demo-fe` (see that repo’s README). Full end-to-end manual steps: [k8s-demo-infra/docs/local-development.md](../k8s-demo-infra/docs/local-development.md).

## Docker image

```bash
docker build -t k8s-demo-be:v1.0 .
```

## Full stack / Kubernetes

| Mode | Command / location |
|------|--------------------|
| Full Docker Compose | `cd ../k8s-demo-infra && docker compose up --build` |
| Kubernetes | see [k8s-demo-infra/README.md](../k8s-demo-infra/README.md) |

## Environment variables

Copy from `.env.example` into `.env` for local runs.

| Variable    | Description                                      | Local default     |
|-------------|--------------------------------------------------|-------------------|
| `PORT`      | HTTP port                                        | `8000`            |
| `USER_NAME` | Mongo username                                   | `admin`           |
| `USER_PWD`  | Mongo password                                   | `password`        |
| `DB_URL`    | Host/port                                        | `localhost:27017` |
| `DB_NAME`   | Database name                                    | `my-db`           |
| `MONGO_URI` | Optional full URI (overrides the vars above)     | —                 |
