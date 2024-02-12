#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER "$COOKY_USER" WITH PASSWORD '$COOKY_PASSWORD';
    GRANT ALL PRIVILEGES ON DATABASE "$POSTGRES_DB" TO "$COOKY_USER";
EOSQL

for f in /docker-entrypoint-initdb.d/migrations/**/*; do
  case "$f" in
    *.sql)    echo "$0: running $f"; psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$f"; echo ;;
    *)        echo "$0: ignoring $f" ;;
  esac
  echo
done
