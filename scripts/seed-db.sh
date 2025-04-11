#!/bin/bash

echo "Seeding database with test data..."

# Run the seed script
npx prisma db seed

echo "Database has been seeded with test data" 