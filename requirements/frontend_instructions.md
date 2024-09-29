# Project overview
**Tascheged - Allowance Tracker** is a kid-friendly, intuitive application designed for families to manage and track chore/task completions within the household. The app aims to make chore management fun and engaging for children while providing parents with the tools to monitor progress, allocate allowances, and foster essential life skills such as responsibility, accountability, honesty, and money management.

# Feature requirements

## Tech Stack
| **Frontend Framework** | Next.js                   | Building the user interface with React, server-side rendering, and APIs.    |
| **Styling**            | Tailwind CSS              | Utility-first CSS for responsive and customizable designs.                  |
| **UI Components**      | shadcn/ui                 | Customizable UI components built on top of Radix UI and Tailwind CSS.       |
| **Sound Effects**      | Howler.js                 | Managing and playing audio effects.                                         |
| **Backend Framework**  | Next.js API Routes        | Handling backend logic and APIs within the Next.js framework.               |
| **Database**           | PostgreSQL                | Relational database for managing users, tasks, transactions, and accounts.   |
| **ORM**                | Prisma                    | Simplifying database interactions and managing migrations.                  |
| **Authentication**     | Internal PIN-based system | Implementing role-based access control with PIN verification for parent mode |
| **Version Control**    | Git with GitHub           | Managing code repositories and collaboration.                               |
| **IDE**                | Cursor AI using VS Code engine        | Development environment with rich extensions and support.                    |
| **Design & Prototyping**| Excalidraw                     | Designing wireframes, mockups, and interactive prototypes.                   |

## Menus and Features
### For Parents

- **Application Management**
  - Always visible Toggle between Parent and Child modes using PIN verification
  - Always visible "cog icon" to adjust global application settings

- **User Management**
  - Create and manage user profiles within the application
  
- **Task Management**
  - Define and manage chores/tasks with descriptions, icons, sounds, and payout values.
  - Toggle task visibility (Active/Inactive) without deletion.
  
- **Allowance Management**
  - Approve or reject completed tasks to allocate allowances to the Piggy Bank.
  - Manage transactions with detailed logs and optional photo attachments.
  - Review completed tasks grouped by child, task name, or time intervals.
  - Bulk approval/rejection of tasks.

### For Children

- **Task Completion**
  - View available chores and mark them as completed through an interactive interface.
  - Celebrate task completion with animations and sounds.
  
- **Piggy Bank**
  - View account balances and transaction histories to manage earned allowances and expenditures.

# Relvant Docs
- xxx

# Current File Structure
/Users/jamespace/Projects/tgeld
├── .next (hidden)
├── app
│   ├── fonts
│   │   ├── GeistMonoVF.woff
│   │   └── GeistVF.woff
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── ui
│       └── button.tsx
├── lib
│   └── utils.ts
├── .node_modules (hidden)
├── requirements
│   ├── frontend_instructions.md
│   └── tree.txt
├── .eslintrc.json (hidden)
├── .gitignore (hidden)
├── components.json
├── directory_tree.py
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

# Rules
- All new components should go into the /components/ui folder in the format of: example-component.tsx unless otherwise specified
- All new pages should go into the /app folder 