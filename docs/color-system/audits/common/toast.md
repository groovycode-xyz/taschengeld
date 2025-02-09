# Component Color Audit Template

## Purpose

This audit documents the current color usage in the Toast notification component and outlines required changes for the new color system.

## Component Information

- **Component Name**: Toast
- **File Location**: components/ui/toast.tsx
- **Type**: Common UI Component
- **Has Theme Variants**: No
- **Uses Brand Colors**: No (uses feedback colors)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Default toast background
bg - green - 50; // Success variant background
bg - red - 50; // Error variant background
bg - yellow - 50; // Warning variant background
bg - blue - 50; // Info variant background

// Text Colors
text - gray - 900; // Title text
text - gray - 600; // Description text
text - green - 600; // Success icon/text
text - red - 600; // Error icon/text
text - yellow - 600; // Warning icon/text
text - blue - 600; // Info icon/text

// Border Colors
border - gray - 200; // Default border
border - green - 200; // Success border
border - red - 200; // Error border
border - yellow - 200; // Warning border
border - blue - 200; // Info border

// Shadow Effects
shadow - lg; // Toast shadow
shadow - xl; // Hover state
```

### State Variations

- Default:
  - bg-white
  - border-gray-200
- Success:
  - bg-green-50
  - text-green-600
  - border-green-200
- Error:
  - bg-red-50
  - text-red-600
  - border-red-200
- Warning:
  - bg-yellow-50
  - text-yellow-600
  - border-yellow-200
- Info:
  - bg-blue-50
  - text-blue-600
  - border-blue-200
- Hover: shadow-xl
- Dismissing: Fade out animation

### Brand Color Usage

None (uses system feedback colors)

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-green-50       → bg-feedback-success-subtle
bg-red-50         → bg-feedback-error-subtle
bg-yellow-50      → bg-feedback-warning-subtle
bg-blue-50        → bg-feedback-info-subtle

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-green-600    → text-feedback-success
text-red-600      → text-feedback-error
text-yellow-600   → text-feedback-warning
text-blue-600     → text-feedback-info

// Borders
border-gray-200   → border-primary
border-green-200  → border-success-subtle
border-red-200    → border-error-subtle
border-yellow-200 → border-warning-subtle
border-blue-200   → border-info-subtle
```

### Theme Considerations

- Light theme adjustments:
  - Clear feedback state visibility
  - Maintain readability
  - Distinct variant colors
- Dark theme adjustments:
  - Adjust background opacity
  - Modify feedback colors
  - Ensure text contrast
- Brand color handling:
  - Use consistent feedback colors
  - Support theme-specific feedback states

### Accessibility Notes

- Contrast requirements:
  - Title text: 4.5:1 minimum
  - Description text: 4.5:1 minimum
  - Icons: 3:1 minimum
- Focus indicators:
  - Focusable dismiss button
  - Clear focus ring
- Other considerations:
  - Screen reader announcements
  - Auto-dismiss timing
  - Keyboard dismissal

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Implement proper focus states
- [ ] Add hover transitions
- [ ] Update variant styles
- [ ] Test contrast in all themes
- [ ] Verify screen reader support
- [ ] Add keyboard support
- [ ] Test animations

## Additional Notes

- Consider adding progress indicator
- Add support for custom duration
- Consider adding action buttons
- Support for custom icons
- Add position configuration
