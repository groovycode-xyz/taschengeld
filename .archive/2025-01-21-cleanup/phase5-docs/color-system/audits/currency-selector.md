# Component Color Audit Template

## Purpose

This audit documents the current color usage in the CurrencySelector component of the Global Settings interface.

## Component Information

- **Component Name**: CurrencySelector
- **File Location**: components/global-settings/currency-selector.tsx
- **Type**: Form Component
- **Has Theme Variants**: No
- **Uses Brand Colors**: No

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Select background
bg - gray - 50; // Option background
bg - gray - 100; // Option hover state
bg - blue - 50; // Selected option background

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text
text - gray - 500; // Helper text
text - blue - 600; // Selected option text

// Border Colors
border - gray - 300; // Select border
focus: border - blue - 500; // Focus state
border - transparent; // Option borders

// Shadow Effects
shadow - sm; // Select shadow
ring - offset - white; // Focus ring offset
```

### State Variations

- Default:
  - Select: bg-white, border-gray-300
  - Options: bg-gray-50
- Hover:
  - Options: bg-gray-100
- Selected:
  - bg-blue-50
  - text-blue-600
- Focus:
  - focus:border-blue-500
  - focus:ring-2
- Disabled: opacity-50

### Brand Color Usage

None (uses system UI colors)

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-gray-50        → bg-background-secondary
bg-gray-100       → bg-background-secondary-hover
bg-blue-50        → bg-interactive-subtle

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-gray-500     → text-content-tertiary
text-blue-600     → text-interactive-primary

// Borders
border-gray-300   → border-primary
border-blue-500   → border-focus
```

### Theme Considerations

- Light theme adjustments:
  - Maintain clear option visibility
  - Ensure readable text
  - Clear selection state
- Dark theme adjustments:
  - Adjust option backgrounds
  - Modify selection colors
  - Ensure dropdown visibility
- Brand color handling:
  - Use system UI colors consistently
  - Consider theme-specific selection colors

### Accessibility Notes

- Contrast requirements:
  - Option text: 4.5:1 minimum
  - Selected state: 3:1 minimum
  - Helper text: 4.5:1 minimum
- Focus indicators:
  - Clear focus ring on select
  - Visible option focus
  - Support keyboard navigation
- Other considerations:
  - Clear selection indication
  - Screen reader support
  - Keyboard controls for options

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Add proper focus states
- [ ] Implement hover transitions
- [ ] Update selection indicators
- [ ] Test contrast in all themes
- [ ] Verify dropdown visibility
- [ ] Add keyboard navigation
- [ ] Test screen reader support

## Additional Notes

- Consider adding currency icons/flags
- Add clear selection feedback
- Consider adding search functionality
- May need loading states
- Consider adding currency preview
