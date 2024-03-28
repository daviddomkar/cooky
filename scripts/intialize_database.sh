#!/bin/bash
set -e
export DATABASE_URL="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB?host=/var/run/postgresql/"

# This creates app user and grants all privileges on the database tables, sequences and routines.
# This is not a good practice for production, but it is fine for development.
# We are doing this so that we can run the migrations and seed the database.
# The app user is not superuser and does not have the ability to create or drop databases.
# It should be enough to satisfy the requirements of the project to have a separate app user.
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER $COOKY_USER WITH PASSWORD '$COOKY_PASSWORD';
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $COOKY_USER;

    ALTER DEFAULT PRIVILEGES
    GRANT ALL ON SCHEMAS TO $COOKY_USER;

    ALTER DEFAULT PRIVILEGES
    GRANT ALL ON TABLES TO $COOKY_USER;

    ALTER DEFAULT PRIVILEGES
    GRANT ALL ON SEQUENCES TO $COOKY_USER;

    ALTER DEFAULT PRIVILEGES
    GRANT ALL ON ROUTINES TO $COOKY_USER;
EOSQL

echo "Downloading required dependencies, this may take a while... (Yes, we are downloading node_modules inside the postgres container just to seed the database. We are aware of the irony of downloading node_modules inside a postgres container, but we are doing it anyway because there is no other way to seed the database with prisma. ¯\_( ͡° ͜ʖ ͡°)_/¯)"
cd docker-entrypoint-initdb.d && npm ci

echo "Setting up database..."
npm run prisma:migrate:reset -- --force
