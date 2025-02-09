# Color Usage Guidelines

## Purpose

This document provides comprehensive guidelines for using our color system in components, including state handling and accessibility requirements.

## Related Tasks

From TaskList-Themes.md:

- [ ] Component-level usage examples
- [ ] State handling (hover, active, disabled)
- [ ] Accessibility requirements
- [ ] Define color usage rules and patterns

## Document Status

- [x] Draft
- [ ] Under Review
- [ ] Approved
- [ ] Implemented

## Last Updated

2024-03-19

---

## 1. General Usage Rules

### 1.1 Core Principles

- Use semantic color tokens instead of direct color values
- Maintain consistent color usage across similar components
- Ensure sufficient contrast for accessibility
- Preserve branded colors for their designated purposes

### 1.2 Component Hierarchy

1. Primary surfaces use `--background-primary`
2. Elevated elements use `--background-secondary`
3. Floating elements use `--background-tertiary`

## 2. Component-Specific Guidelines

### 2.1 Navigation (Sidebar)

```tsx
// Correct
<nav className="bg-background-primary text-content-primary">

// Incorrect
<nav className="bg-gray-900 text-white">
```

### 2.2 Cards

```tsx
// User Cards (branded)
<div className="bg-brand-user-base">

// Task Cards (branded)
<div className="bg-brand-task-base">

// Generic Cards
<div className="bg-background-secondary">
```

### 2.3 Buttons

```tsx
// Primary Action
<button className="bg-interactive-primary text-content-primary
                  hover:bg-interactive-primary-hover
                  active:bg-interactive-primary-active
                  disabled:bg-interactive-disabled">

// Secondary Action
<button className="bg-interactive-secondary text-content-secondary">
```

## 3. State Handling

### 3.1 Interactive States

- Default: Base color
- Hover: 15% lighter/darker
- Active/Pressed: 25% lighter/darker
- Focus: Add focus ring
- Disabled: Reduced opacity

### 3.2 Implementation Examples

```tsx
// Button States
.button-primary {
  @apply bg-interactive-primary
         hover:bg-interactive-primary-hover
         active:bg-interactive-primary-active
         disabled:bg-interactive-disabled
         focus:ring-2 focus:ring-focus;
}

// Link States
.link {
  @apply text-interactive-primary
         hover:text-interactive-primary-hover
         active:text-interactive-primary-active
         disabled:text-interactive-disabled;
}
```

## 4. Brand Color Usage

### 4.1 User Interface Elements

- User Cards: Always use `--brand-user-*` variants
- Task Cards: Always use `--brand-task-*` variants
- Maintain brand color consistency across themes

### 4.2 Implementation

```tsx
// User Card Example
<div className="bg-brand-user-base dark:bg-brand-user-dark">
  {/* content */}
</div>

// Task Card Example
<div className="bg-brand-task-base dark:bg-brand-task-dark">
  {/* content */}
</div>
```

## 5. Accessibility Guidelines

### 5.1 Contrast Requirements

- Normal text: 4.5:1 minimum contrast ratio
- Large text: 3:1 minimum contrast ratio
- Interactive elements: 3:1 minimum contrast ratio

### 5.2 Focus Indicators

- All interactive elements must have visible focus indicators
- Use `--ring-focus` for focus states
- Ensure focus indicators have sufficient contrast

### 5.3 Color Independence

- Never use color alone to convey information
- Provide additional visual cues (icons, patterns, etc.)
- Ensure functionality works without color perception

## 6. Common Patterns

### 6.1 Text Hierarchy

```tsx
// Primary Text
<p className="text-content-primary">Main content</p>

// Secondary Text
<p className="text-content-secondary">Supporting text</p>

// Disabled Text
<p className="text-content-tertiary">Disabled content</p>
```

### 6.2 Borders and Dividers

```tsx
// Primary Border
<div className="border-border-primary">

// Focus Border
<div className="focus:border-border-focus">
```

## 7. Theme Compatibility

### 7.1 Theme-Aware Components

- Use CSS variables for theme-dependent colors
- Provide dark theme variants where needed
- Maintain branded color consistency

### 7.2 Implementation

```tsx
// Theme-aware component
<div className='bg-background-primary dark:bg-background-primary-dark'>
  <p className='text-content-primary dark:text-content-primary-dark'>Content</p>
</div>
```
