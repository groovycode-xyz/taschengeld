# Component Color Audit Template

## Purpose

This audit documents the current color usage in the Sidebar component and outlines required changes for the new color system.

## Component Information

- **Component Name**: Sidebar
- **File Location**: components/sidebar.tsx
- **Type**: Core Layout
- **Has Theme Variants**: No (currently hardcoded dark style)
- **Uses Brand Colors**: No

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - gray - 900; // Main sidebar background
hover: bg - gray - 800; // Link hover state

// Text Colors
text - white; // Navigation text and icons

// Border Colors
border - gray - 800; // Dividers and borders
border - r; // Right border of sidebar
```

### State Variations

- Default:
  - Background: bg-gray-900
  - Text: text-white
- Hover:
  - Background: hover:bg-gray-800
  - Text: text-white (no change)
- Active: No specific active state defined
- Disabled: No specific disabled state defined
- Focus: No specific focus state defined

### Brand Color Usage

None currently used

## Required Changes

### Semantic Token Mapping

```tsx
// Background
bg-gray-900       → bg-background-secondary
hover:bg-gray-800 → hover:bg-background-secondary-hover

// Text
text-white       → text-content-primary

// Borders
border-gray-800  → border-primary
```

### Theme Considerations

- Light theme adjustments:
  - Need to define lighter background variant
  - Ensure sufficient contrast for navigation text
  - Adjust border colors for visibility
- Dark theme adjustments:
  - Current colors can serve as dark theme defaults
  - May need slight adjustment for consistency with other dark theme elements
- Brand color handling: N/A

### Accessibility Notes

- Contrast requirements:
  - Navigation text must maintain 4.5:1 ratio against background
  - Icons should maintain 3:1 ratio minimum
- Focus indicators:
  - Add visible focus states for keyboard navigation
  - Implement focus ring for navigation items
- Other considerations:
  - Ensure hover states are distinguishable
  - Add active states for current page indication

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Add missing interaction states (active, focus)
- [ ] Implement theme variant support
- [ ] Add focus indicators for accessibility
- [ ] Test contrast ratios in all themes
- [ ] Add current page indication
- [ ] Test keyboard navigation

## Additional Notes

- Consider adding transition effects for theme switching
- Consider adding active state indication for current route
- May need to adjust padding/spacing for focus indicators
- Should maintain consistent width across theme variations
