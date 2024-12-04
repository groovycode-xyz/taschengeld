# Color System Implementation Guide

## Purpose

This document provides technical implementation details for our color system, including CSS architecture and Tailwind configuration.

## Related Tasks

From TaskList-Themes.md:

- [ ] Theme switching methodology
- [ ] CSS variable architecture
- [ ] Tailwind configuration approach

## Document Status

- [x] Draft
- [ ] Under Review
- [ ] Approved
- [ ] Implemented

## Last Updated

2024-03-19

---

## 1. CSS Variable Architecture

### 1.1 Base Color Definition

```css
:root {
  /* HSL Base Colors */
  --color-base-50-hsl: 0 0% 100%;
  --color-base-100-hsl: 210 40% 96.1%;
  --color-base-900-hsl: 222 47% 11%;

  /* Brand Base Colors */
  --color-green-500-hsl: 142 72% 29%;
  --color-blue-500-hsl: 201 89% 48%;

  /* Semantic Color Mappings */
  --background-primary: hsl(var(--color-base-50-hsl));
  --background-secondary: hsl(var(--color-base-100-hsl));

  /* Brand-Specific Colors */
  --brand-user-base: hsl(var(--color-green-500-hsl));
  --brand-task-base: hsl(var(--color-blue-500-hsl));
}
```

### 1.2 Theme Class Structure

```css
.theme-light {
  /* Light theme color values */
}

.theme-ocean {
  /* Ocean theme color values */
}

/* etc. for each theme */
```

## 2. Tailwind Configuration

### 2.1 Color Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: {
          primary: 'var(--background-primary)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
        },
        content: {
          primary: 'var(--content-primary)',
          secondary: 'var(--content-secondary)',
          tertiary: 'var(--content-tertiary)',
        },
        interactive: {
          primary: 'var(--interactive-primary)',
          secondary: 'var(--interactive-secondary)',
          accent: 'var(--interactive-accent)',
          disabled: 'var(--interactive-disabled)',
        },
        brand: {
          'user-base': 'var(--brand-user-base)',
          'user-light': 'var(--brand-user-light)',
          'user-dark': 'var(--brand-user-dark)',
          'task-base': 'var(--brand-task-base)',
          'task-light': 'var(--brand-task-light)',
          'task-dark': 'var(--brand-task-dark)',
        },
      },
    },
  },
};
```

### 2.2 Custom Utilities

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.theme-transition': {
          'transition-property': 'background-color, border-color, color, fill, stroke',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '150ms',
        },
      });
    }),
  ],
};
```

## 3. Theme Switching Implementation

### 3.1 Theme Context

```typescript
// contexts/theme-context.tsx
type Theme = 'light' | 'ocean' | 'forest' | 'sunset' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});
```

### 3.2 Theme Provider

```typescript
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Remove previous theme classes
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-ocean', 'theme-forest', 'theme-sunset', 'theme-dark');

    // Add new theme class
    root.classList.add(`theme-${theme}`);

    // Store preference
    localStorage.setItem('theme-preference', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 3.3 Theme Hook

```typescript
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

## 4. Database Integration

### 4.1 Schema Update

```sql
ALTER TABLE app_settings
ADD COLUMN theme_preference VARCHAR(20)
DEFAULT 'light'
CHECK (theme_preference IN ('light', 'ocean', 'forest', 'sunset', 'dark', 'system'));
```

### 4.2 API Endpoint

```typescript
// app/api/settings/theme/route.ts
export async function PUT(req: Request) {
  const { theme } = await req.json();

  await db.execute('UPDATE app_settings SET theme_preference = $1', [theme]);

  return new Response(JSON.stringify({ success: true }));
}
```

## 5. Performance Considerations

### 5.1 CSS Loading Strategy

- Load base theme variables in initial CSS
- Defer non-critical theme styles
- Use `theme-transition` utility selectively

### 5.2 Runtime Performance

- Cache theme preferences
- Minimize DOM updates during theme switches
- Use CSS Variables for smooth transitions

## 6. Testing Implementation

### 6.1 Unit Tests

```typescript
describe('ThemeProvider', () => {
  it('should apply theme class to document root', () => {
    render(<ThemeProvider><div>Test</div></ThemeProvider>);
    expect(document.documentElement).toHaveClass('theme-light');
  });
});
```

### 6.2 Integration Tests

- Verify theme persistence
- Test system preference detection
- Validate theme switching behavior
- Check accessibility in all themes
