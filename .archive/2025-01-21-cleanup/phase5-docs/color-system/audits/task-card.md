# Component Color Audit Template

## Purpose

This audit documents the current color usage in the TaskCard component of the Task Management interface.

## Component Information

- **Component Name**: TaskCard
- **File Location**: components/task-management/task-card.tsx
- **Type**: UI Component
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (Task-related colors)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - blue - 100; // Active task background
bg - gray - 100; // Inactive task background
hover: bg - blue - 200; // Active task hover
hover: bg - gray - 200; // Inactive task hover

// Text Colors
text - blue - 600; // Active task title
text - gray - 500; // Inactive task title
text - gray - 600; // Task description
text - green - 600; // Payout amount

// Border Colors
border - blue - 500; // Active task border
border - gray - 300; // Inactive task border
hover: border - blue - 600; // Active task hover border
hover: border - gray - 400; // Inactive task hover border

// Icon Colors
text - blue - 500; // Active task icon
text - gray - 400; // Inactive task icon

// Shadow Effects
shadow - sm; // Default shadow
hover: shadow - md; // Hover shadow state
```

### State Variations

- Default:
  - Active: bg-blue-100, text-blue-600, border-blue-500
  - Inactive: bg-gray-100, text-gray-500, border-gray-300
- Hover:
  - Active: hover:bg-blue-200, hover:border-blue-600
  - Inactive: hover:bg-gray-200, hover:border-gray-400
- Focus: No specific focus state
- Selected: No specific selected state
- Disabled: opacity-50

### Brand Color Usage

- Task status colors (active/inactive)
- Task category indicators
- Payout amount highlighting

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-blue-100       → bg-brand-task-subtle
bg-gray-100       → bg-background-muted
hover:bg-blue-200 → hover:bg-brand-task-subtle-hover
hover:bg-gray-200 → hover:bg-background-muted-hover

// Text
text-blue-600     → text-brand-task
text-gray-500     → text-content-muted
text-gray-600     → text-content-secondary
text-green-600    → text-feedback-success

// Borders
border-blue-500   → border-brand-task
border-gray-300   → border-muted
```

### Theme Considerations

- Light theme adjustments:
  - Maintain task status visibility
  - Ensure readable task information
  - Consider softer status colors
- Dark theme adjustments:
  - Adjust background contrasts
  - Modify status colors
  - Ensure payout amounts are visible
- Brand color handling:
  - Maintain task status consistency
  - Consider theme-specific task colors

### Accessibility Notes

- Contrast requirements:
  - Task title: 4.5:1 minimum
  - Description: 4.5:1 minimum
  - Payout amount: 4.5:1 minimum
- Focus indicators:
  - Add visible focus state
  - Implement focus ring
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
- [ ] Add keyboard navigation
- [ ] Test screen reader support
- [ ] Verify status visibility

## Additional Notes

- Consider adding status icons
- Add clear active/inactive indicators
- Consider adding selection state
- May need loading skeleton
- Consider adding task type indicators
