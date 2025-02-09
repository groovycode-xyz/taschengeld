# Theme Variations Documentation

## Purpose

This document details our theme variation system, including base structure and considerations for different themes (light, dark, and accent themes).

## Related Tasks

From TaskList-Themes.md:

- [ ] Base theme structure
- [ ] Dark mode considerations
- [ ] Theme switching methodology

## Document Status

- [x] Draft
- [ ] Under Review
- [ ] Approved
- [ ] Implemented

## Last Updated

2024-03-19

---

## 1. Theme Structure

### 1.1 Available Themes

Our application supports five distinct themes:

1. Light (Default)
2. Ocean Blue
3. Forest Green
4. Sunset Orange
5. Dark Mode

### 1.2 Theme Components

Each theme consists of:

```css
/* Base Colors */
--theme-base: hsl(var(--theme-base-hsl));
--theme-surface: hsl(var(--theme-surface-hsl));
--theme-accent: hsl(var(--theme-accent-hsl));

/* Semantic Mappings */
--background-primary: var(--theme-base);
--background-secondary: var(--theme-surface);
--interactive-primary: var(--theme-accent);
```

## 2. Theme-Specific Color Palettes

### 2.1 Light Theme (Default)

```css
.theme-light {
  --theme-base-hsl: 0 0% 100%; /* White */
  --theme-surface-hsl: 210 40% 96.1%; /* Light Gray */
  --theme-accent-hsl: 221 83% 53%; /* Blue */
}
```

### 2.2 Ocean Blue Theme

```css
.theme-ocean {
  --theme-base-hsl: 201 100% 95%; /* Light Blue */
  --theme-surface-hsl: 199 100% 90%; /* Seafoam */
  --theme-accent-hsl: 12 76% 61%; /* Coral */
}
```

### 2.3 Forest Green Theme

```css
.theme-forest {
  --theme-base-hsl: 120 100% 95%; /* Light Green */
  --theme-surface-hsl: 120 50% 90%; /* Sage */
  --theme-accent-hsl: 27 87% 67%; /* Autumn */
}
```

### 2.4 Sunset Orange Theme

```css
.theme-sunset {
  --theme-base-hsl: 39 100% 95%; /* Light Orange */
  --theme-surface-hsl: 45 100% 90%; /* Golden */
  --theme-accent-hsl: 280 65% 60%; /* Purple */
}
```

### 2.5 Dark Theme

```css
.theme-dark {
  --theme-base-hsl: 222 47% 11%; /* Dark Blue */
  --theme-surface-hsl: 217 33% 17%; /* Dark Gray */
  --theme-accent-hsl: 212 100% 85%; /* Ice Blue */
}
```

## 3. Brand Color Handling

### 3.1 Theme-Independent Colors

Brand colors remain consistent across themes for cognitive consistency:

```css
:root {
  /* User branding */
  --brand-user-base: var(--color-green-600);
  --brand-user-light: var(--color-green-500);
  --brand-user-dark: var(--color-green-700);

  /* Task branding */
  --brand-task-base: var(--color-blue-600);
  --brand-task-light: var(--color-blue-500);
  --brand-task-dark: var(--color-blue-700);
}
```

### 3.2 Theme Integration

Brand colors adjust only for contrast while maintaining their core identity:

```css
.theme-dark {
  --brand-user-base: var(--brand-user-dark);
  --brand-task-base: var(--brand-task-dark);
}
```

## 4. Dark Mode Considerations

### 4.1 Color Adjustments

- Reduce contrast to prevent eye strain
- Maintain WCAG compliance (minimum 4.5:1 for text)
- Adjust shadows for depth perception
- Use darker variants of brand colors

### 4.2 Special Handling

```css
.theme-dark {
  /* Reduce harsh contrasts */
  --content-primary: hsl(var(--theme-content-hsl) / 0.9);

  /* Adjust shadows for better depth */
  --shadow-color: hsl(var(--theme-base-hsl) / 0.1);

  /* Soften borders */
  --border-primary: hsl(var(--theme-surface-hsl) / 0.2);
}
```

## 5. Theme Switching

### 5.1 Theme Classes

Themes are applied via classes on the root element:

```html
<html class="theme-light">
  <html class="theme-ocean">
    <html class="theme-forest">
      <html class="theme-sunset">
        <html class="theme-dark"></html>
      </html>
    </html>
  </html>
</html>
```

### 5.2 System Preference Detection

```typescript
// Detect system color scheme
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('theme-dark');
}
```

## 6. Accessibility Requirements

### 6.1 Contrast Ratios

- Maintain minimum contrast ratios across all themes
- Test text and interactive element contrast
- Ensure brand colors meet contrast requirements

### 6.2 Focus Indicators

- Maintain visible focus indicators in all themes
- Adjust focus ring colors for visibility
- Test keyboard navigation in all themes

## 7. Implementation Guidelines

### 7.1 Component Development

- Use semantic color tokens instead of theme-specific values
- Test components in all themes during development
- Ensure consistent behavior across themes

### 7.2 Theme Testing

- Visual regression testing for theme changes
- Accessibility testing in all themes
- Performance testing for theme switching
