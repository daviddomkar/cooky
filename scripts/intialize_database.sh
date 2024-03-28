#!/bin/bash
set -e
export DATABASE_URL="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB?host=/var/run/postgresql/"

echo "Downloading required dependencies, this may take a while... (Yes, we are downloading node_modules inside the postgres container just to seed the database. We are aware of the irony of downloading node_modules inside a postgres container, but we are doing it anyway because there is no other way to seed the database with prisma. ¯\_( ͡° ͜ʖ ͡°)_/¯)"
cd docker-entrypoint-initdb.d && npm ci

echo "Setting up database..."
npm run prisma:migrate:reset -- --force

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER $COOKY_USER WITH PASSWORD '$COOKY_PASSWORD';

    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $COOKY_USER;

    GRANT ALL ON SCHEMA public TO $COOKY_USER;

    GRANT ALL ON ALL TABLES IN SCHEMA public TO $COOKY_USER;
    ALTER DEFAULT PRIVILEGES
    GRANT ALL ON TABLES TO $COOKY_USER;

    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO $COOKY_USER;
    ALTER DEFAULT PRIVILEGES
    GRANT ALL ON SEQUENCES TO $COOKY_USER;

    GRANT ALL ON ALL ROUTINES IN SCHEMA public TO $COOKY_USER;
    ALTER DEFAULT PRIVILEGES
    GRANT ALL ON ROUTINES TO $COOKY_USER;
EOSQL
