# Component Color Audit Template

## Purpose

This audit documents the current color usage in the Header component and outlines required changes for the new color system.

## Component Information

- **Component Name**: Header
- **File Location**: components/header.tsx
- **Type**: Core Layout
- **Has Theme Variants**: No
- **Uses Brand Colors**: No

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg-black           // Header background

// Text Colors
text-2xl          // Logo text size
font-bold         // Logo font weight
text-white        // Logo and text color
hover:text-gray-300 // Link hover state

// Icon Colors
text-white        // Settings icon
hover:text-gray-300 // Settings icon hover
h-8 w-8          // Settings icon size
```

### State Variations

- Default:
  - Background: bg-black
  - Text/Icons: text-white
- Hover:
  - Links: hover:text-gray-300
  - Settings Icon: hover:text-gray-300
- Active: No specific active state defined
- Focus: No focus states defined
- Disabled: No disabled states

### Brand Color Usage

None currently used

## Required Changes

### Semantic Token Mapping

```tsx
// Background
bg-black          → bg-background-primary

// Text & Icons
text-white        → text-content-primary
hover:text-gray-300 → hover:text-content-secondary

// Consider adding:
focus:ring-2      → focus:ring-focus
focus:ring-offset-2 → focus:ring-offset-background-primary
```

### Theme Considerations

- Light theme adjustments:
  - Define contrasting header background
  - Ensure logo visibility
  - Maintain settings icon prominence
- Dark theme adjustments:
  - Current colors can inform dark theme
  - Consider reducing contrast
- Brand color handling: N/A

### Accessibility Notes

- Contrast requirements:
  - Logo text: 4.5:1 minimum contrast ratio
  - Settings icon: 3:1 minimum contrast ratio
- Focus indicators:
  - Add visible focus states for all interactive elements
  - Implement focus ring for settings icon
  - Ensure keyboard navigation is visible
- Other considerations:
  - Ensure header is distinguishable from content
  - Maintain consistent visual hierarchy across themes

## Implementation Checklist

- [ ] Replace background color with semantic token
- [ ] Update text colors with semantic tokens
- [ ] Add missing interaction states (active, focus)
- [ ] Implement theme variant support
- [ ] Add focus indicators for accessibility
- [ ] Test contrast ratios in all themes
- [ ] Add keyboard navigation support
- [ ] Test with screen readers

## Additional Notes

- Consider adding subtle border or shadow for visual separation
- Evaluate if header should be visually distinct in all themes
- Consider adding transition effects for theme switching
- May need to adjust spacing for focus indicators
