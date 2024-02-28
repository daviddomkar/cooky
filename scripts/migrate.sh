#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER "$COOKY_USER" WITH PASSWORD '$COOKY_PASSWORD';
    GRANT ALL PRIVILEGES ON DATABASE "$POSTGRES_DB" TO "$COOKY_USER";
EOSQL

export DATABASE_URL="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB?host=/var/run/postgresql/"

prisma migrate dev --skip-generate
