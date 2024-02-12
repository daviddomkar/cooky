FROM node:20.11.0 as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV NODE_ENV=production

RUN npm run build

FROM oven/bun:1

WORKDIR /app

COPY --from=build /app/.output .

ENV PORT=8080

EXPOSE 8080

ENTRYPOINT [ "bun", "run", "./server/index.mjs" ]
