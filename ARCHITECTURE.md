# Taschengeld - Architecture Overview

## Project Structure

The Taschengeld project follows a Next.js-based architecture with React components. Here's an overview of the main directories and their purposes:

- `/app`: Next.js app directory containing page components and API routes
- `/components`: Reusable React components
- `/public`: Static assets (images, icons, etc.)
- `/types`: TypeScript type definitions
- `/requirements`: Project requirements and documentation

## Key Components and Their Relationships

1. AppShell (`components/app-shell.tsx`)

   - Main layout component wrapping all pages
   - Includes Header and Sidebar components

2. PiggyBank (`components/piggy-bank.tsx`)

   - Main component for the Piggy Bank feature
   - Uses AddFundsModal, WithdrawFundsModal, and TransactionsModal

3. UserManagement (`components/user-management.tsx`)

   - Manages user profiles
   - Uses UserCard, AddUserModal, and EditUserModal components

4. TaskManagement (`components/task-management.tsx`)

   - Handles task creation and management
   - Uses AddTaskModal and EditTaskModal components

5. PaydayInterface (`components/payday-interface.tsx`)
   - Manages task approval and allowance allocation
   - Uses CompletedTaskCard component

## State Management

- Local state management using React hooks (useState, useEffect)
- Mock database (`app/lib/mockDb.ts`) for development, to be replaced with actual API calls

## API Structure

(Note: Currently using mock data. API routes to be implemented)

- `/api/users`: User management endpoints
- `/api/tasks`: Task management endpoints
- `/api/transactions`: Transaction management for Piggy Bank

## Authentication

- PIN-based system for parent/child mode switching (to be implemented)

## Styling

- Tailwind CSS for utility-first styling
- shadcn/ui components for consistent UI elements

## Testing

- Jest for unit and integration testing
- React Testing Library for component testing

This architecture provides a modular and scalable structure for the Taschengeld application, allowing for easy expansion and maintenance of features.
