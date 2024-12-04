# Component Color Audit Template

## Purpose

This audit documents the current color usage in the Button component variants and outlines required changes for the new color system.

## Component Information

- **Component Name**: Button
- **File Location**: components/ui/button.tsx
- **Type**: Common UI Component
- **Has Theme Variants**: No
- **Uses Brand Colors**: No

## Current Color Usage

### Direct Color Values

```tsx
// Primary Button
bg - blue - 500; // Default background
hover: bg - blue - 600; // Hover background
text - white; // Text color

// Secondary Button
bg - gray - 200; // Default background
hover: bg - gray - 300; // Hover background
text - gray - 900; // Text color

// Ghost Button
bg - transparent; // Default background
hover: bg - gray - 100; // Hover background
text - gray - 600; // Text color

// Destructive Button
bg - red - 500; // Default background
hover: bg - red - 600; // Hover background
text - white; // Text color

// Disabled State (all variants)
opacity - 50; // Disabled state
cursor - not - allowed; // Disabled cursor
```

### State Variations

- Default: Variant-specific colors
- Hover: Darker shade of variant color
- Focus:
  - ring-2
  - ring-blue-500
  - ring-offset-2
- Active: Scale reduction
- Disabled: opacity-50

### Brand Color Usage

None directly, but should support brand colors when needed

## Required Changes

### Semantic Token Mapping

```tsx
// Primary Button
bg-blue-500       → bg-interactive-primary
hover:bg-blue-600 → hover:bg-interactive-primary-hover
text-white        → text-content-inverse

// Secondary Button
bg-gray-200       → bg-interactive-secondary
hover:bg-gray-300 → hover:bg-interactive-secondary-hover
text-gray-900     → text-content-primary

// Ghost Button
bg-transparent    → bg-transparent
hover:bg-gray-100 → hover:bg-interactive-subtle
text-gray-600     → text-content-secondary

// Destructive Button
bg-red-500        → bg-interactive-danger
hover:bg-red-600  → hover:bg-interactive-danger-hover
text-white        → text-content-inverse

// Focus States
ring-blue-500     → ring-focus
ring-offset-2     → ring-offset-2
```

### Theme Considerations

- Light theme adjustments:
  - Maintain clear button hierarchy
  - Ensure readable text
  - Clear interactive states
- Dark theme adjustments:
  - Adjust contrast for visibility
  - Modify ghost button hover
  - Ensure focus rings are visible
- Brand color handling:
  - Support brand colors for specific contexts
  - Maintain consistent interaction states

### Accessibility Notes

- Contrast requirements:
  - Text contrast: 4.5:1 minimum
  - Interactive element contrast: 3:1 minimum
- Focus indicators:
  - Visible focus rings
  - High contrast focus states
  - Consistent across variants
- Other considerations:
  - Clear disabled states
  - Visible hover/active states
  - Support for icons and loading states

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update focus ring colors
- [ ] Implement consistent hover states
- [ ] Add proper active states
- [ ] Update disabled styling
- [ ] Test contrast in all themes
- [ ] Verify focus visibility
- [ ] Add loading states
- [ ] Test with icons

## Additional Notes

- Consider adding size variants
- Add transition effects
- Consider adding outline variant
- Support for full width option
- Consider adding icon-only variant with tooltip
