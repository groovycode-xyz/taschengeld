# Color System

## Color Palette

### Primary Colors
```
#E7ECEF - Anti-flash white
#274C77 - YInMn Blue
#6096BA - Air superiority blue
#A3CEF1 - Uranian Blue
#8B8C89 - Battleship gray
```

### Accent Colors
```
#FDBA31 - Selective yellow
#370075 - Persian indigo
#620097 - Indigo
#E2DADA - Timberwolf
```

## Usage Guidelines

We follow the Apple Human Interface Guidelines for color usage, emphasizing:
- Consistent color application across the interface
- Sufficient contrast for accessibility
- Meaningful use of color for visual hierarchy
- Support for light and dark modes

## Semantic Color Tokens

### Background Colors
- `bg-primary`: Main background color (#E7ECEF)
- `bg-secondary`: Secondary background (#F5F7F8)
- `bg-accent`: Accent background (#274C77)
- `bg-muted`: Muted background (#8B8C89)

### Text Colors
- `text-primary`: Main text color (#274C77)
- `text-secondary`: Secondary text (#6096BA)
- `text-accent`: Accent text (#FDBA31)
- `text-muted`: Muted text (#8B8C89)

### Border Colors
- `border-primary`: Main border color (#274C77)
- `border-secondary`: Secondary border (#6096BA)
- `border-accent`: Accent border (#FDBA31)

### Status Colors
- `success`: Success state (#4CAF50)
- `warning`: Warning state (#FDBA31)
- `error`: Error state (#F44336)
- `info`: Information state (#2196F3)

## Implementation

### Tailwind Configuration
The color system is implemented using Tailwind CSS with custom color configurations. See `tailwind.config.ts` for the complete configuration.

### CSS Variables
Colors are defined as CSS variables in the root scope for consistent theming:
```css
:root {
  --color-primary: #274C77;
  --color-secondary: #6096BA;
  --color-accent: #FDBA31;
  /* ... other color variables ... */
}
```

### Dark Mode Support
Dark mode colors are defined using the `dark:` modifier in Tailwind CSS:
```css
.dark {
  --color-primary: #A3CEF1;
  --color-secondary: #6096BA;
  --color-accent: #FDBA31;
  /* ... other dark mode colors ... */
}
```

## Accessibility

All color combinations in the system meet WCAG 2.1 Level AA standards for contrast ratios:
- Regular text: minimum contrast ratio of 4.5:1
- Large text: minimum contrast ratio of 3:1
- UI components: minimum contrast ratio of 3:1