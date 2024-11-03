# Component Color Audit Template

## Purpose

This audit documents the current color usage in the AppShell component and outlines required changes for the new color system.

## Component Information

- **Component Name**: AppShell
- **File Location**: components/app-shell.tsx
- **Type**: Core Layout
- **Has Theme Variants**: No
- **Uses Brand Colors**: No

## Current Color Usage

### Direct Color Values

```tsx
// Header Colors
bg-black           // Header background
text-white         // Header text and logo
text-gray-300      // Header hover states
hover:text-gray-300 // Header link hover

// Layout Colors
flex flex-col h-screen w-full  // No direct colors, but affects color containment
```

### State Variations

- Default:
  - Header: bg-black, text-white
- Hover:
  - Header links: hover:text-gray-300
- Active: No specific active state defined
- Disabled: No disabled states
- Focus: No focus states defined

### Brand Color Usage

None currently used

## Required Changes

### Semantic Token Mapping

```tsx
// Header
bg-black          → bg-background-primary
text-white        → text-content-primary
text-gray-300     → text-content-secondary
hover:text-gray-300 → hover:text-content-secondary
```

### Theme Considerations

- Light theme adjustments:
  - Header needs light theme variant
  - Consider contrast for header content
  - Ensure settings icon visibility
- Dark theme adjustments:
  - Current colors can inform dark theme
  - Maintain header prominence
- Brand color handling: N/A

### Accessibility Notes

- Contrast requirements:
  - Header text: 4.5:1 minimum contrast ratio
  - Settings icon: 3:1 minimum contrast ratio
- Focus indicators:
  - Add visible focus states for header links
  - Implement focus ring for settings icon
- Other considerations:
  - Ensure keyboard navigation for header elements
  - Maintain visual hierarchy in all themes

## Implementation Checklist

- [ ] Replace header background color with semantic token
- [ ] Update text colors with semantic tokens
- [ ] Add missing interaction states (active, focus)
- [ ] Implement theme variant support
- [ ] Add focus indicators for accessibility
- [ ] Test contrast ratios in all themes
- [ ] Test keyboard navigation
- [ ] Ensure proper color containment for nested layouts

## Additional Notes

- Consider adding transition effects for theme switching
- Evaluate if header should be visually distinct in all themes
- Consider adding subtle shadow or border to header for depth
- Ensure settings icon remains prominent in all themes
