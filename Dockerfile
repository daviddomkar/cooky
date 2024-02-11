FROM node:20.11.0 as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV NODE_ENV=production

RUN npm run build

FROM oven/bun:1

COPY --from=build /app/.output /app

ENV PORT=8080

EXPOSE 8080

ENTRYPOINT [ "bun", "run", "/app/server/index.mjs" ]
