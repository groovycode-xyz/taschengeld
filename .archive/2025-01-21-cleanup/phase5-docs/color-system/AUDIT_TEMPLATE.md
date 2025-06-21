# Component Color Audit Template

## Purpose

This template provides a standardized format for auditing color usage in components and documenting required changes for the new color system.

## Component Information

- **Component Name**: [e.g., Sidebar]
- **File Location**: [e.g., components/sidebar.tsx]
- **Type**: [Core Layout | Interface | Modal | UI Element]
- **Has Theme Variants**: [Yes/No]
- **Uses Brand Colors**: [Yes/No]

## Current Color Usage

### Direct Color Values

List all hardcoded color values:

```tsx
// Example format:
bg - gray - 900; // Background
text - white; // Text
border - gray - 800; // Borders
hover: bg - gray - 800; // States
```

### State Variations

Document color changes for different states:

- Default: [color values]
- Hover: [color values]
- Active: [color values]
- Disabled: [color values]
- Focus: [color values]

### Brand Color Usage

If applicable, document any brand-specific colors:

- User-related: [color values]
- Task-related: [color values]

## Required Changes

### Semantic Token Mapping

Document how current colors should map to semantic tokens:

```tsx
// Example format:
bg-gray-900      → bg-background-primary
text-white       → text-content-primary
border-gray-800  → border-primary
```

### Theme Considerations

- Light theme adjustments: [specific considerations]
- Dark theme adjustments: [specific considerations]
- Brand color handling: [if applicable]

### Accessibility Notes

- Contrast requirements: [specific requirements]
- Focus indicators: [requirements]
- Other considerations: [any additional notes]

## Implementation Checklist

- [ ] Replace direct color values with semantic tokens
- [ ] Add theme variant support
- [ ] Update state handling
- [ ] Verify accessibility requirements
- [ ] Test in all themes
- [ ] Document any component-specific theme rules

## Additional Notes

[Any other relevant information about the component's color usage or special considerations]
