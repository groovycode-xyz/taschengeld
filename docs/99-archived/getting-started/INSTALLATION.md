# Installation Guide

## Prerequisites

- Node.js (Latest LTS version)
- PostgreSQL v16
- Docker (optional, for containerized setup)

## Setup Instructions

1. Clone the repository

```bash
git clone [repository-url]
cd taschengeld
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your database credentials and other configuration.

4. Initialize the database

```bash
# If using Docker
docker-compose up -d db

# If using local PostgreSQL
psql -U postgres -f db/init.sql
```

5. Run the development server

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Docker Setup

To run the entire application using Docker:

```bash
docker-compose up -d
```

The application will be available at [http://localhost:21971](http://localhost:21971)

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run linting
- `npm run lint:dir` - Lint specific directories
