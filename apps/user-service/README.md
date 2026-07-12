# User Service

NestJS service for user management, session-based access control, and integrations with Redis and RabbitMQ.

## Env files

- `.env.dev` is committed and used for local development.
- `.env.prod` is not committed and should be provided by the production environment.

The service loads `.env.dev` when `NODE_ENV` is not `production`. In production it looks for `.env.prod`, but deployed containers can also inject environment variables directly.

## Local values

The committed `.env.dev` assumes:

- PostgreSQL from local Docker on `localhost:5433`
- Redis from local Docker on `localhost:6379`
- RabbitMQ from local Docker on `localhost:5672`
- Frontend on `http://localhost:3000`

## Session settings

- `SESSION_SECRET` is required for `express-session`.
- It signs session cookies and protects them from tampering.
- In local development it can be a stable non-secret string.
- In production it must be a long random secret.

## Local run

From the repository root:

```bash
npm run docker:dev:up
npm run db:migrate:deploy:user
npm run dev
```
