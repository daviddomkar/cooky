FROM node:20.11.0

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY ./prisma ./prisma

ENTRYPOINT [ "npm", "run", "prisma:migrate:reset" ]
