#!/bin/sh

# Run Prisma generate
npx prisma generate

# Run Prisma migrations
npx prisma migrate deploy

# Start the application
exec node dist/app.js