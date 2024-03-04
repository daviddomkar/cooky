#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER "$COOKY_USER" WITH PASSWORD '$COOKY_PASSWORD';
    GRANT ALL PRIVILEGES ON DATABASE "$POSTGRES_DB" TO "$COOKY_USER";
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "$COOKY_USER";
EOSQL

export DATABASE_URL="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB?host=/var/run/postgresql/"

echo "Downloading required dependencies, this may take a while..."
cd docker-entrypoint-initdb.d && npm ci

echo "Setting up database..."
npm run prisma:migrate:reset -- --force
