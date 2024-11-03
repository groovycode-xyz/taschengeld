# Component Color Audit Template

## Purpose

This audit documents the current color usage in the Card component and outlines required changes for the new color system.

## Component Information

- **Component Name**: Card
- **File Location**: components/ui/card.tsx
- **Type**: Common UI Component
- **Has Theme Variants**: No
- **Uses Brand Colors**: No (but supports brand colors via props)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Default background
bg - gray - 50; // Secondary background variant
hover: bg - gray - 100; // Hover state (when interactive)

// Border Colors
border - gray - 200; // Default border
hover: border - gray - 300; // Hover state border
border - transparent; // No border variant

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text

// Shadow Effects
shadow - sm; // Default shadow
shadow - md; // Elevated shadow
hover: shadow - lg; // Hover state shadow
```

### State Variations

- Default:
  - bg-white, border-gray-200, shadow-sm
- Hover (interactive):
  - hover:bg-gray-100
  - hover:border-gray-300
  - hover:shadow-lg
- Selected:
  - ring-2
  - ring-blue-500
- Focus:
  - ring-2
  - ring-blue-500
  - ring-offset-2
- Disabled: opacity-50

### Brand Color Usage

None by default, but supports:

- Custom background colors
- Brand-specific borders
- Theme-specific variations

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-gray-50        → bg-background-secondary
hover:bg-gray-100 → hover:bg-background-hover

// Borders
border-gray-200   → border-primary
border-gray-300   → border-secondary
ring-blue-500     → ring-focus

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary

// Shadows
shadow-sm        → shadow-base
shadow-md        → shadow-elevated
shadow-lg        → shadow-prominent
```

### Theme Considerations

- Light theme adjustments:
  - Maintain clear elevation hierarchy
  - Visible borders and shadows
  - Clear interactive states
- Dark theme adjustments:
  - Adjust shadow visibility
  - Modify border contrast
  - Ensure content readability
- Brand color handling:
  - Support for branded variants
  - Maintain consistent interactive states

### Accessibility Notes

- Contrast requirements:
  - Card content: 4.5:1 minimum
  - Interactive elements: 3:1 minimum
- Focus indicators:
  - Clear focus states for interactive cards
  - Visible boundaries in all themes
- Other considerations:
  - Clear visual hierarchy
  - Distinguishable grouped cards
  - Screen reader support for interactive cards

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Update shadow system
- [ ] Implement proper focus states
- [ ] Add hover transitions
- [ ] Test contrast in all themes
- [ ] Verify interactive states
- [ ] Add keyboard navigation support
- [ ] Test screen reader support
- [ ] Document brand color usage

## Additional Notes

- Consider adding elevation variants
- Add transition effects
- Support for gradient backgrounds
- Consider adding loading state
- Document composition patterns
