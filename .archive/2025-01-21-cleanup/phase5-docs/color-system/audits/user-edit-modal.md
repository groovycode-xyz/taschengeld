# Component Color Audit Template

## Purpose

This audit documents the current color usage in the EditUserModal component of the User Management interface.

## Component Information

- **Component Name**: EditUserModal
- **File Location**: components/user-management/edit-user-modal.tsx
- **Type**: Modal Dialog
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (Role-specific colors, Danger actions)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Modal background
bg - gray - 50; // Form input backgrounds
bg - blue - 500; // Save button
bg - red - 500; // Delete button
bg - gray - 200; // Cancel button
bg - green - 100; // Parent role selector
bg - blue - 100; // Child role selector

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text
text - gray - 500; // Input labels
text - white; // Button text
text - green - 600; // Parent role text
text - blue - 600; // Child role text
text - red - 600; // Delete text & warnings

// Border Colors
border - gray - 200; // Modal border
border - gray - 300; // Input borders
focus: border - blue - 500; // Input focus
border - transparent; // Role selector default
border - red - 300; // Warning section border

// Shadow Effects
shadow - lg; // Modal shadow
ring - offset - white; // Focus ring offset
```

### State Variations

- Default:
  - Inputs: bg-gray-50, border-gray-300
  - Buttons: bg-blue-500 (save), bg-red-500 (delete), bg-gray-200 (cancel)
  - Role selectors: border-transparent
- Hover:
  - Save: hover:bg-blue-600
  - Delete: hover:bg-red-600
  - Cancel: hover:bg-gray-300
  - Role selectors: hover:border-gray-300
- Focus:
  - Inputs: focus:border-blue-500, focus:ring-2
  - Role selectors: ring-2 ring-blue-500
- Selected:
  - Role selectors: border-2 border-blue-500
- Error:
  - border-red-500
  - text-red-600
- Disabled: opacity-50

### Brand Color Usage

- Role indicators (parent/child)
- Warning/Danger actions (delete)
- Success actions (save)

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-gray-50        → bg-background-secondary
bg-blue-500       → bg-interactive-primary
bg-red-500        → bg-interactive-danger
bg-gray-200       → bg-interactive-secondary
bg-green-100      → bg-role-parent-subtle
bg-blue-100       → bg-role-child-subtle

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-gray-500     → text-content-tertiary
text-white        → text-content-inverse
text-green-600    → text-role-parent
text-blue-600     → text-role-child
text-red-600      → text-feedback-danger

// Borders & Focus
border-gray-200   → border-primary
border-gray-300   → border-secondary
border-red-300    → border-danger-subtle
border-blue-500   → border-focus
```

### Theme Considerations

- Light theme adjustments:
  - Maintain role distinction
  - Ensure form element visibility
  - Consider softer role indicators
  - Ensure warning/danger states are clear
- Dark theme adjustments:
  - Adjust modal background contrast
  - Modify input field backgrounds
  - Ensure role indicators are visible
  - Maintain warning/danger visibility
- Brand color handling:
  - Maintain role color consistency
  - Consider theme-specific role colors
  - Ensure danger actions remain prominent

### Accessibility Notes

- Contrast requirements:
  - Form labels: 4.5:1 minimum
  - Input text: 4.5:1 minimum
  - Role indicators: 3:1 minimum
  - Warning text: 4.5:1 minimum
- Focus indicators:
  - Visible focus rings on all interactive elements
  - High contrast focus states
  - Clear role selection state
- Other considerations:
  - Clear warning messages for destructive actions
  - Multiple indicators for danger states
  - Keyboard navigation support
  - Clear confirmation for destructive actions

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Implement proper focus states
- [ ] Add hover state transitions
- [ ] Update role indicators
- [ ] Update warning/danger states
- [ ] Test contrast in all themes
- [ ] Verify form accessibility
- [ ] Test keyboard navigation
- [ ] Add loading states

## Additional Notes

- Consider adding confirmation dialog for delete action
- Add visual feedback for save operation
- Consider adding field-level validation
- May need loading states for async operations
- Consider adding form autosave
- Add clear visual distinction between edit and create modes
