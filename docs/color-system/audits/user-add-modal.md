# Component Color Audit Template

## Purpose

This audit documents the current color usage in the AddUserModal component of the User Management interface.

## Component Information

- **Component Name**: AddUserModal
- **File Location**: components/user-management/add-user-modal.tsx
- **Type**: Modal Dialog
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (Role-specific colors)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Modal background
bg - gray - 50; // Form input backgrounds
bg - blue - 500; // Submit button
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

// Border Colors
border - gray - 200; // Modal border
border - gray - 300; // Input borders
focus: border - blue - 500; // Input focus
border - transparent; // Role selector default

// Shadow Effects
shadow - lg; // Modal shadow
ring - offset - white; // Focus ring offset
```

### State Variations

- Default:
  - Inputs: bg-gray-50, border-gray-300
  - Buttons: bg-blue-500 (submit), bg-gray-200 (cancel)
  - Role selectors: border-transparent
- Hover:
  - Submit: hover:bg-blue-600
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
- Submit button matches interface theme

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-gray-50        → bg-background-secondary
bg-blue-500       → bg-interactive-primary
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

// Borders & Focus
border-gray-200   → border-primary
border-gray-300   → border-secondary
border-blue-500   → border-focus
```

### Theme Considerations

- Light theme adjustments:
  - Maintain role distinction
  - Ensure form element visibility
  - Consider softer role indicators
- Dark theme adjustments:
  - Adjust modal background contrast
  - Modify input field backgrounds
  - Ensure role indicators are visible
- Brand color handling:
  - Maintain role color consistency
  - Consider theme-specific role colors

### Accessibility Notes

- Contrast requirements:
  - Form labels: 4.5:1 minimum
  - Input text: 4.5:1 minimum
  - Role indicators: 3:1 minimum
- Focus indicators:
  - Visible focus rings on all interactive elements
  - High contrast focus states
  - Clear role selection state
- Other considerations:
  - Role selection not solely dependent on color
  - Clear form validation feedback
  - Keyboard navigation support

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Implement proper focus states
- [ ] Add hover state transitions
- [ ] Update role indicators
- [ ] Test contrast in all themes
- [ ] Verify form accessibility
- [ ] Test keyboard navigation
- [ ] Add loading states

## Additional Notes

- Consider adding role selection icons
- Add visual feedback for form submission
- Consider adding field-level validation
- May need loading states for async operations
- Consider adding form autosave
