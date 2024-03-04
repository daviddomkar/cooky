FROM node:20.11.0 as build

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY /prisma ./prisma

RUN npm ci

COPY . .

ENV NODE_ENV=production

RUN npm run build

FROM node:20.11.0

WORKDIR /app

COPY --from=build /app/.output .

ENV PORT=8080

EXPOSE 8080

ENTRYPOINT [ "node", "./server/index.mjs" ]
