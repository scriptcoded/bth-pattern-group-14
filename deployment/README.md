# Deployment

Deployment is split into two parts.
1. Building and pushing to registry
2. Deploying updated images

## Building / pushing

A GitHub Actions workflow runs when a new tag is pushed to GitHub. It
automatically builds the relevant Docker images and pushes to Docker hub.

## Deploying

Deployment is automatically done by
[Watchtower](https://containrrr.dev/watchtower/) running together with the
deployed application. No manual intervention is required unless the database has
to be migrated.

The whole deployment runs as a Docker Compose project on a droplet at
DigitalOcean. Managing the deployment is most easily done using the
`DOCKER_HOST` environment variable:

```bash
$ export DOCKER_HOST=ssh://elab.nihlen.dev
$ docker ps # Docker commands will now act on the remove server
```

Update deployment:

```bash
$ cd deployment
$ docker compose up --env-file .env -d --remove-orphans
```

## Migrating database

Migrating the database is most easily done by opening an SSH tunnel and running
Prisma Migrate through it:

```bash
# Open SSH tunnel
$ ssh -L 5432:localhost:5432 elab.nihlen.dev

# In a new terminal
$ cd api
# Migrate with custom credentials
$ DATABASE_URL="postgres://user:pass@localhost:5432/elab?schema=public" \
  npx prisma migrate deploy
```
