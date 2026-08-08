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

## Local development

```bash
# start MongoDB (+ mongo-express on :8081)
docker compose up -d

cp .env.example .env   # optional
npm install
npm run start:dev
```

API: http://localhost:3000

## Docker

```bash
docker build -t k8s-demo-be:v1.0 .
```

Full stack (backend + frontend + mongo) is in `k8s-demo-infra`:

```bash
cd ../k8s-demo-infra
docker compose up --build
```

## Environment variables

| Variable    | Description                                      | Default           |
|-------------|--------------------------------------------------|-------------------|
| `PORT`      | HTTP port                                        | `3000`            |
| `USER_NAME` | Mongo username                                   | `admin`           |
| `USER_PWD`  | Mongo password                                   | `password`        |
| `DB_URL`    | Host/port                                        | `localhost:27017` |
| `DB_NAME`   | Database name                                    | `my-db`           |
| `MONGO_URI` | Optional full URI (overrides the vars above)     | —                 |
