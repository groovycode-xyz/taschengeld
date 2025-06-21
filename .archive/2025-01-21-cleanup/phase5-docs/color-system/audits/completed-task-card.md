# Component Color Audit Template

## Purpose

This audit documents the current color usage in the CompletedTaskCard component of the Payday interface.

## Component Information

- **Component Name**: CompletedTaskCard
- **File Location**: components/payday/completed-task-card.tsx
- **Type**: UI Component
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (Task and Status colors)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Card background
bg - green - 50; // Approved status background
bg - red - 50; // Rejected status background
bg - blue - 50; // Pending status background

// Text Colors
text - gray - 900; // Task title
text - gray - 600; // Secondary information
text - green - 600; // Approved status text
text - red - 600; // Rejected status text
text - blue - 600; // Task amount
text - gray - 500; // Completion date

// Border Colors
border - gray - 200; // Card border
border - green - 500; // Approved indicator
border - red - 500; // Rejected indicator
border - blue - 500; // Pending indicator

// Button Colors
bg - green - 500; // Approve button
bg - red - 500; // Reject button
hover: bg - green - 600; // Approve hover
hover: bg - red - 600; // Reject hover

// Shadow Effects
shadow - sm; // Card shadow
hover: shadow - md; // Card hover
```

### State Variations

- Default:
  - Card: bg-white, border-gray-200
  - Status: Pending (blue), Approved (green), Rejected (red)
- Hover:
  - Card: hover:shadow-md
  - Approve: hover:bg-green-600
  - Reject: hover:bg-red-600
- Selected: bg-blue-50
- Focus: No specific focus states
- Disabled: opacity-50

### Brand Color Usage

- Task status indicators
- Amount highlighting
- Action buttons

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-green-50       → bg-feedback-success-subtle
bg-red-50         → bg-feedback-error-subtle
bg-blue-50        → bg-brand-task-subtle

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-gray-500     → text-content-tertiary
text-green-600    → text-feedback-success
text-red-600      → text-feedback-error
text-blue-600     → text-brand-task

// Borders
border-gray-200   → border-primary
border-green-500  → border-success
border-red-500    → border-error
border-blue-500   → border-brand-task

// Interactive
bg-green-500      → bg-interactive-success
bg-red-500        → bg-interactive-error
```

### Theme Considerations

- Light theme adjustments:
  - Maintain status visibility
  - Ensure readable amounts
  - Consider softer status colors
- Dark theme adjustments:
  - Adjust card contrasts
  - Modify status colors
  - Ensure amount visibility
- Brand color handling:
  - Maintain status color consistency
  - Consider theme-specific status colors

### Accessibility Notes

- Contrast requirements:
  - Task title: 4.5:1 minimum
  - Amount: 4.5:1 minimum
  - Status text: 4.5:1 minimum
- Focus indicators:
  - Add visible focus states for buttons
  - Implement focus rings
  - Support keyboard navigation
- Other considerations:
  - Status indication not solely dependent on color
  - Clear action button states
  - Screen reader support for status changes

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Add proper focus states
- [ ] Implement hover transitions
- [ ] Update status indicators
- [ ] Test contrast in all themes
- [ ] Verify status visibility
- [ ] Add keyboard navigation
- [ ] Test screen reader support

## Additional Notes

- Consider adding status change animations
- Add clear visual feedback for actions
- Consider adding confirmation dialogs
- May need loading states for actions
- Consider adding task details expansion
