# Taschengeld Application Architecture

## Overview

Taschengeld is a Next.js-based web application designed to manage allowances and tasks for children. It uses a PostgreSQL database for data persistence and follows a modular architecture for maintainability and scalability.

## Tech Stack

- Frontend: Next.js 15 with React 19
- Backend: Next.js API Routes
- Database: PostgreSQL 16 with Prisma ORM
  - Schema management through Prisma migrations
  - Type-safe database queries with Prisma Client
  - Full backup/restore capabilities
  - Strict data integrity constraints
- Styling: Tailwind CSS
- UI Components: shadcn/ui (built on Radix UI primitives)
- Authentication: Custom PIN-based system
- State Management: React Context API (useState, useEffect, useContext)
- Device Support: Desktop/Laptop and Tablets only (768px+ screens)

### Additional Libraries

- **Icons**: lucide-react
- **Animations**: canvas-confetti, tailwindcss-animate
- **Utilities**: clsx, tailwind-merge, class-variance-authority
- **Validation**: zod
- **File Operations**: file-saver

## Directory Structure

The Taschengeld project follows a Next.js-based architecture with React components and App Router. Here's an overview of the main directories and their purposes:

- `/app`: Contains the main application logic and page components
  - `/api`: API routes for data operations
    - `/backup`: Endpoints for database backup operations
    - `/restore`: Endpoints for database restore operations
    - Various resource endpoints (users, tasks, completed-tasks, piggy-bank, settings)
  - `/lib`: Core application logic
    - `/services`: Service layer for database operations (replaced repository pattern)
    - `/validation`: Zod schemas for request validation
    - `prisma.ts`: Prisma client singleton
    - `error-handler.ts`, `errors.ts`: Error handling utilities
    - `logger.ts`: Logging utilities
  - `/types`: TypeScript type definitions for domain models
- `/prisma`: Prisma schema and migrations
  - `schema.prisma`: Database schema definition
  - `/migrations`: Auto-generated migration files
- `/components`: Reusable UI components
  - `/ui`: shadcn/ui components
  - `/context`: React Context providers
  - Feature-specific components (user-management, task-management, etc.)
- `/docs`: Project documentation
- `/public`: Static assets (images, sounds)

## Database Architecture

### Schema Management

- Prisma migrations for schema evolution
- Type-safe schema definition in `schema.prisma`
- Automatic TypeScript type generation
- Proper foreign key relationships with referential actions

### Data Operations

- Type-safe queries through Prisma Client
- Automatic query optimization and connection pooling
- Transaction support with `prisma.$transaction`
- Service layer pattern for business logic encapsulation
- Backup/restore functionality with SQL dumps

### Key Features

- Timezone-aware timestamps
- Standardized numeric precision for currency
- Cascading deletes for referential integrity
- Circular reference handling
- Full and partial backup/restore support

For detailed database information, see `docs/architecture/DATABASE.md`.

## Key Components and Their Relationships

See `docs/LAYOUT_ARCHITECTURE.md` for detailed information.

0. Wireframes

   - /requirements/TG-Wireframe-1.jpg
   - /requirements/tgeld_wireframe_01.jpg
   - /requirements/overview2.jpg

1. AppShell (`components/app-shell.tsx`)

   - Main layout component wrapping all pages
   - Includes Header and Sidebar components (`components/header.tsx` and `components/sidebar.tsx`)

2. Piggy Bank Interface (`components/piggy-bank.tsx`)

   - Displays current balance and allows adding and withdrawing funds, and viewing transaction history
   - Uses AddFundsModal, WithdrawFundsModal, and TransactionsModal

3. User Management Interface (`components/user-management.tsx`)

   - Manages user profiles creation, editing, and deletion
   - Uses UserCard, AddUserModal, and EditUserModal components

4. Task Management Interface (`components/task-management.tsx`)

   - Handles task creation, editing, and deletion
   - Uses AddTaskModal and EditTaskModal components

5. Payday Interface (`components/payday.tsx`)

   - Manages completed task approvals and rejections
   - Uses CompletedTaskCard component

6. Task Completion Interface (`components/task-completion.tsx`)

   - Manages task completion

7. Global Settings Interface (`components/global-settings.tsx`)

   - Manages global settings
   - Enable or disable parent mode
   - Enable or disable PIN-based authentication
   - Set Currency
   - Backup and Restore Database
   - Reset selected or all data

## State Management

- Local state management using React hooks (useState, useEffect)
- Direct database interactions through API routes and repositories

## API Structure

- `/api/users`: User management endpoints
- `/api/tasks`: Task management endpoints
- `/api/transactions`: Transaction management for Piggy Bank
- Refer to `/requirements/API.md` for detailed information.

## Authentication

- No user logins
- PIN-based system for parent/child mode switching

## Styling

- Tailwind CSS for utility-first styling
- shadcn/ui components for consistent UI elements
- See `docs/color-system/README.md` and `docs/color-system/IMPLEMENTATION.md` for detailed information.

## Responsive Design & Device Support

- **Minimum viewport**: 768px (enforced via CSS)
- **Breakpoints**:
  - `md:` (768px+) - Tablet portrait and up
  - `lg:` (1024px+) - Desktop/laptop screens
  - `xl:` (1280px+) - Large desktop screens
- **Touch targets**: 48px minimum on tablets
- **Hover effects**: Enhanced on desktop with `@media (hover: hover)`
- **Sidebar**: Fixed on desktop, collapsible on tablets

## Development Workflow

- Prettier is used for code formatting
- ESLint is used for linting
- TypeScript is used for type checking

## Known Issues

- none

## Git Commit Preparation Process

When preparing for a git commit, always follow these steps:

1. Review and update the CHANGELOG.md file with any new features, changes, or fixes.
2. Update the PROJECT_STATUS.md file to reflect the current state of the project, including any completed tasks or new known issues.
3. Prepare a concise but descriptive commit message that summarizes the changes made.
4. Run any linters or tests to ensure code quality and catch any potential issues.
5. Stage the changes using `git add .`
6. Commit the changes using `git commit -m "Your prepared commit message"`
7. Push the changes to the remote repository using `git push origin main` (or the appropriate branch name)

Following these steps ensures that the project documentation remains up-to-date and that commit messages are informative and consistent.

## Scripts (per package.json)

- dev: "next dev" (for running the development server)
- build: "next build" (for building the production version)
- start: "next start" (for starting the production server)
- lint: "next lint" (for linting the entire project)
- lint:dir: "next lint app components" (for linting specific directories)
