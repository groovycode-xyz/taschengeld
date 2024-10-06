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
  - `/page.tsx`
  - `/layout.tsx`
  - `/api`
    - `route.ts`
    - `route.ts`
    - `route.ts`
- `/components`
  - `ui`
    - `button.tsx`
    - `card.tsx`
    - `dialog.tsx`
    - `input.tsx`
    - `label.tsx`
    - `table.tsx`
- `/types`
  - `tasks.ts`
  - `users.ts`
- `/public`
  - `/images`
    - `icons`
    - `images`
    - `sounds`

## Tech Stack

| **Frontend Framework** | Next.js | Building the user interface with React, server-side rendering, and APIs. |
| **Styling** | Tailwind CSS | Utility-first CSS for responsive and customizable designs. |
| **UI Components** | shadcn/ui | Customizable UI components built on top of Radix UI and Tailwind CSS. |
| **Sound Effects** | Howler.js | Managing and playing audio effects. |
| **Backend Framework** | Next.js API Routes | Handling backend logic and APIs within the Next.js framework. |
| **Database** | PostgreSQL | Relational database for managing users, tasks, transactions, and accounts. |
| **ORM** | Prisma | Simplifying database interactions and managing migrations. |
| **Authentication** | Internal PIN-based system | Implementing role-based access control with PIN verification for parent mode |
| **Version Control** | Git with GitHub | Managing code repositories and collaboration. |
| **IDE** | Cursor AI using VS Code engine | Development environment with rich extensions and support. |
| **Design & Prototyping**| Excalidraw | Designing wireframes, mockups, and interactive prototypes. |
| **Sound Effects** | Howler.js | Managing and playing audio effects. |

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

The Payday Interface feature is implemented in `components/payday-interface.tsx`. It consists of the following key elements:

- Main PaydayInterface component
- TaskCard component
- TaskList component
- TaskFilter component
- TaskSort component

### Payday Interface Features

- Displays a list of completed tasks
- Allows for bulk approval/rejection of tasks
- Allows for sorting of tasks
- Allows for filtering of tasks
- Allows for searching of tasks
- Allows for modification of task payout values

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
