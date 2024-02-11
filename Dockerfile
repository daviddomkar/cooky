FROM oven/bun:1 as install

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

FROM node:lts as build

WORKDIR /app

COPY --from=install /app /app

ENV NODE_ENV=production

RUN npm run build

FROM oven/bun:1

COPY --from=build /app/.output /app

ENV PORT=8080

EXPOSE 8080

ENTRYPOINT [ "bun", "run", "/app/server/index.mjs" ]
