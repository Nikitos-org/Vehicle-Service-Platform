## Auth Service

Foundation service for authentication and account identity in the Vehicle Service Platform.

Current scope:

- NestJS bootstrap aligned with the other backend services
- shared logging via `@vsp/backend-shared/logger`
- shared global exception filter via `@vsp/backend-shared/filters`
- health endpoints at `/health/live` and `/health/ready`
- environment loading through `.env.dev` and `.env.prod`

Next likely steps:

- move account and auth modules out of `user-service`
- add persistence and infrastructure modules
- wire service URL and deployment config into frontend and infra
