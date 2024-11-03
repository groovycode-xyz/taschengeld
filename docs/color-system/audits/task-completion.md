# Component Color Audit Template

## Purpose

This audit documents the current color usage in the Task Completion interface and outlines required changes for the new color system.

## Component Information

- **Component Name**: Task Completion Interface
- **File Location**: components/task-completion.tsx
- **Type**: Primary Interface
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (Task and User colors)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Main container background
bg - blue - 100; // Task card background
bg - gray - 50; // User row background
bg - blue - 500; // Drop target indicator
bg - green - 500; // Success indicator

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text
text - blue - 600; // Task title
text - green - 600; // Success message
text - gray - 500; // Instructions

// Border Colors
border - gray - 200; // Container borders
border - blue - 300; // Task card borders
border - gray - 300; // User row borders
border - blue - 500; // Drop target border
border - dashed; // Drop zone indicator

// Shadow Effects
shadow - lg; // Dragging state
shadow - md; // Card shadows
hover: shadow - xl; // Hover state
```

### State Variations

- Default:
  - Tasks: bg-blue-100, border-blue-300
  - Users: bg-gray-50, border-gray-300
- Hover:
  - Cards: hover:shadow-xl
  - Users: hover:bg-gray-100
- Dragging:
  - shadow-lg, scale-105
  - opacity-50 (drop target)
- Drop Target:
  - bg-blue-500/20
  - border-blue-500
- Success:
  - bg-green-500
  - text-white

### Brand Color Usage

- Task card colors
- User identification colors
- Success/completion indicators

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-blue-100       → bg-brand-task-subtle
bg-gray-50        → bg-background-secondary
bg-blue-500       → bg-brand-task
bg-green-500      → bg-feedback-success

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-blue-600     → text-brand-task
text-green-600    → text-feedback-success

// Borders
border-gray-200   → border-primary
border-blue-300   → border-brand-task-subtle
border-gray-300   → border-secondary
border-blue-500   → border-brand-task
```

### Theme Considerations

- Light theme adjustments:
  - Maintain task visibility
  - Clear drop targets
  - Visible success states
- Dark theme adjustments:
  - Adjust card contrasts
  - Modify drop target visibility
  - Ensure success states are visible
- Brand color handling:
  - Maintain task/user color consistency
  - Consider theme-specific interaction states

### Accessibility Notes

- Contrast requirements:
  - Task text: 4.5:1 minimum
  - Instructions: 4.5:1 minimum
  - Drop target indicators: 3:1 minimum
- Focus indicators:
  - Add visible focus states for draggable items
  - Support keyboard drag and drop
  - Clear drop target indication
- Other considerations:
  - Multiple indicators for drag states
  - Clear success feedback
  - Screen reader support for drag and drop

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Add proper focus states
- [ ] Implement drag state indicators
- [ ] Update success states
- [ ] Test contrast in all themes
- [ ] Verify drag and drop visibility
- [ ] Add keyboard support
- [ ] Test screen reader support

## Additional Notes

- Consider adding animation for drag states
- Add clear drop target indicators
- Consider adding sound effects for interactions
- May need loading states for task completion
- Consider adding task preview on drag
