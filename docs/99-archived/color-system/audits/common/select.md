# Component Color Audit Template

## Purpose

This audit documents the current color usage in the Select dropdown component and outlines required changes for the new color system.

## Component Information

- **Component Name**: Select
- **File Location**: components/ui/select.tsx
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
bg - gray - 100; // Disabled background

// Text Colors
text - gray - 900; // Select text
text - gray - 500; // Placeholder text
text - gray - 400; // Disabled text
text - blue - 600; // Selected option text

// Border Colors
border - gray - 300; // Default border
border - gray - 200; // Option borders
focus: border - blue - 500; // Focus border
border - transparent; // Option dividers

// Icon Colors
text - gray - 500; // Dropdown icon
text - gray - 400; // Disabled icon

// Shadow Effects
shadow - sm; // Dropdown shadow
ring - offset - white; // Focus ring offset
```

### State Variations

- Default:
  - bg-white
  - border-gray-300
  - text-gray-900
- Open:
  - Extended shadow
  - Border highlight
- Option Hover:
  - bg-gray-100
- Option Selected:
  - bg-blue-50
  - text-blue-600
- Focus:
  - border-blue-500
  - ring-2
  - ring-blue-500
- Disabled:
  - bg-gray-100
  - text-gray-400
  - opacity-50

### Brand Color Usage

None by default, but supports custom selection colors

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-gray-50        → bg-background-secondary
bg-gray-100       → bg-background-hover
bg-blue-50        → bg-interactive-subtle
bg-gray-100       → bg-background-disabled

// Text
text-gray-900     → text-content-primary
text-gray-500     → text-content-tertiary
text-gray-400     → text-content-disabled
text-blue-600     → text-interactive-primary

// Borders & Focus
border-gray-300   → border-primary
border-gray-200   → border-secondary
border-blue-500   → border-focus
```

### Theme Considerations

- Light theme adjustments:
  - Maintain option visibility
  - Clear selection state
  - Visible dropdown shadow
- Dark theme adjustments:
  - Adjust option contrast
  - Modify selection colors
  - Ensure dropdown visibility
- Brand color handling:
  - Support for custom selection colors
  - Maintain consistent states

### Accessibility Notes

- Contrast requirements:
  - Select text: 4.5:1 minimum
  - Option text: 4.5:1 minimum
  - Selected state: 3:1 minimum
- Focus indicators:
  - Clear focus rings
  - Visible dropdown state
  - Keyboard navigation support
- Other considerations:
  - Screen reader announcements
  - Clear selection indication
  - Keyboard controls

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Implement proper focus states
- [ ] Add hover transitions
- [ ] Update selection states
- [ ] Test contrast in all themes
- [ ] Verify dropdown visibility
- [ ] Add keyboard support
- [ ] Test screen reader support

## Additional Notes

- Consider adding size variants
- Add multi-select support
- Consider adding group headers
- Support for option icons
- Add loading state
