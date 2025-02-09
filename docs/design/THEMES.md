# Theme System

## Available Themes

1. Light (Default)

   - Primary colors: Light neutrals
   - Background colors: White to light gray
   - Text colors: Dark grays to black
   - Accent colors: Blue tones

2. Ocean Blue

   - Primary: Ocean blues
   - Secondary: Seafoam greens
   - Accent: Coral highlights

3. Forest Green

   - Primary: Forest greens
   - Secondary: Earth tones
   - Accent: Autumn highlights

4. Sunset Orange

   - Primary: Warm oranges
   - Secondary: Golden yellows
   - Accent: Purple twilight

5. Dark
   - Primary: Dark grays
   - Secondary: Midnight blues
   - Accent: Ice blue highlights

## Implementation Status

### Completed

- [x] Theme context and provider setup
- [x] Light theme (default)
- [x] Dark theme
- [x] Local storage persistence
- [x] Tailwind configuration

### In Progress

- [ ] Ocean Blue theme
- [ ] Forest Green theme
- [ ] Sunset Orange theme
- [ ] Enhanced theme selector
- [ ] System preference detection

### Pending

- [ ] Theme animation transitions
- [ ] User preference API
- [ ] Theme preview generation

## Component Implementation

Each component in the system supports theming through:

1. CSS variables for colors
2. Tailwind classes for variants
3. Theme-aware state handling

Example implementation:

```tsx
<div className='bg-primary text-primary-foreground dark:bg-primary-dark'>
  {/* Component content */}
</div>
```

## Theme Switching

Themes can be switched using the ThemeContext:

```tsx
const { setTheme } = useTheme();
setTheme('dark');
```

Available theme options:

- 'light'
- 'dark'
- 'ocean'
- 'forest'
- 'sunset'
- 'system'

## Testing Requirements

- Visual regression testing for all themes
- Accessibility testing (contrast ratios)
- Component state testing in all themes
- Cross-browser compatibility
- Mobile responsiveness
