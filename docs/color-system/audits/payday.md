# Component Color Audit Template

## Purpose

This audit documents the current color usage in the Payday interface and outlines required changes for the new color system.

## Component Information

- **Component Name**: Payday Interface
- **File Location**: components/payday.tsx
- **Type**: Primary Interface
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (Task and User colors)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - [#FBFBFB]; // Main container background
bg - white; // Card backgrounds
bg - green - 500; // Approve button
bg - red - 500; // Reject button
bg - blue - 100; // Task highlight
bg - gray - 50; // Filter section background

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text
text - gray - 500; // Filter labels
text - white; // Button text
text - green - 600; // Approved status
text - red - 600; // Rejected status
text - blue - 600; // Task amount

// Border Colors
border - gray - 200; // Card borders
border - b; // Section dividers
border - gray - 300; // Input borders
border - green - 500; // Approved indicator
border - red - 500; // Rejected indicator

// Shadow Effects
shadow - sm; // Card shadows
hover: shadow - md; // Card hover state
```

### State Variations

- Default:
  - Cards: bg-white, border-gray-200
  - Buttons: bg-green-500 (approve), bg-red-500 (reject)
- Hover:
  - Cards: hover:shadow-md
  - Approve: hover:bg-green-600
  - Reject: hover:bg-red-600
- Selected: bg-blue-50
- Focus: No specific focus states
- Disabled: opacity-50

### Brand Color Usage

- Task status indicators
- User identification colors
- Amount highlighting

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-[#FBFBFB]      → bg-background-primary
bg-white          → bg-background-secondary
bg-green-500      → bg-interactive-success
bg-red-500        → bg-interactive-danger
bg-blue-100       → bg-brand-task-subtle

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-gray-500     → text-content-tertiary
text-white        → text-content-inverse
text-green-600    → text-feedback-success
text-red-600      → text-feedback-error
text-blue-600     → text-brand-task

// Borders
border-gray-200   → border-primary
border-gray-300   → border-secondary
border-green-500  → border-success
border-red-500    → border-danger
```

### Theme Considerations

- Light theme adjustments:
  - Maintain task status visibility
  - Ensure readable amounts
  - Consider softer status colors
- Dark theme adjustments:
  - Adjust card contrasts
  - Modify status colors
  - Ensure amount visibility
- Brand color handling:
  - Maintain task/user color consistency
  - Consider theme-specific status colors

### Accessibility Notes

- Contrast requirements:
  - Task amounts: 4.5:1 minimum
  - Status text: 4.5:1 minimum
  - Filter labels: 4.5:1 minimum
- Focus indicators:
  - Add visible focus states for cards
  - Implement focus rings for buttons
  - Support keyboard navigation
- Other considerations:
  - Status indication not solely dependent on color
  - Clear approval/rejection states
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
- Add clear visual feedback for bulk actions
- Consider adding filter state indicators
- May need loading states for status updates
- Consider adding sort indicators
