# Component Color Audit Template

## Purpose

This audit documents the current color usage in the AddTaskModal component of the Task Management interface.

## Component Information

- **Component Name**: AddTaskModal
- **File Location**: components/task-management/add-task-modal.tsx
- **Type**: Modal Dialog
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (Task-related colors)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Modal background
bg - gray - 50; // Form input backgrounds
bg - blue - 500; // Submit button
bg - gray - 200; // Cancel button
bg - blue - 100; // Task preview background

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text
text - gray - 500; // Input labels
text - white; // Button text
text - blue - 600; // Task preview text
text - green - 600; // Payout amount

// Border Colors
border - gray - 200; // Modal border
border - gray - 300; // Input borders
focus: border - blue - 500; // Input focus
border - blue - 200; // Task preview border

// Shadow Effects
shadow - lg; // Modal shadow
ring - offset - white; // Focus ring offset
```

### State Variations

- Default:
  - Inputs: bg-gray-50, border-gray-300
  - Buttons: bg-blue-500 (submit), bg-gray-200 (cancel)
  - Preview: bg-blue-100, border-blue-200
- Hover:
  - Submit: hover:bg-blue-600
  - Cancel: hover:bg-gray-300
- Focus:
  - Inputs: focus:border-blue-500, focus:ring-2
- Error:
  - border-red-500
  - text-red-600
- Disabled: opacity-50

### Brand Color Usage

- Task preview colors
- Submit button matches task brand
- Task icon colors

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-gray-50        → bg-background-secondary
bg-blue-500       → bg-brand-task
bg-gray-200       → bg-interactive-secondary
bg-blue-100       → bg-brand-task-subtle

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-gray-500     → text-content-tertiary
text-white        → text-content-inverse
text-blue-600     → text-brand-task
text-green-600    → text-feedback-success

// Borders
border-gray-200   → border-primary
border-gray-300   → border-secondary
border-blue-500   → border-focus
border-blue-200   → border-brand-task-subtle
```

### Theme Considerations

- Light theme adjustments:
  - Maintain task preview visibility
  - Ensure form element clarity
  - Consider softer preview colors
- Dark theme adjustments:
  - Adjust modal background contrast
  - Modify input field backgrounds
  - Ensure preview is visible
- Brand color handling:
  - Maintain task color consistency
  - Consider theme-specific preview colors

### Accessibility Notes

- Contrast requirements:
  - Form labels: 4.5:1 minimum
  - Input text: 4.5:1 minimum
  - Preview text: 4.5:1 minimum
- Focus indicators:
  - Visible focus rings on all interactive elements
  - High contrast focus states
  - Clear preview state
- Other considerations:
  - Clear task preview indication
  - Visible validation feedback
  - Keyboard navigation support

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Implement proper focus states
- [ ] Add hover state transitions
- [ ] Update preview colors
- [ ] Test contrast in all themes
- [ ] Verify form accessibility
- [ ] Test keyboard navigation
- [ ] Add loading states

## Additional Notes

- Consider adding task type icons
- Add visual feedback for form submission
- Consider adding field-level validation
- May need loading states for async operations
- Consider adding task preview animation
