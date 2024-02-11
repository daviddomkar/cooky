FROM oven/bun:1 as builder

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

ENV NODE_ENV=production

# Really ugly hack to make sure the build doesn't hang forever
# This is because bun run build hangs in docker :/
RUN timeout 15s bun run build

FROM oven/bun:1

COPY --from=builder /app/.output /app

ENV PORT=8080

EXPOSE 8080

ENTRYPOINT [ "bun", "run", "/app/server/index.mjs" ]
