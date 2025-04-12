# Tire Collection API

A robust backend service for managing tire collection operations, including vehicle tracking, inventory management, invoicing, and operational logistics.

## 🚀 Tech Stack

- **Backend**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Documentation**: Swagger/OpenAPI
- **Authentication**: Token-based authentication
- **Logging**: Morgan
- **PDF Generation**: PDFKit

## 🏗️ Project Structure

```
tire-collection-api/
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma       # Prisma schema definition
│   ├── migrations/         # Database migrations
│   └── seed.ts             # Database seeding script
├── scripts/                # Utility scripts
│   ├── reset-db.sh         # Reset database script
│   └── seed-db.sh          # Seed database script
├── src/                    # Source code
│   ├── controllers/        # Route controllers
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   ├── types/              # TypeScript type definitions
│   ├── scripts/            # Utility scripts
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Server initialization
│   └── swagger.json        # API documentation
└── public/                 # Static files
```

## 📋 Core Features

- **Vehicle Management**: Track and manage collection vehicles
- **Tire Inventory**: Categorize and track tire inventory
- **Service Centers**: Manage collection points and service centers
- **Order Processing**: Handle tire collection orders
- **Invoicing**: Generate and manage invoices
- **Weight Tracking**: Record and track tire weights
- **Operator Management**: Assign and track operators (collectors, drivers, handlers)
- **GPS Tracking**: Monitor vehicle locations in real-time
- **Drop Zone Management**: Track unloading operations

## 🚦 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MihailCosor/tire-collection-api.git
cd tire-collection-api

# Install dependencies
npm install

# Set up the database
npm run reset-db

# Seed the database with initial data
npm run seed-db
```

### Running the API

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on port 3000 by default. You can change this by setting the PORT environment variable.

## 📚 API Documentation

API documentation is available at `/api-docs` when the server is running. This provides a Swagger UI interface for exploring and testing the API endpoints.

## 🛠️ Database Management

### Schema

The database schema includes models for:
- Services (collection points)
- Operators (personnel)
- Vehicles
- Tire Categories
- Orders
- Invoices
- Depot Stock
- Weighing records
- Drop Zone operations
- Vehicle Location tracking

### Database Commands

```bash
# Reset the database (caution: this will delete all data)
npm run reset-db

# Seed the database with test data
npm run seed-db

# Run Prisma Studio to view/edit data
npx prisma studio
```

## 📝 License

ISC License

## 👤 Author

Mihail Cosor 