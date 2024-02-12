# Cooky

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Requirements

- [Node LTS (20.11.0)](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/products/docker-desktop/)

## Setup

- Install all dependencies:

  ```bash
  npm install
  ```

- Install all recommended VS Code extensions for the best development experience. VS Code will prompt you to install them when you open the project.

## Running the project

The easiest way to run the project is to use the provided Docker Compose configuration. This will build production application server and a PostgreSQL database.

```bash
docker compose up
```

The database schema will be created with some initial data, application will be available at `http://localhost:8080`.

This setup is just for testing purposes, to preview the finished product and not inteded for development.

The database will be persisted in a `cooky` docker volume. To remove the database and start from scratch, you can use the following commands:

```bash
docker compose down -v
docker compose up
```

## Development

For development, you can use the development server provided by Nuxt. This will enable hot reload and debugging functionality.

To start the development server, you can use the following command:

```bash
npm run dev
```

The application will be available on `http://localhost:3000`.

> This will also start the database provided by Docker Compose in a detached mode using the `docker compose up -d postgres` as part of the `dev` script.

It is recommended to run `npm run prisma:migrate:reset` to reset the database and reseed it with prisma cli. This way you can be sure that the database is in the correct state when developing schema changes inside `prisma/schema.prisma`.

The database will be persisted in the `cooky` docker volume. To remove the database and start from scratch, you can use the following commands:

```bash
docker compose down -v
```

When making changes to the database schema `prisma/schema.prisma`, you can use the following commands to make changes to local development database:

```bash
npm run prisma:push
```

When the changes are stable, create a new migration:

```bash
npm run prisma:migrate:dev
```

For more information of Prisma CLI commands, see the [Prisma documentation](https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production).

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```
