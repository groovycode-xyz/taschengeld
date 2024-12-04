# Component Color Audit Template

## Purpose

This audit documents the current color usage in the Task Management interface and outlines required changes for the new color system.

## Component Information

- **Component Name**: Task Management Interface
- **File Location**: components/task-management.tsx
- **Type**: Primary Interface
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (Task-related colors)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Main container background
bg - blue - 100; // Active task card background
bg - gray - 100; // Inactive task card background
hover: bg - blue - 200; // Active task hover
hover: bg - gray - 200; // Inactive task hover

// Text Colors
text - gray - 900; // Primary text
text - blue - 600; // Active task title
text - gray - 500; // Inactive task title
text - gray - 400; // Secondary information
text - green - 600; // Payout amounts

// Border Colors
border - gray - 200; // Card borders
border - blue - 500; // Active task borders
border - gray - 300; // Inactive task borders

// Shadow Effects
shadow - md; // Card shadows
hover: shadow - lg; // Card hover state
```

### State Variations

- Default:
  - Active Tasks: bg-blue-100, text-blue-600
  - Inactive Tasks: bg-gray-100, text-gray-500
- Hover:
  - Active: hover:bg-blue-200, hover:shadow-lg
  - Inactive: hover:bg-gray-200, hover:shadow-lg
- Selected: No specific selected state
- Focus: No specific focus states
- Disabled: opacity-50

### Brand Color Usage

- Task status indicators (active/inactive)
- Task category colors
- Payout amount indicators

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-blue-100       → bg-brand-task-subtle
bg-gray-100       → bg-background-muted

// Text
text-gray-900     → text-content-primary
text-blue-600     → text-brand-task
text-gray-500     → text-content-muted
text-green-600    → text-feedback-success

// Borders & Effects
border-gray-200   → border-primary
border-blue-500   → border-brand-task
shadow-md        → shadow-base
```

### Theme Considerations

- Light theme adjustments:
  - Maintain task status visibility
  - Ensure readable task information
  - Consider softer status indicators
- Dark theme adjustments:
  - Adjust card contrasts
  - Modify status colors
  - Ensure payout amounts are visible
- Brand color handling:
  - Maintain task status consistency
  - Consider theme-specific task colors

### Accessibility Notes

- Contrast requirements:
  - Task titles: 4.5:1 minimum
  - Status indicators: 3:1 minimum
  - Payout amounts: 4.5:1 minimum
- Focus indicators:
  - Add visible focus states for cards
  - Implement focus rings for interactive elements
  - Support keyboard navigation
- Other considerations:
  - Status indication not solely dependent on color
  - Clear task hierarchy
  - Screen reader support for task status

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Add proper focus states
- [ ] Implement hover transitions
- [ ] Update status indicators
- [ ] Test contrast in all themes
- [ ] Verify task status visibility
- [ ] Add keyboard navigation
- [ ] Test screen reader support

## Additional Notes

- Consider adding task type icons
- Add clear active/inactive indicators
- Consider adding task grouping
- May need loading states for task updates
- Consider adding bulk actions support
