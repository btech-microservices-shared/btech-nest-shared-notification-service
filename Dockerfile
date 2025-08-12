FROM node:22.14.0-alpine3.21

# Habilitar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package.json ./
COPY pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install

# Copiar código fuente
COPY . .

# Exponer puertos (HTTP y gRPC)
EXPOSE 3200 50057

# Comando por defecto (se sobrescribe en docker-compose para desarrollo)
CMD ["pnpm", "start"]