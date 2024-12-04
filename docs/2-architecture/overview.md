# Taschengeld Layout Architecture

## Overview

The Taschengeld application uses a hierarchical layout system with three main components:

### 1. AppShell (components/app-shell.tsx)

The outermost layout container that provides:

- Full-height screen layout (`h-screen`)
- Global header with application title and settings
- Consistent application frame
- Flex column layout for proper content organization
- Integration point for the Sidebar component

### 2. Sidebar (components/sidebar.tsx)

The navigation component that:

- Occupies the left side of the application
- Provides main navigation menu
- Handles role-based menu item visibility
- Uses consistent styling and hover states
- Maintains 64px (w-64) width consistently

### 3. MainLayout (components/main-layout.tsx)

The content area wrapper that:

- Provides consistent padding (p-8)
- Handles overflow behavior
- Manages background colors
- Allows per-page customization through className prop
- Maintains proper content scrolling

## Component Structure (as shown in diagram)

### 1. AppShell (/components/app-shell.tsx)

The root layout component marked as (1) in the diagram that:

- Provides the main application frame
- Contains the header with app title and settings
- Manages the overall layout structure
- Houses both Sidebar and MainLayout components

### 2. MainContent Area (now MainLayout)

The content area marked as (2) in the diagram that:

- Renders the main interface components
- Handles content overflow and scrolling
- Provides consistent padding and spacing
- Manages background colors and styling

### 3. Sidebar Navigation

The navigation panel marked as (3) in the diagram that:

- Lists all available application features
- Provides navigation between different sections
- Handles role-based visibility of menu items
- Maintains consistent width and styling

### 4. Application Header

The top bar marked as (4) in the diagram that:

- Displays the application title "Taschengeld"
- Houses the settings icon/link
- Maintains consistent branding
- Provides global navigation elements

## Layout Flow

![Layout Flow](./overview2.jpg)

## Next.js App Router Integration

The layout system is designed to work seamlessly with Next.js App Router:

### Page Structure

```typescript
// app/[feature]/page.tsx
import { AppShell } from '@/components/app-shell';
import { MainLayout } from '@/components/main-layout';
import { FeatureComponent } from '@/components/feature-component';

export default function FeaturePage() {
  return (
    <AppShell>
      <MainLayout>
        <FeatureComponent />
      </MainLayout>
    </AppShell>
  );
}
```

### Layout Composition

1. **App Shell Level**

   - Consistent across all routes
   - Provides global navigation and structure
   - Handles role-based access control

2. **Page Level**

   - Each page follows the same pattern
   - Wraps feature components in MainLayout
   - Allows for page-specific styling

3. **Feature Components**
   - Focused on specific functionality
   - Inherit layout styles automatically
   - Can override styles when needed

## Folder Structure

The layout components are organized in a specific folder structure:

src/
├── components/ # Shared components
│ ├── app-shell.tsx # (1) Main layout wrapper
│ ├── main-layout.tsx # (2) Content area layout
│ ├── sidebar.tsx # (3) Navigation sidebar
│ └── ui/ # Reusable UI components
│
└── app/ # Next.js app directory
├── global-settings/
├── task-completion/
├── piggy-bank/
├── payday/
├── task-management/
└── user-management/

The numbers in parentheses correspond to the numbered components in the layout diagram.

## Styling Inheritance

The layout system follows a clear styling inheritance pattern:

### 1. Base Styles

- AppShell provides the foundational layout structure
- MainLayout provides default background and padding
- Components receive these base styles automatically

### 2. Customization Layers

```typescript
// Layer 1: MainLayout default styles
'flex-1 overflow-auto p-8 bg-white'

// Layer 2: Page-specific background (via className prop)
<MainLayout className="bg-[#FFEAC5]">

// Layer 3: Component-specific styles
<div className="rounded-2xl space-y-8">
```

### 3. Style Precedence

- MainLayout base styles are applied first
- Page-specific styles override when needed
- Component styles take highest precedence
- Uses Tailwind's className merging via cn() utility

## Key Features

1. **Consistent Spacing**

   - MainLayout provides standard padding (p-8)
   - Components focus on internal layout without page-level concerns
   - Uniform spacing between elements

2. **Flexible Content Area**

   - MainLayout handles overflow automatically
   - Scrollable content area when needed
   - Maintains fixed header and sidebar

3. **Role-Based Navigation**

   - Sidebar handles visibility based on user roles
   - Consistent navigation experience
   - Clear visual hierarchy

4. **Customization Points**
   - MainLayout accepts className prop for page-specific styling
   - Components can override default styles when needed
   - Maintains consistency while allowing flexibility

## Best Practices

1. **Component Organization**

   - Page components should be direct children of MainLayout
   - Avoid redundant padding/margin at page level
   - Use MainLayout's className prop for page-specific backgrounds

2. **Styling Guidelines**

   - Use MainLayout for page-level styling
   - Keep component-specific styling within components
   - Leverage Tailwind's utility classes consistently

3. **Responsive Design**
   - AppShell handles basic responsive layout
   - Sidebar can be collapsed on mobile (if implemented)
   - Components should use responsive class variants

## Implementation Example

```typescript
// Page Component Example
export default function SomePage() {
  return (
    <AppShell>
      <MainLayout className="custom-bg-if-needed">
        <PageComponent />
      </MainLayout>
    </AppShell>
  );
}
```

This architecture ensures consistent layout while maintaining flexibility for different page requirements.
