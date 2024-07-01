# Build Stage
FROM node:lts-alpine3.20 AS build
LABEL org.opencontainers.image.description "A simple Node.js Order API for PayeTonKawa company using Express.js and Prisma ORM"

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

#Production stage
FROM node:lts-alpine3.20 AS production

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

COPY prisma/schema.prisma /app/prisma/schema.prisma

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Set the entrypoint to the entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]