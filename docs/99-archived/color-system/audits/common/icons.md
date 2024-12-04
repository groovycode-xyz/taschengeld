# Component Color Audit Template

## Purpose

This audit documents the current color usage in Icons and visual indicators throughout the application and outlines required changes for the new color system.

## Component Information

- **Component Name**: Icons and Visual Indicators
- **File Location**: components/ui/icons/\*.tsx
- **Type**: Common UI Component
- **Has Theme Variants**: No
- **Uses Brand Colors**: Sometimes (for branded contexts)

## Current Color Usage

### Direct Color Values

```tsx
// Icon Colors
text - gray - 900; // Primary icon color
text - gray - 600; // Secondary icon color
text - gray - 400; // Disabled icon color
text - white; // Inverse icon color

// Status Indicators
text - green - 500; // Success indicator
text - red - 500; // Error indicator
text - yellow - 500; // Warning indicator
text - blue - 500; // Info indicator

// Brand-Specific Icons
text - brand - user; // User-related icons
text - brand - task; // Task-related icons

// Interactive Icons
text - blue - 500; // Interactive icon default
hover: text - blue - 600; // Interactive icon hover
text - gray - 400; // Disabled state
```

### State Variations

- Default: Variant-specific colors
- Hover: Darker/lighter variant
- Active: Further color adjustment
- Disabled: text-gray-400 + opacity-50
- Focus: Focus ring when interactive

### Brand Color Usage

- User management icons use brand-user colors
- Task management icons use brand-task colors
- System icons use theme colors

## Required Changes

### Semantic Token Mapping

```tsx
// Icon Base Colors
text-gray-900     → text-icon-primary
text-gray-600     → text-icon-secondary
text-gray-400     → text-icon-tertiary
text-white        → text-icon-inverse

// Status Colors
text-green-500    → text-status-success
text-red-500      → text-status-error
text-yellow-500   → text-status-warning
text-blue-500     → text-status-info

// Interactive States
text-blue-500     → text-interactive-primary
hover:text-blue-600 → hover:text-interactive-primary-hover
text-gray-400     → text-interactive-disabled
```

### Theme Considerations

- Light theme adjustments:
  - Maintain clear visibility
  - Sufficient contrast with backgrounds
  - Clear status indicators
- Dark theme adjustments:
  - Adjust icon opacity
  - Modify status colors
  - Ensure focus visibility
- Brand color handling:
  - Consistent brand icon colors
  - Theme-aware brand icons

### Accessibility Notes

- Contrast requirements:
  - UI icons: 3:1 minimum
  - Status indicators: 3:1 minimum
  - Interactive icons: 3:1 minimum
- Focus indicators:
  - Clear focus states for interactive icons
  - Sufficient contrast for focus rings
- Other considerations:
  - Icons should have labels or aria-labels
  - Status should not rely on color alone
  - Interactive icons need proper roles

## Implementation Checklist

- [ ] Replace icon colors with semantic tokens
- [ ] Update status indicator colors
- [ ] Implement proper focus states
- [ ] Add hover transitions
- [ ] Update disabled styling
- [ ] Test contrast in all themes
- [ ] Verify accessibility
- [ ] Add proper ARIA attributes
- [ ] Test screen reader support
- [ ] Document icon usage patterns

## Additional Notes

- Consider creating icon component library
- Add size variants
- Support for custom colors
- Add loading state variants
- Consider adding animation support
- Document accessibility requirements
