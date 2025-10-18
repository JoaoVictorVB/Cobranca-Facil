#!/bin/sh#!/bin/sh

set -e

echo "🔄 Waiting for database..."

echo "Waiting for database to be ready..."sleep 5

sleep 5

echo "🔄 Running migrations..."

echo "Running Prisma migrations..."npx prisma migrate deploy

npx prisma migrate deploy

echo "🚀 Starting application..."

echo "Starting application..."node dist/main.js

exec node dist/main.js
