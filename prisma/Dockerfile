FROM postgres:16.1

RUN apt-get update && \
  apt-get install -yq --no-install-recommends \
  openssl \
  curl \ 
  wget \
  git \
  gnupg \
  ca-certificates

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && apt-get install nodejs -y

RUN chmod 777 -R /docker-entrypoint-initdb.d
