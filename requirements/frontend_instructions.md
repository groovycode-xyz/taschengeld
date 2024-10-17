# Project overview

**Tascheged - Allowance Tracker** is a kid-friendly, intuitive application designed for families to manage and track chore/task completions within the household. The app aims to make chore management fun and engaging for children while providing parents with the tools to monitor progress, allocate allowances, and foster essential life skills such as responsibility, accountability, honesty, and money management.

# Important Project Information

## Development Reference Documents

- `/requirements/frontend_instructions.md`
- `/requirements/_planDB.md`
- `/requirements/PRD.md`
- `/requirements/overview2.jpg`
- `/directory_tree.txt`

## Project Development Phase

- A mock database is implemented in `app/lib/mockDb.ts`

## Directory Structure

- `/app`
  - `/api`
  - `/completed-tasks`
  - `/global-settings`
  - `/home`
  - `/lib`
  - `/payday`
  - `/piggy-bank`
  - `/task-completion`
  - `/task-management`
  - `/types`
  - `/user-management`
  - `layout.tsx`
  - `page.tsx`
- `/components`
  - `/ui`
    - (UI components)
  - (Feature-specific components)
- `/hooks`
- `/prisma`
- `/public`
  - `/images`
  - `/sounds`
- `/requirements`
- `/types`

## Additional Directories

- `/hooks`: Contains custom React hooks used across the application.
- `/prisma`: Used for database schema management (even though we're not using an ORM).
- `/requirements`: Stores project documentation and requirements.

## Tech Stack

| Component                | Technology                     | Purpose                                                                      |
| ------------------------ | ------------------------------ | ---------------------------------------------------------------------------- |
| **Frontend Framework**   | Next.js                        | Building the user interface with React, server-side rendering, and APIs.     |
| **Styling**              | Tailwind CSS                   | Utility-first CSS for responsive and customizable designs.                   |
| **UI Components**        | shadcn/ui                      | Customizable UI components built on top of Radix UI and Tailwind CSS.        |
| **Sound Effects**        | Howler.js                      | Managing and playing audio effects.                                          |
| **Backend Framework**    | Next.js API Routes             | Handling backend logic and APIs within the Next.js framework.                |
| **Database**             | PostgreSQL                     | Relational database for managing users, tasks, transactions, and accounts.   |
| **Database Access**      | Direct SQL queries             | Handling database operations without an ORM                                  |
| **Authentication**       | Internal PIN-based system      | Implementing role-based access control with PIN verification for parent mode |
| **Version Control**      | Git with GitHub                | Managing code repositories and collaboration.                                |
| **IDE**                  | Cursor AI using VS Code engine | Development environment with rich extensions and support.                    |
| **Design & Prototyping** | draw.io                        | Designing wireframes, mockups, and interactive prototypes.                   |
| **Sound Effects**        | Howler.js                      | Managing and playing audio effects.                                          |

## Menus and Features

### For Parents

- **Application Management**
  - Always visible Toggle between Parent and Child modes using PIN verification
  - Always visible "cog icon" to adjust global application settings
- **User Management Interface**
  - Create and manage user profiles within the application
- **Task Management Interface**
  - Define and manage chores/tasks with descriptions, icons, sounds, and payout values.
  - Toggle task visibility (Active/Inactive) without deletion.
- **Payday Interface**
  - Approve or reject completed tasks to allocate allowances to the Piggy Bank.
  - Manage transactions with detailed logs and optional photo attachments.
  - Review completed tasks filtered by child, and sorted by task name, or time intervals.
  - Bulk approval/rejection of tasks.

### For Children

- **Task Completion**
  - View available chores and mark them as completed through an interactive interface.
  - Drag and drop tasks into the User icons to "mark tasks" complete
  - Celebrate task completion with animations and sounds.
- **Piggy Bank**
  - View account balances and transaction histories to manage earned allowances and expenditures.

# Rules

- All new components should go into the /components/ui folder in the format of: example-component.tsx unless otherwise specified
- Some feature-specific compnents (like payday-interface.tsx) are located directly in the /components folder

# Frontend Implementation Instructions

## Piggy Bank InterfaceComponent

The Piggy Bank feature is implemented in `components/piggy-bank.tsx`. It consists of the following key elements:

- Main PiggyBank component
- AddFundsModal component
- CompletedTaskCard component
- WithdrawFundsModal component
- TransactionsModal component
- Displays a grid of user balances
- Manages state for user balances and transactions
- Handles opening and closing of modals

### AddFundsModal and WithdrawFundsModal

- Allow users to add or withdraw funds from their piggy bank
- Implement form validation for input amounts
- Allow bulk approval/rejection of tasks

### TransactionsModal

- Displays a list of transactions for a selected user

### Architectural Changes

- The Piggy Bank feature introduces a new pattern for managing modals and state within a single component.
- We've implemented a mock database (`mockDb`) for development purposes, which should be replaced with actual API calls in production.

## Task Completion Interface Component

The Task Completion feature is implemented in `components/task-completion.tsx`. It consists of the following key elements:

- Main TaskCompletion component
- TaskCard component
- TaskList component
- UserCard component
- UserList component

### Task Completion Interface Features

- Allows for task completion by dragging and dropping tasks from the TaskList compnent onto the UserCard components in the UserList component

## Payday Interface Component

The Payday Interface feature is implemented in `components/Payday.tsx`. It follows the new Interface Component Structure guidelines and consists of the following key elements:

- Main Payday component
- Filtering and sorting functionality
- Bulk action controls
- CompletedTaskCard component for individual task display

### Payday Interface Features

- Displays a list of completed tasks
- Allows for bulk approval/rejection of tasks
- Allows for sorting of tasks by date completed or payout value
- Allows for filtering of tasks by user
- Allows for modification of task payout values

### Payday Interface Summary:

1. The component uses React hooks (useState and useEffect) for state management and side effects.
2. It fetches completed tasks and users from a mock database using getMockDb().
3. The interface allows filtering tasks by user (child users only) and sorting by date completed or payout value.
4. It supports bulk approval/rejection of tasks and individual task approval/rejection.
5. The component uses various UI components from the project's component library, such as Button, Select, ScrollArea, and CompletedTaskCard.
6. The interface is styled with Tailwind CSS classes.
7. Key functionalities include:
   - Fetching and displaying completed tasks
   - Filtering tasks by user (including an "All Users" option)
   - Sorting tasks by date or payout value
   - Selecting individual or all tasks for bulk actions
   - Approving or rejecting tasks individually or in bulk
   - Modifying payout values for tasks

This component serves as an example of the new Interface Component Structure, combining all functionality into a single file for improved maintainability and reduced prop drilling.

## Task Management Interface Component

The Task Management Interface feature is implemented in `components/task-management.tsx`. It consists of the following key elements:

- Main TaskManagement component
- TaskCard component
- TaskList component
- TaskFilter component
- TaskSort component
- TaskAdd component

### Task Management Interface Features

- Allows for modification of tasks by launching the EditTaskModal
- Allows for addition of tasks by launching the AddTaskModal

## User Management Interface Component

The User Management Interface feature is implemented in `components/user-management.tsx`. It consists of the following key elements:

- Main UserManagement component
- UserCard component
- UserList component
- UserAdd component
- UserEdit component

### User Management Interface Features

- Allows for modification of users by launching the UserEditModal
- Allows for addition of users by launching the UserAddModal

## Interface Component Structure

To maintain consistency and simplify our codebase, we've adopted a unified approach for interface components. This approach combines the main component and its interface into a single file. Here are the key points of this structure:

1. **Single File Component**: Each interface (e.g., Payday, Task Management, User Management) should be contained within a single TypeScript React file (e.g., `Payday.tsx`, `TaskManagement.tsx`, `UserManagement.tsx`).

2. **Naming Convention**: Use PascalCase for the component name, which should match the filename (e.g., `export function Payday() { ... }` in `Payday.tsx`).

3. **State Management**: Utilize React hooks (useState, useEffect) for local state management within the component.

4. **Data Fetching**: Include data fetching logic (using the mock database for now) within the component using useEffect.

5. **Event Handlers**: Define all event handlers (e.g., handleApprove, handleReject) within the component.

6. **UI Structure**: The component should return a single JSX structure that includes:

   - A header section with the component's title and any relevant icons
   - The main interface elements (filters, action buttons, etc.)
   - A scrollable area for displaying lists of items (if applicable)

7. **Sub-components**: If the interface requires complex sub-components, these can be defined in separate files and imported into the main component file.

Example structure:
typescript
'use client';
import React, { useState, useEffect } from 'react';
import { relevantComponents } from '@/components/ui/...';
import { relevantIcons } from 'lucide-react';
import { getMockDb } from '@/app/lib/mockDb';
export function InterfaceName() {
// State declarations
// useEffect for data fetching
// Event handlers and other functions
return (

<div>
{/ Header section /}
{/ Main interface elements /}
{/ Scrollable area if needed /}
</div>
);
}

This approach simplifies our component structure, reduces the need for prop drilling, and keeps related logic and UI elements together. It also makes it easier for developers to understand and maintain each interface component.

When creating new interface components or refactoring existing ones, please follow this structure to maintain consistency across the project.
