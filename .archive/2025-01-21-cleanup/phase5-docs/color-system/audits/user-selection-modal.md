# Component Color Audit Template

## Purpose

This audit documents the current color usage in the UserSelectionModal component of the Task Completion interface.

## Component Information

- **Component Name**: UserSelectionModal
- **File Location**: components/task-completion/user-selection-modal.tsx
- **Type**: Modal Dialog
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (User colors)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Modal background
bg - gray - 50; // User row background
bg - green - 100; // Selected user background
bg - blue - 500; // Confirm button
bg - gray - 200; // Cancel button

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text
text - gray - 500; // Helper text
text - white; // Button text
text - green - 600; // Selected user text

// Border Colors
border - gray - 200; // Modal border
border - gray - 300; // Row borders
border - green - 500; // Selected user border
focus: border - blue - 500; // Focus state

// Shadow Effects
shadow - lg; // Modal shadow
shadow - sm; // Row shadows
hover: shadow - md; // Row hover state
```

### State Variations

- Default:
  - Modal: bg-white, border-gray-200
  - Rows: bg-gray-50, border-gray-300
- Selected:
  - bg-green-100
  - border-green-500
  - text-green-600
- Hover:
  - Rows: hover:bg-gray-100
  - Buttons: hover:bg-blue-600 (confirm), hover:bg-gray-300 (cancel)
- Focus:
  - focus:border-blue-500
  - focus:ring-2
- Disabled: opacity-50

### Brand Color Usage

- User selection indicators
- Confirmation actions

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-gray-50        → bg-background-secondary
bg-green-100      → bg-feedback-success-subtle
bg-blue-500       → bg-interactive-primary
bg-gray-200       → bg-interactive-secondary

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-gray-500     → text-content-tertiary
text-white        → text-content-inverse
text-green-600    → text-feedback-success

// Borders
border-gray-200   → border-primary
border-gray-300   → border-secondary
border-green-500  → border-success
border-blue-500   → border-focus
```

### Theme Considerations

- Light theme adjustments:
  - Maintain selection visibility
  - Clear user rows
  - Visible selection state
- Dark theme adjustments:
  - Adjust modal contrast
  - Modify selection colors
  - Ensure row visibility
- Brand color handling:
  - Maintain user color consistency
  - Consider theme-specific selection colors

### Accessibility Notes

- Contrast requirements:
  - User names: 4.5:1 minimum
  - Helper text: 4.5:1 minimum
  - Selection state: 3:1 minimum
- Focus indicators:
  - Add visible focus states for rows
  - Implement focus rings
  - Support keyboard selection
- Other considerations:
  - Selection not solely dependent on color
  - Clear current selection
  - Screen reader support

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Add proper focus states
- [ ] Implement selection indicators
- [ ] Update confirmation states
- [ ] Test contrast in all themes
- [ ] Verify selection visibility
- [ ] Add keyboard support
- [ ] Test screen reader support

## Additional Notes

- Consider adding selection animations
- Add clear selection indicators
- Consider adding user avatars
- May need loading states
- Consider adding search/filter functionality
