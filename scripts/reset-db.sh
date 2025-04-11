#!/bin/bash

echo "Resetting database..."

# Generate Prisma client first to ensure it has the latest schema
npx prisma generate

# Reset the database - this will drop all tables and recreate them
npx prisma migrate reset --force

# The migration reset will automatically run the seed script after migration
# If you want to run the seed script separately, uncomment the line below
# npx prisma db seed

echo "Database has been reset and seeded with test data" 