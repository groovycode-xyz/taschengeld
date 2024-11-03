# Color Token Documentation

## Purpose

This document defines the semantic color token structure, naming conventions, and relationships between colors in our system. It serves as the foundation for our theming implementation.

## Related Tasks

From TaskList-Themes.md:

- [ ] Document primary color roles (background, text, borders, etc.)
- [ ] Define color token naming conventions
- [ ] Create color relationship hierarchy

## Document Status

- [x] Draft
- [ ] Under Review
- [ ] Approved
- [ ] Implemented

## Last Updated

2024-03-19

---

## 1. Color Token Structure

### 1.1 Base Layer Colors

Primary surface colors that establish visual hierarchy:

```css
--background-primary    /* Main application background */
--background-secondary  /* Elevated elements (cards, dropdowns) */
--background-tertiary   /* Highest elevation (modals, popovers) */
```

### 1.2 Content Colors

Text and icon colors for different emphasis levels:

```css
--content-primary      /* High-emphasis text, primary icons */
--content-secondary    /* Medium-emphasis text, secondary information */
--content-tertiary     /* Low-emphasis text, disabled states */
```

### 1.3 Interactive Colors

Colors for actionable elements:

```css
--interactive-primary   /* Primary actions, main CTAs */
--interactive-secondary /* Secondary actions, less emphasis */
--interactive-accent    /* Highlights, focus states */
--interactive-disabled  /* Disabled interactive elements */
```

### 1.4 Brand-Specific Colors

Consistent colors across themes for key UI elements:

```css
--brand-user-base      /* User card base color */
--brand-user-light     /* User card light theme variant */
--brand-user-dark      /* User card dark theme variant */

--brand-task-base      /* Task card base color */
--brand-task-light     /* Task card light theme variant */
--brand-task-dark      /* Task card dark theme variant */
```

## 2. Naming Conventions

### 2.1 Pattern Structure

```
--{category}-{role}-{variant?}
```

- category: The broad classification (background, content, interactive, brand)
- role: The specific use case (primary, secondary, tertiary)
- variant: Optional modifier (light, dark, hover, active)

### 2.2 Examples

```css
--background-primary
--content-primary-hover
--interactive-primary-active
--brand-user-light
```

## 3. Color Relationships

### 3.1 Hierarchy

1. Base Layer Colors establish the foundation
2. Content Colors provide readability against base layers
3. Interactive Colors guide user actions
4. Brand Colors maintain consistency across themes

### 3.2 Contrast Requirements

- Primary content: 4.5:1 minimum contrast ratio
- Secondary content: 4.5:1 minimum contrast ratio
- Tertiary content: 3:1 minimum contrast ratio
- Interactive elements: 3:1 minimum contrast ratio

### 3.3 State Relationships

Interactive elements should maintain clear relationships:

```css
Element: --interactive-primary
Hover: --interactive-primary-hover (15% darker/lighter)
Active: --interactive-primary-active (25% darker/lighter)
Disabled: --interactive-disabled (reduced opacity)
```

## 4. Implementation Notes

### 4.1 CSS Variable Usage

```css
.button-primary {
  background-color: var(--interactive-primary);
  color: var(--content-primary);
}

.button-primary:hover {
  background-color: var(--interactive-primary-hover);
}
```

### 4.2 Tailwind Integration

```js
backgroundColor: {
  primary: 'var(--background-primary)',
  secondary: 'var(--background-secondary)',
  tertiary: 'var(--background-tertiary)',
}
```

## 5. Accessibility Considerations

- All color combinations must meet WCAG 2.1 Level AA standards
- Interactive elements must maintain sufficient contrast in all states
- Brand colors must provide sufficient contrast in both light and dark themes
