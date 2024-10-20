# Taschengeld - Architecture Overview

## Project Structure

The Taschengeld project follows a Next.js-based architecture with React components and App Router. Here's an overview of the main directories and their purposes:

- `/app`: Contains the main application logic and page components.
  - `/lib`: Houses utility functions and database connection logic.
  - `/types`: Stores TypeScript type definitions for consistent data structures.
  - `/components`: Contains reusable React components used across the application.
- `/components`: Reusable UI components that are used in various parts of the application.
  - `Button.tsx`: A styled button component.
  - `Header.tsx`: The application header component.
- `/mocks`: Contains mock data for development and testing purposes.
  - `mockDb.ts`: Mock database functions simulating backend interactions.
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

5. Payday Interface (`components/payday-interface.tsx`)

   - Manages task approval and allowance allocation
   - Uses CompletedTaskCard component

6. Task Completion Interface (`components/task-completion/task-completion-page.tsx`)

   - Manages task completion
   - Uses import TaskGrid, TouchTaskGrid, UserRow and TouchUserRow

## State Management

- Local state management using React hooks (useState, useEffect)
- Mock database (`app/lib/mockDb.ts`) for development, to be replaced with actual API calls to the database tgeld (app/lib/db.ts and .env.local).

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

## Development Workflow

- Prettier is used for code formatting
- ESLint is used for linting
- TypeScript is used for type checking

## Testing

- Jest for unit and integration testing
- React Testing Library for component testing

This architecture provides a modular and scalable structure for the Taschengeld application, allowing for easy expansion and maintenance of features.

## Known Issues

There is some inconsitencies related to the /components folder. The Task Completion interface has it's own subfolder /components/task-completion containing the related .tsx files. This should eventually be refactored to align to the placement of the other interfaces (payday.tsx, piggy-bank.tsx, task-management.tsx and user-management.tsx)

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
