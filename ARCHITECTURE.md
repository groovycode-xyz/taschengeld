# Taschengeld Application Architecture

## Overview

Taschengeld is a Next.js-based web application designed to manage allowances and tasks for children. It uses a PostgreSQL database for data persistence and follows a modular architecture for maintainability and scalability.

## Tech Stack

- Frontend: Next.js 14 with React
- Backend: Next.js API Routes
- Database: PostgreSQL
- ORM: Direct SQL queries (no ORM used)
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- Authentication: Custom PIN-based system
- State Management: React hooks (useState, useEffect, useContext)

## Directory Structure

The Taschengeld project follows a Next.js-based architecture with React components and App Router. Here's an overview of the main directories and their purposes:

- `/app`: Contains the main application logic and page components.
  - `/lib`: Houses utility functions and database connection logic.
  - `/types`: Stores TypeScript type definitions for consistent data structures.
  - `/components`: Contains reusable React components used across the application.
- `/components`: Reusable UI components that are used in various parts of the application.
  - `Button.tsx`: A styled button component.
  - `Header.tsx`: The application header component.
- `/tests`: Includes unit and integration tests to ensure code reliability.
  - `userRepository.test.ts`: Tests for user repository functions.
- `/public`: Static assets like images, icons, and fonts.
- `/styles`: Global and component-specific styles.
- `/pages`: Next.js page components for routing.
- `/requirements`: Project requirements and documentation
  - `architecture_overview.md`: This document providing an architecture overview of the project.

## Key Components and Their Relationships

0. Wireframes

   - /requirements/TG-Wireframe-1.jpg
   - /requirements/tgeld_wireframe_01.jpg
   - /requirements/overview2.jpg

1. AppShell (`components/app-shell.tsx`)

   - Main layout component wrapping all pages
   - Includes Header and Sidebar components

2. Piggy Bank Interface (`components/piggy-bank.tsx`)

   - Main component for the Piggy Bank feature
   - Uses AddFundsModal, WithdrawFundsModal, and TransactionsModal

3. User Management Interface (`components/user-management.tsx`)

   - Manages user profiles
   - Uses UserCard, AddUserModal, and EditUserModal components

4. Task Management Interface (`components/task-management.tsx`)

   - Handles task creation and management
   - Uses AddTaskModal and EditTaskModal components

5. Payday Interface (`components/payday.tsx`)

   - Manages task approval and allowance allocation
   - Uses CompletedTaskCard component

6. Task Completion Interface (does not exist yet)

   - Manages task completion

## State Management

- Local state management using React hooks (useState, useEffect)
- Direct database interactions through API routes and repositories

## API Structure

- `/api/users`: User management endpoints
- `/api/tasks`: Task management endpoints
- `/api/transactions`: Transaction management for Piggy Bank

## Authentication

- PIN-based system for parent/child mode switching (to be implemented)

## Styling

- Tailwind CSS for utility-first styling
- shadcn/ui components for consistent UI elements

## Development Workflow

- Prettier is used for code formatting
- ESLint is used for linting
- TypeScript is used for type checking

## Known Issues

- Global state management was at one time implemented during development phase, but became problematic and has been removed. Some artifacts related to the global state (i.e.: Parent versus Child mode) may remain in the codebase. We will come back to address this feature as it is core to the functionality of the application.

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
