# Component Color Audit Template

## Purpose

This audit documents the current color usage in the Modal/Dialog base component and outlines required changes for the new color system.

## Component Information

- **Component Name**: Modal/Dialog
- **File Location**: components/ui/modal.tsx
- **Type**: Common UI Component
- **Has Theme Variants**: No
- **Uses Brand Colors**: No

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Modal background
bg - black / 50; // Backdrop overlay
bg - gray - 50; // Section backgrounds

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text
text - gray - 500; // Helper text

// Border Colors
border - gray - 200; // Modal border
border - gray - 300; // Section dividers
border - transparent; // Hidden borders

// Shadow Effects
shadow - lg; // Modal shadow
ring - offset - white; // Focus ring offset
backdrop - blur - sm; // Backdrop effect
```

### State Variations

- Default:
  - Modal: bg-white, border-gray-200
  - Backdrop: bg-black/50
- Focus:
  - ring-2
  - ring-blue-500
  - ring-offset-2
- Disabled: No specific disabled state
- Animated States:
  - Opening/closing transitions
  - Backdrop fade

### Brand Color Usage

None by default, but supports:

- Custom background colors
- Themed content areas
- Brand-specific borders

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-black/50       → bg-overlay
bg-gray-50        → bg-background-secondary

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-gray-500     → text-content-tertiary

// Borders
border-gray-200   → border-primary
border-gray-300   → border-secondary
ring-blue-500     → ring-focus
```

### Theme Considerations

- Light theme adjustments:
  - Maintain clear modal hierarchy
  - Visible borders and shadows
  - Clear backdrop overlay
- Dark theme adjustments:
  - Adjust contrast for visibility
  - Modify backdrop opacity
  - Ensure content readability
- Brand color handling:
  - Support for themed variants
  - Maintain consistent overlay colors

### Accessibility Notes

- Contrast requirements:
  - Modal content: 4.5:1 minimum
  - Helper text: 4.5:1 minimum
  - Backdrop contrast sufficient for focus
- Focus indicators:
  - Trap focus within modal
  - Clear focus indicators
  - Keyboard navigation support
- Other considerations:
  - Screen reader announcements
  - Keyboard dismiss support
  - Role and ARIA attributes

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Implement proper focus management
- [ ] Add transition effects
- [ ] Update overlay styling
- [ ] Test contrast in all themes
- [ ] Verify focus trapping
- [ ] Add keyboard support
- [ ] Test screen reader support

## Additional Notes

- Consider adding size variants
- Add transition customization
- Support for custom backdrops
- Consider adding portal configuration
- Document composition patterns
