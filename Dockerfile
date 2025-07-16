# Usar la imagen oficial de Bun
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Instalar dependencias (aprovechar cache de Docker)
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Instalar solo dependencias de producción
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copiar node_modules de la fase anterior
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [opcional] tests & build
ENV NODE_ENV=production
# RUN bun test
# RUN bun run build

# Imagen final de producción
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/src ./src
COPY --from=prerelease /usr/src/app/package.json .

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 bunjs
USER bunjs

# Exponer puerto (configurable via env var)
EXPOSE 3068

# Comando para ejecutar la aplicación
CMD ["bun", "run", "src/index.ts"] 