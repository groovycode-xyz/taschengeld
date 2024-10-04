# Task Management Interface Wireframe

This document describes the wireframe layout for the Task Management Interface of the Taschengeld (Allowance Tracker) application.

## 1. Header (Existing)

- App name "Taschengeld" on the left
- Search bar in the center
- User icon on the right

## 2. Sidebar (Existing)

- Navigation links including "Task Management"

## 3. Main Content Area: Task Management

### a. Top Section:

- Page Title: "Task Management"
- "Add New Task" button (aligned right)

### b. Task List Section:

- Filter/Sort options:
  - Dropdown to filter by status (All, Active, Inactive)
  - Dropdown to sort (Alphabetical, Date Created, Payout Value)
- List of Tasks:
  - Each task displayed as a card with:
    - Task Icon (left)
    - Task Title (prominent)
    - Short Description (truncated if long)
    - Payout Value
    - Status indicator (Active/Inactive)
    - Quick action buttons:
      - Edit (pencil icon)
      - Delete (trash icon)

### c. Task Details/Edit Modal:

- Opens when "Add New Task" is clicked or when editing an existing task
- Fields:
  - Title (input)
  - Description (textarea)
  - Icon/Image upload
  - Sound upload or selection
  - Payout Value (number input)
  - Visibility toggle (Active/Inactive)
- "Save" and "Cancel" buttons at the bottom

### d. Confirmation Modal:

- Opens when trying to delete a task
- Displays warning message
- "Confirm" and "Cancel" buttons

## 4. Responsive Design Considerations:

- On smaller screens, the sidebar collapses to a hamburger menu
- Task list switches to a single column layout on mobile
- Action buttons on task cards collapse into a dropdown menu on mobile

## 5. Accessibility Features:

- High contrast between text and background
- Clear, descriptive labels for all interactive elements
- Keyboard navigation support

This wireframe layout provides a comprehensive view of the Task Management Interface, incorporating all the necessary features mentioned in the PRD while maintaining a user-friendly and intuitive design. It allows parents to easily create, view, edit, and manage tasks, with considerations for both desktop and mobile users.
