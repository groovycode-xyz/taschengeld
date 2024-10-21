# Project overview

**Tascheged - Allowance Tracker** is a kid-friendly, intuitive application designed for families to manage and track chore/task completions within the household. The app aims to make chore management fun and engaging for children while providing parents with the tools to monitor progress, allocate allowances, and foster essential life skills such as responsibility, accountability, honesty, and money management.

# Important Project Information

## Development Reference Documents

- `/requirements/frontend_instructions.md`
- `/requirements/_planDB.md`
- `/requirements/PRD.md`
- `/requirements/overview2.jpg`
- `/directory_tree.txt`
- `/requirements/TG-Wirefeame-1.jpg`
- `/requirements/tgeld_wireframe_01.jpg`

## Project Development Phase

- A mock database is implemented in `app/lib/mockDb.ts`
- A production database is implemented using PostgreSQL: tgeld

## Directory Structure

- `/app`
  - `/api`
  - `/global-settings`
  - `/home`
  - `/lib`
  - `/payday`
  - `/piggy-bank`
  - `/task-management`
  - `/types`
  - `/user-management`
  - `layout.tsx`
  - `page.tsx`
- `/components`
  - `/ui`
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
- Some feature-specific compnents for the main interfaces (like payday.tsx) are located directly in the /components folder

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
- We've implemented a mock database (`mockDb`) for development purposes, which should be replaced with actual API calls to our PostgreSQL database in production.

## Task Completion Interface Component

The Task Completion feature is not yet implemented. It should consist of the following key elements:

- Main TaskCompletionPage component
- List of available tasks in the form of cards with the task icon and title (from database where status = 'active')
- List of user cards with the user icon and name (from database where role = 'child')
- Drag and drop tasks from the task list to the user card to complete the task

### Task Completion Interface Features

- Displays available tasks in a grid layout (only Active tasks are displayed)
- Shows a row of user icons representing child users (only Child users are displayed)
- Allows for task completion by dragging and dropping tasks onto user icons
- Fetches real user data from the PostgreSQL database via API
- Fetches real task data from the PostgreSQL database via API

## Payday Interface Component

The Payday Interface feature is implemented in `components/Payday.tsx`. It is currently relying on mock data, and should be updated to fetch data from the PostgreSQL database via API. It follows the new Interface Component Structure guidelines and consists of the following key elements:

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

## Implemented Features

1. User Management

   - View all users
   - Add new user
   - Edit existing user
   - Delete user

2. Task Management

   - View all tasks
   - Add new task
   - Edit existing task
   - Delete task
   - Filter tasks by status (active/inactive)
   - Sort tasks by title, payout value, or creation date
   - Responsive design for various screen sizes
   - CRUD operations fully integrated with PostgreSQL database

## Development Guidelines

- Use TypeScript for all new components and functions
- Implement proper error handling and loading states
- Use the shadcn/ui component library for consistent styling
- Use Lucide icons for all icons
- Ensure all components are responsive and accessible
- Write unit tests for new components and functions

## API Integration

- All API calls should be made using the fetch API
- Handle API errors gracefully and display user-friendly error messages
- Use appropriate HTTP methods for different operations (GET, POST, PUT, DELETE)
- Ensure proper data validation before sending requests to the API

## State Management

- Use React hooks (useState, useEffect) for local state management
- Consider using React Context for global state if needed in the future
