# Component Color Audit Template

## Purpose

This audit documents the current color usage in the Checkbox component and outlines required changes for the new color system.

## Component Information

- **Component Name**: Checkbox
- **File Location**: components/ui/checkbox.tsx
- **Type**: Form Component
- **Has Theme Variants**: No
- **Uses Brand Colors**: No

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Unchecked background
bg - blue - 500; // Checked background
bg - gray - 100; // Disabled background

// Border Colors
border - gray - 300; // Unchecked border
border - blue - 500; // Checked border
border - gray - 200; // Disabled border

// Icon Colors
text - white; // Checkmark color
text - gray - 400; // Disabled checkmark

// Focus Effects
ring - blue - 500; // Focus ring
ring - offset - white; // Focus ring offset
```

### State Variations

- Default:
  - bg-white
  - border-gray-300
- Checked:
  - bg-blue-500
  - border-blue-500
  - text-white
- Hover:
  - border-blue-500 (unchecked)
  - bg-blue-600 (checked)
- Focus:
  - ring-2
  - ring-blue-500
  - ring-offset-2
- Disabled:
  - bg-gray-100
  - border-gray-200
  - text-gray-400
  - opacity-50

### Brand Color Usage

None (uses system UI colors)

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-blue-500       → bg-interactive-primary
bg-gray-100       → bg-background-disabled

// Borders
border-gray-300   → border-primary
border-blue-500   → border-interactive-primary
border-gray-200   → border-disabled

// Icon Colors
text-white        → text-content-inverse
text-gray-400     → text-content-disabled

// Focus
ring-blue-500     → ring-focus
ring-offset-white → ring-offset-background
```

### Theme Considerations

- Light theme adjustments:
  - Clear checked state
  - Visible borders
  - Distinct focus ring
- Dark theme adjustments:
  - Adjust contrast for visibility
  - Modify border colors
  - Ensure focus ring visibility
- Brand color handling:
  - Use consistent interactive colors
  - Support custom accent colors

### Accessibility Notes

- Contrast requirements:
  - Border to background: 3:1 minimum
  - Checkmark to background: 4.5:1 minimum
  - Focus indicator: 3:1 minimum
- Focus indicators:
  - Clear focus ring
  - Sufficient contrast
  - Visible in all states
- Other considerations:
  - Support for :focus-visible
  - Keyboard navigation
  - Screen reader support

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Update icon colors with semantic tokens
- [ ] Implement proper focus states
- [ ] Add hover transitions
- [ ] Update disabled styling
- [ ] Test contrast in all themes
- [ ] Verify focus visibility
- [ ] Add keyboard support
- [ ] Test screen reader support

## Additional Notes

- Consider adding indeterminate state
- Add size variants
- Support for custom icons
- Consider adding animation
- Add group selection support
