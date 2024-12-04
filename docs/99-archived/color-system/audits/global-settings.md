# Component Color Audit Template

## Purpose

This audit documents the current color usage in the Global Settings interface and outlines required changes for the new color system.

## Component Information

- **Component Name**: Global Settings Interface
- **File Location**: components/global-settings.tsx
- **Type**: Primary Interface
- **Has Theme Variants**: No
- **Uses Brand Colors**: No (uses system/settings colors)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Main container background
bg - gray - 50; // Section backgrounds
bg - gray - 100; // Input backgrounds
bg - blue - 500; // Save button
bg - red - 500; // Reset/Delete button

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text
text - gray - 500; // Helper text
text - white; // Button text
text - red - 600; // Warning text

// Border Colors
border - gray - 200; // Section borders
border - gray - 300; // Input borders
border - red - 300; // Warning section borders
focus: border - blue - 500; // Focus state

// Shadow Effects
shadow - sm; // Section shadows
ring - offset - white; // Focus ring offset
```

### State Variations

- Default:
  - Sections: bg-gray-50, border-gray-200
  - Inputs: bg-gray-100, border-gray-300
- Hover:
  - Save: hover:bg-blue-600
  - Reset: hover:bg-red-600
- Focus:
  - focus:border-blue-500
  - focus:ring-2
- Error:
  - border-red-300
  - text-red-600
- Disabled: opacity-50

### Brand Color Usage

None (uses system/settings-specific colors)

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-gray-50        → bg-background-secondary
bg-gray-100       → bg-background-tertiary
bg-blue-500       → bg-interactive-primary
bg-red-500        → bg-interactive-danger

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-gray-500     → text-content-tertiary
text-white        → text-content-inverse
text-red-600      → text-feedback-error

// Borders
border-gray-200   → border-primary
border-gray-300   → border-secondary
border-red-300    → border-danger-subtle
border-blue-500   → border-focus
```

### Theme Considerations

- Light theme adjustments:
  - Maintain settings hierarchy
  - Clear section separation
  - Visible form elements
- Dark theme adjustments:
  - Adjust section contrasts
  - Modify input backgrounds
  - Ensure warning states are visible
- Brand color handling:
  - Use system-specific colors
  - Consider theme-specific settings colors

### Accessibility Notes

- Contrast requirements:
  - Settings labels: 4.5:1 minimum
  - Helper text: 4.5:1 minimum
  - Warning text: 4.5:1 minimum
- Focus indicators:
  - Visible focus states for all inputs
  - Clear section focus
  - Support keyboard navigation
- Other considerations:
  - Clear settings grouping
  - Visible validation states
  - Screen reader support

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Add proper focus states
- [ ] Implement hover transitions
- [ ] Update warning states
- [ ] Test contrast in all themes
- [ ] Verify settings visibility
- [ ] Add keyboard navigation
- [ ] Test screen reader support

## Additional Notes

- Consider adding settings groups
- Add clear save/reset feedback
- Consider adding settings search
- May need loading states
- Consider adding settings preview
