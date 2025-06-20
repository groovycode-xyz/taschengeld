# Taschengeld User Experience Flow Documentation

## Application Overview

Taschengeld is a family allowance tracker application implemented as a Next.js web application with a PostgreSQL database. The application helps families manage chores, tasks, and allowances for children.

## Core Components and Database Structure

### Database Schema

#### Users (`users` table)

- `user_id` (PK, Auto-increment)
- `name` (VARCHAR(100))
- `icon` (VARCHAR(50))
- `birthday` (DATE)
- `piggybank_account_id` (INT, UNIQUE)
- `created_at` (TIMESTAMPTZ)
- `sound_url` (VARCHAR(255))

#### Tasks (`tasks` table)

- `task_id` (PK, Auto-increment)
- `title` (VARCHAR(100))
- `description` (TEXT)
- `icon_name` (VARCHAR(50))
- `sound_url` (VARCHAR(255))
- `payout_value` (DECIMAL(15,2))
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### Completed Tasks (`completed_tasks` table)

- `c_task_id` (PK, Auto-increment)
- `user_id` (FK -> users)
- `task_id` (FK -> tasks)
- `description` (TEXT)
- `payout_value` (DECIMAL(15,2))
- `created_at` (TIMESTAMPTZ)
- `comment` (TEXT)
- `attachment` (VARCHAR(255))
- `payment_status` (VARCHAR(20))

#### Piggybank Accounts (`piggybank_accounts` table)

- `account_id` (PK, Auto-increment)
- `user_id` (FK -> users)
- `account_number` (VARCHAR(20), UNIQUE)
- `balance` (DECIMAL(15,2))
- `created_at` (TIMESTAMPTZ)

#### Piggybank Transactions (`piggybank_transactions` table)

- `transaction_id` (PK, Auto-increment)
- `account_id` (FK -> piggybank_accounts)
- `amount` (DECIMAL(15,2))
- `transaction_type` (VARCHAR(10))
- `transaction_date` (TIMESTAMPTZ)
- `description` (TEXT)
- `photo` (VARCHAR(255))
- `completed_task_id` (FK -> completed_tasks)

#### App Settings (`app_settings` table)

- `setting_id` (PK, Auto-increment)
- `setting_key` (VARCHAR(50), UNIQUE)
- `setting_value` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## User Interface Flow

### 1. Home Page (`/app/home`)

- Entry point of the application
- Displays overview dashboard
- Navigation to all main features
- Quick access to frequently used functions

### 2. User Management (`/app/user-management`)

**Components:**

1. Main View (`components/user-management.tsx`):

   - Header with title and Add User button
   - Grid layout of user cards
   - Loading and error states
   - User sorting by birthday

2. User Card (`components/user-card.tsx`):

   - Displays user information
   - Click handler for editing
   - Visual representation of:
     - Name
     - Icon
     - Birthday
     - Sound indicator

3. Add User Modal (`components/add-user-modal.tsx`):

   - Form fields:
     - Name (text input, required)
     - Birthday (date input, required, max=today)
     - Sound selector with preview button
     - Icon selector (default=user)
   - Action buttons:
     - Cancel (X icon)
     - Save (green outline)

4. Edit User Modal (`components/edit-user-modal.tsx`):

   - Same fields as Add User Modal
   - Additional delete button
   - Birthday validation:
     - Cannot be future date
     - Maximum age limit (120 years)
     - Required field

5. Icon Selection (`components/icon-selector-modal.tsx`):

   - Grid of available icons
   - Predefined icon set:
     - baby, laugh, smile, star, heart
     - flower, user, users, bird, bug
     - cat, dog, egg, rabbit, snail
     - squirrel, turtle
   - Preview of selected icon

6. Sound Selection (`components/select-user-sound-modal.tsx`):
   - List of available sounds
   - Preview functionality
   - Supports both .mp3 and .wav formats

**Data Flow:**

1. User Fetching:

   ```typescript
   GET /api/users
   Response: User[]
   ```

2. User Creation:

   ```typescript
   POST / api / users;
   Body: {
     name: string;
     icon: string;
     sound_url: string | null;
     birthday: string; // YYYY-MM-DD
   }
   ```

3. User Updates:

   ```typescript
   PUT /api/users/${userId}
   Body: User
   ```

4. User Deletion:
   ```typescript
   DELETE /api/users/${userId}
   ```

**State Management:**

- Local state for modal visibility
- Local state for user data
- Optimistic updates for UI responsiveness
- Error handling with user feedback
- Loading states during API operations

**Error Handling:**

- Input validation
- API error handling
- User feedback via toast messages
- Fallback UI for error states

### 3. Task Management (`/app/task-management`)

**Components:**

1. Main View (`components/task-management.tsx`):

   - Header with title and Add Task button
   - Filter controls:
     - Status filter (All/Active/Inactive)
     - Sort options (Title/Payout/Created Date)
   - Grid layout of task cards
   - Loading and error states

2. Task Card (Embedded in task-management.tsx):

   - Visual states:
     - Active: Blue theme
     - Inactive: Gray theme
   - Display elements:
     - Icon (large, centered)
     - Title
     - Description
     - Payout value
     - Status indicator
   - Click handler for editing
   - Hover effects and transitions

3. Add Task Modal (`components/add-task-modal.tsx`):

   - Form fields:
     - Title (required)
     - Description
     - Icon selector
     - Payout value (defaults to 0)
     - Active status toggle
   - Sound selection (optional)
   - Action buttons:
     - Cancel
     - Save

4. Edit Task Modal (`components/edit-task-modal.tsx`):
   - Same fields as Add Task Modal
   - Delete functionality
   - Validation:
     - Cannot delete tasks with unpaid entries
     - Required fields validation
     - Payout value validation

**Data Flow:**

1. Task Fetching:

   ```typescript
   GET /api/tasks
   Response: Task[]
   ```

2. Task Creation:

   ```typescript
   POST /api/tasks
   Body: {
     title: string;
     description?: string;
     icon_name?: string;
     sound_url?: string;
     payout_value: number;
     is_active: boolean;
   }
   ```

3. Task Updates:

   ```typescript
   PUT /api/tasks/${taskId}
   Body: Partial<Task>
   ```

4. Task Deletion:
   ```typescript
   DELETE /api/tasks/${taskId}
   Validation: Blocks deletion if task has unpaid entries
   ```

**State Management:**

- Local state for tasks list
- Filter and sort state
- Modal visibility states
- Loading and error states
- Optimistic updates

**Error Handling:**

- API error handling with user feedback
- Validation error messages
- Auto-dismissing error notifications (5s timeout)
- Task deletion restrictions
- Loading state during operations

**Visual Feedback:**

- Color-coded task status
- Interactive hover states
- Loading indicators
- Error messages
- Success confirmations

### 4. Task Completion (`/app/task-completion`)

**Components:**

1. Main View (`components/task-completion.tsx`):

   - Header with title
   - Two main sections:
     - Active Tasks grid
     - Completed Tasks list (unpaid only)
   - Loading and error states
   - Fireworks celebration effect

2. Task Cards:

   - Visual styling:
     - Blue theme for active tasks
     - Interactive hover effects
     - Shadow and transition animations
   - Display elements:
     - Task icon
     - Title
     - Description
     - Payout value

3. Child User Selection Modal (`components/child-user-selection-modal.tsx`):

   - List of available child users
   - User selection handler
   - Modal close action

4. Completion Celebration:
   - Visual fireworks animation
   - Sound effects sequence:
     1. Task-specific sound
     2. User-specific sound
     3. Applause sound

**Audio System:**

1. Task Sounds:

   - Played when task is selected
   - Supports .mp3 and .wav formats
   - Fallback handling for missing files

2. User Sounds:

   - Played after user selection
   - Supports .mp3 and .wav formats
   - Promise-based playback sequence

3. Celebration Sounds:
   - Applause sound on completion
   - Error handling for audio playback
   - Synchronized with fireworks animation

**Data Flow:**

1. Initial Data Loading:

   ```typescript
   GET / api / active - tasks; // Fetch available tasks
   GET / api / users; // Fetch child users
   GET / api / completed - tasks; // Fetch unpaid completed tasks
   ```

2. Task Completion:

   ```typescript
   POST / api / completed - tasks;
   Body: {
     user_id: number;
     task_id: number;
   }
   ```

3. Task Deletion:
   ```typescript
   DELETE /api/completed-tasks/${taskId}
   ```

**State Management:**

- Active tasks list
- Child users list
- Completed tasks tracking
- Modal visibility states
- Processing state locks
- Animation states
- Error handling

**Process Flow:**

1. Task Selection:

   ```typescript
   1. User clicks task card
   2. Play task sound
   3. Open user selection modal
   4. Prevent interactions while processing
   ```

2. User Selection:

   ```typescript
   1. User selects child
   2. Close selection modal
   3. Play user sound
   4. Create completed task record
   5. Play celebration animation/sound
   6. Update completed tasks list
   ```

3. Task Deletion:
   ```typescript
   1. User clicks delete button
   2. Show confirmation dialog
   3. Delete task if confirmed
   4. Update completed tasks list
   ```

**Error Handling:**

- API error catching and display
- Audio playback fallbacks
- Processing state protection
- Loading state management
- User feedback for actions

**Visual Feedback:**

- Loading indicators
- Error messages
- Interactive card states
- Celebration animations
- Sound effect confirmations

### 5. Payday Interface (`/app/payday`)

**Components:**

1. Main View (`components/payday.tsx`):

   - Fixed header with title and bulk action controls
   - Scrollable content area with completed tasks
   - Loading and error states
   - Bulk action confirmation dialog

2. Completed Task Card (`components/completed-task-card.tsx`):
   - Task icon and title
   - Payment amount display
   - Task comment (if any)
   - Checkbox for bulk selection
   - Payment status indicators
   - Approval confirmation dialog

**Data Flow:**

1. Initial Data Loading:

   ```typescript
   GET / api / completed - tasks; // Fetches unpaid completed tasks
   ```

2. Task Payment Processing:

   ```typescript
   PUT /api/completed-tasks
   Body: {
     c_task_id: number;
     payment_status: 'Paid' | 'Unpaid';
     is_rejected?: boolean;
   }
   ```

3. Transaction Creation:
   - Automatically creates a piggy bank transaction when a task is marked as paid
   - Updates the child's account balance
   - Records the transaction with task details

**State Management:**

- Completed tasks list
- Selected tasks for bulk actions
- Loading states
- Error handling
- Dialog visibility states
- Task payment status tracking

**Process Flow:**

1. Individual Task Approval:

   ```typescript
   1. User clicks approve on a task
   2. Show confirmation dialog
   3. On confirm:
      - Update task status
      - Create piggy bank transaction
      - Remove task from list
   ```

2. Bulk Task Approval:
   ```typescript
   1. User selects multiple tasks
   2. Click bulk approve button
   3. Show confirmation dialog
   4. On confirm:
      - Process each task sequentially
      - Create transactions
      - Update UI
   ```

**Error Handling:**

- API error catching and display
- Transaction failure recovery
- Loading state management
- User feedback messages
- Optimistic updates with rollback

**Visual Feedback:**

- Task status colors:
  - Active: Blue theme
  - Paid: Green theme
  - Rejected: Red theme
- Loading indicators
- Success/error messages
- Interactive states
- Selection indicators

**Security:**

- Parent mode required
- Transaction validation
- Balance verification
- Audit trail maintenance

### 6. Piggy Bank Interface (`/app/piggy-bank`)

**Components:**

1. Main View (`components/piggy-bank.tsx`):

   - Fixed header with title
   - Grid of user account cards
   - Loading and error states
   - Role-based access control

2. Account Cards:

   - User icon and name
   - Current balance display
   - Action buttons (Parent mode):
     - Deposit funds
     - Withdraw funds
   - Transaction history access
   - Theme-aware styling

3. Add Funds Modal (`components/add-funds-modal.tsx`):

   - Amount input
   - Comments field
   - Photo attachment option
   - Confirmation controls

4. Withdraw Funds Modal (`components/withdraw-funds-modal.tsx`):

   - Amount input
   - Comments field
   - Photo attachment option
   - Balance validation

5. Transaction History Modal (`components/transaction-history-modal.tsx`):
   - List of transactions
   - Transaction details:
     - Amount
     - Date
     - Description
     - Photo (if attached)

**Data Flow:**

1. Initial Data Loading:

   ```typescript
   GET / api / piggy - bank / dashboard; // Fetches all user accounts and balances
   ```

2. Fund Deposits:

   ```typescript
   POST /api/piggy-bank
   Body: {
     account_id: number;
     amount: number;
     transaction_type: 'deposit';
     description?: string;
     photo?: string;
   }
   ```

3. Fund Withdrawals:
   ```typescript
   POST /api/piggy-bank
   Body: {
     account_id: number;
     amount: number; // Negative amount
     transaction_type: 'withdrawal';
     description?: string;
     photo?: string;
   }
   ```

**State Management:**

- User accounts list
- Selected account
- Modal visibility states
- Loading states
- Error handling
- Transaction processing states

**Process Flow:**

1. Deposit Process:

   ```typescript
   1. Select user account
   2. Open deposit modal
   3. Enter amount and details
   4. Submit transaction
   5. Update account balance
   ```

2. Withdrawal Process:
   ```typescript
   1. Select user account
   2. Open withdrawal modal
   3. Validate against balance
   4. Enter amount and details
   5. Submit transaction
   6. Update account balance
   ```

**Error Handling:**

- API error catching and display
- Balance validation
- Transaction validation
- Loading state management
- User feedback messages

**Visual Feedback:**

- Account card themes:
  - Light mode: Green subtle background
  - Dark mode: Dark green background
- Interactive states
- Loading indicators
- Success/error messages
- Transaction confirmations

**Security:**

- Parent mode required for deposits/withdrawals
- Balance validation
- Transaction limits
- Audit trail
- Photo storage security

### 7. Family Overview (`/app/family`)

The Family Overview is implemented through the User Management interface (`components/user-management.tsx`), providing a comprehensive view of family members and their management.

**Components:**

1. Main View (`components/user-management.tsx`):

   - Fixed header with title
   - Grid of user cards
   - Add user button
   - Loading and error states

2. User Card (`components/user-card.tsx`):

   - User icon display
   - User name
   - Role indicator (Parent/Child)
   - Interactive hover states
   - Theme-aware styling

3. Add User Modal:

   - Name input
   - Icon selection
   - Role selection
   - Birthday input
   - Sound selection
   - Form validation

4. Edit User Modal:
   - Pre-filled user details
   - Icon modification
   - Sound modification
   - Delete user option
   - Validation checks

**Data Flow:**

1. User Management:

   ```typescript
   GET /api/users              // Fetch all users
   POST /api/users             // Create new user
   PUT /api/users/${userId}    // Update user
   DELETE /api/users/${userId} // Delete user
   ```

2. Account Management:
   ```typescript
   POST / api / piggy - bank / accounts; // Create piggy bank account for new user
   ```

**State Management:**

- Users list
- Modal visibility states
- Form data handling
- Loading states
- Error handling
- Edit mode tracking

**Process Flow:**

1. User Creation:

   ```typescript
   1. Click add user button
   2. Fill in user details
   3. Select icon and sound
   4. Submit form
   5. Create piggy bank account
   ```

2. User Modification:
   ```typescript
   1. Select user card
   2. Edit user details
   3. Update icon/sound
   4. Save changes
   5. Update UI
   ```

**Error Handling:**

- Form validation
- API error catching
- Duplicate user checks
- Required field validation
- User feedback messages

**Visual Feedback:**

- Card themes:
  - Light mode: Green subtle background
  - Dark mode: Dark green background
- Interactive states
- Loading indicators
- Success/error messages
- Role-based styling

**Security:**

- Parent mode required
- Role validation
- Data validation
- Audit trail
- Delete confirmation

### 8. Global Settings (`/app/global-settings`)

**Components:**

1. Main View (`components/global-app-settings.tsx`):

   - Fixed header with title
   - Scrollable content area
   - Sections for different settings
   - Protected access control

2. Access Control Section:

   - Role enforcement toggle
   - Global PIN management:
     - PIN display/hide
     - PIN setup
     - PIN testing
     - PIN removal

3. Currency Section:

   - Default currency selection:
     - USD, EUR, GBP, CHF options
     - None option
   - Display format options:
     - Symbol only ($10.00)
     - Code only (10.00 USD)
     - Both ($10.00 USD)

4. Language Section:

   - German terms toggle
   - Language preference management
   - Real-time language switching

5. Backup and Restore Section:

   - Tasks backup/restore
   - Piggy bank accounts backup/restore
   - Full system backup/restore
   - Download/upload functionality

6. Reset Options Section:
   - Transaction history reset
   - Account-specific resets
   - Confirmation dialogs

**Data Flow:**

1. Settings Management:

   ```typescript
   GET / api / settings; // Fetch current settings
   PUT / api / settings; // Update settings
   POST / api / settings / currency; // Update currency
   POST / api / settings / currency - format; // Update format
   ```

2. Backup Operations:

   ```typescript
   GET /api/backup/${type}        // Download backup
   POST /api/restore/${type}      // Restore from backup
   ```

3. Reset Operations:
   ```typescript
   POST /api/reset/${type}        // Reset specific data
   POST /api/reset/transactions   // Reset transactions
   ```

**State Management:**

- Role enforcement state
- PIN management
- Currency settings
- Format preferences
- Loading states
- Dialog visibility
- Error handling
- Language preferences

**Process Flow:**

1. Access Control:

   ```typescript
   1. Check role enforcement
   2. Verify parent mode
   3. Request PIN if needed
   4. Grant/deny access
   ```

2. Settings Updates:

   ```typescript
   1. Validate input
   2. Update database
   3. Update UI state
   4. Show confirmation
   ```

3. Backup Process:
   ```typescript
   1. Select backup type
   2. Generate backup file
   3. Trigger download
   4. Show success message
   ```

**Error Handling:**

- PIN verification failures
- Settings update errors
- Backup/restore failures
- Reset operation errors
- Network issues
- User feedback messages

**Visual Feedback:**

- Loading indicators
- Success/error messages
- Interactive states
- Dialog animations
- Theme-aware styling

**Security:**

- Parent mode required
- PIN protection
- Backup file encryption
- Reset confirmations
- Access logging

## Technical Implementation Details

### Directory Structure

```
app/
├── api/           # API endpoints
├── components/    # Reusable UI components
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── lib/          # Utility functions
├── types/        # TypeScript definitions
└── [feature]/    # Feature-specific pages
```

### Key Components

1. Layout Components

   - Navigation bar
   - Sidebar
   - Footer
   - Theme provider

2. Feature Components

   - User cards
   - Task cards
   - Transaction lists
   - Form components
   - Modal dialogs
   - IconComponent (Lucide icon integration)

3. Utility Components
   - File upload
   - Image preview
   - Sound player
   - Loading states
   - Error boundaries

### Icon System Implementation

The application uses a centralized icon system based on the Lucide icon library. This system ensures consistent icon display across all interfaces while maintaining efficient storage and rendering.

#### Database Storage

- Icons are stored in the database as string identifiers (VARCHAR(50))
- Example fields:
  - `users.icon`: User profile icons
  - `tasks.icon_name`: Task-specific icons

#### Icon Component Architecture

```typescript
// IconComponent implementation
type IconComponentProps = {
  icon?: string | null;    // Icon identifier from database
  className?: string;      // Optional styling classes
};

// Usage in interfaces
<IconComponent icon="user-circle" className="h-6 w-6" />
```

#### Icon Rendering Process

1. Database to Component:

   - Read icon identifier from database (e.g., "user-circle")
   - Pass identifier to IconComponent
   - Component converts kebab-case to PascalCase (e.g., "UserCircle")
   - Lucide library renders corresponding SVG icon

2. Error Handling:
   - Falls back to HelpCircle icon if identifier is invalid
   - Logs warning for debugging purposes
   - Maintains consistent UI even with data issues

#### Interface-Specific Icon Usage

1. User Management:

   - Add User Modal:
     - Default user silhouette icon for new users
     - Icon selector for choosing user icons
     - Live preview of selected icon
   - User Cards:
     - Primary user icon display
     - Consistent sizing across cards
     - Optional background styling

2. Task Management:

   - Task Icons:
     - Visual representation of task type
     - Status indicators (active/inactive)
     - Completion state icons

3. Transaction Interface:

   - Status Icons:
     - Payment status indicators
     - Transaction type symbols
     - Approval/rejection markers

4. Navigation:
   - Menu Icons:
     - Feature section indicators
     - Active state highlights
     - Consistent navigation symbolism

#### Icon Selection Guidelines

- User Icons:
  - Personalized user representations
  - Child-friendly options
  - Distinct enough for easy identification
- Task Icons:
  - Task category representation
  - Clear visual metaphors
  - Action-oriented symbols
- System Icons:
  - Consistent UI element indicators
  - Status and state representations
  - Navigation and action symbols

### Data Flow

1. Client-side State Management

   - React Context for global state
   - Local state for component-specific data
   - Form state management

2. Server Communication

   - API routes in `/app/api`
   - Prisma Client for database operations
   - File upload handling
   - Error handling and validation

3. Authentication & Authorization
   - Route protection
   - Role-based access control
   - Parent/Child mode switching

### User Interface Logic

#### Task Management

1. Task Creation:

   ```typescript
   // Create task flow
   1. User fills task form
   2. Validate input
   3. Create task record
   4. Update task list
   5. Show success message
   ```

2. Task Completion:
   ```typescript
   // Complete task flow
   1. User selects task
   2. Upload completion evidence
   3. Create completed_task record
   4. Play celebration animation
   5. Update task status
   ```

#### Financial Operations

1. Payment Processing:
   ```typescript
   // Payment flow
   1. Parent reviews completed task
   2. Approves payment
   3. Create transaction record
   4. Update account balance
   5. Update task payment status
   ```
