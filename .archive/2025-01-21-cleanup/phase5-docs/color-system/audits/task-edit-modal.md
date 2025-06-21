# Component Color Audit Template

## Purpose

This audit documents the current color usage in the EditTaskModal component of the Task Management interface.

## Component Information

- **Component Name**: EditTaskModal
- **File Location**: components/task-management/edit-task-modal.tsx
- **Type**: Modal Dialog
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (Task-related colors, Status indicators)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Modal background
bg - gray - 50; // Form input backgrounds
bg - blue - 500; // Save button
bg - red - 500; // Delete button
bg - gray - 200; // Cancel button
bg - blue - 100; // Task preview background
bg - green - 100; // Active status indicator
bg - gray - 100; // Inactive status indicator

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text
text - gray - 500; // Input labels
text - white; // Button text
text - blue - 600; // Task preview text
text - green - 600; // Active status text
text - gray - 500; // Inactive status text
text - red - 600; // Delete text & warnings

// Border Colors
border - gray - 200; // Modal border
border - gray - 300; // Input borders
focus: border - blue - 500; // Input focus
border - blue - 200; // Task preview border
border - green - 200; // Active status border
border - gray - 300; // Inactive status border
border - red - 300; // Warning section border

// Shadow Effects
shadow - lg; // Modal shadow
ring - offset - white; // Focus ring offset
```

### State Variations

- Default:
  - Inputs: bg-gray-50, border-gray-300
  - Buttons: bg-blue-500 (save), bg-red-500 (delete), bg-gray-200 (cancel)
  - Preview: bg-blue-100, border-blue-200
  - Status: Active (green) or Inactive (gray)
- Hover:
  - Save: hover:bg-blue-600
  - Delete: hover:bg-red-600
  - Cancel: hover:bg-gray-300
  - Status toggle: hover:bg-opacity-80
- Focus:
  - Inputs: focus:border-blue-500, focus:ring-2
  - Status toggle: ring-2 ring-offset-2
- Error:
  - border-red-500
  - text-red-600
- Disabled: opacity-50

### Brand Color Usage

- Task preview colors
- Status indicators
- Submit button matches task brand
- Task icon colors

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-gray-50        → bg-background-secondary
bg-blue-500       → bg-brand-task
bg-red-500        → bg-interactive-danger
bg-gray-200       → bg-interactive-secondary
bg-blue-100       → bg-brand-task-subtle
bg-green-100      → bg-status-active
bg-gray-100       → bg-status-inactive

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-gray-500     → text-content-tertiary
text-white        → text-content-inverse
text-blue-600     → text-brand-task
text-green-600    → text-status-active
text-red-600      → text-feedback-danger

// Borders
border-gray-200   → border-primary
border-gray-300   → border-secondary
border-blue-500   → border-focus
border-red-300    → border-danger-subtle
```

### Theme Considerations

- Light theme adjustments:
  - Maintain task preview visibility
  - Ensure form element clarity
  - Consider softer preview colors
  - Clear status indicators
- Dark theme adjustments:
  - Adjust modal background contrast
  - Modify input field backgrounds
  - Ensure preview is visible
  - Maintain status visibility
- Brand color handling:
  - Maintain task color consistency
  - Consider theme-specific preview colors
  - Ensure status indicators work in all themes

### Accessibility Notes

- Contrast requirements:
  - Form labels: 4.5:1 minimum
  - Input text: 4.5:1 minimum
  - Preview text: 4.5:1 minimum
  - Status indicators: 3:1 minimum
- Focus indicators:
  - Visible focus rings on all interactive elements
  - High contrast focus states
  - Clear status toggle focus
- Other considerations:
  - Multiple indicators for status (not just color)
  - Clear warning messages for destructive actions
  - Keyboard navigation support

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Implement proper focus states
- [ ] Add hover state transitions
- [ ] Update preview colors
- [ ] Update status indicators
- [ ] Test contrast in all themes
- [ ] Verify form accessibility
- [ ] Test keyboard navigation
- [ ] Add loading states

## Additional Notes

- Consider adding confirmation dialog for delete action
- Add visual feedback for save operation
- Consider adding field-level validation
- May need loading states for async operations
- Add clear visual distinction between active/inactive states
- Consider adding status change confirmation
