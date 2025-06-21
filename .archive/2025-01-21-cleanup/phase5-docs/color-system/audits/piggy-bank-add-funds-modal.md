# Component Color Audit Template

## Purpose

This audit documents the current color usage in the AddFundsModal component of the Piggy Bank interface.

## Component Information

- **Component Name**: AddFundsModal
- **File Location**: components/piggy-bank/add-funds-modal.tsx
- **Type**: Modal Dialog
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (Success indicators)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Modal background
bg - gray - 50; // Form input backgrounds
bg - green - 500; // Submit button
bg - gray - 200; // Cancel button

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text
text - gray - 500; // Input labels
text - white; // Button text
text - green - 600; // Success messages

// Border Colors
border - gray - 200; // Modal border
border - gray - 300; // Input borders
focus: border - blue - 500; // Input focus

// Shadow Effects
shadow - lg; // Modal shadow
ring - offset - white; // Focus ring offset
```

### State Variations

- Default:
  - Inputs: bg-gray-50, border-gray-300
  - Buttons: bg-green-500 (submit), bg-gray-200 (cancel)
- Hover:
  - Submit: hover:bg-green-600
  - Cancel: hover:bg-gray-300
- Focus:
  - Inputs: focus:border-blue-500, focus:ring-2
- Error:
  - border-red-500
  - text-red-600
- Disabled: opacity-50

### Brand Color Usage

- Success indicators (green)
- Error states (red)

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-gray-50        → bg-background-secondary
bg-green-500      → bg-interactive-success
bg-gray-200       → bg-interactive-secondary

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-gray-500     → text-content-tertiary
text-white        → text-content-inverse
text-green-600    → text-feedback-success

// Borders & Focus
border-gray-200   → border-primary
border-gray-300   → border-secondary
border-blue-500   → border-focus
ring-offset-white → ring-offset-background
```

### Theme Considerations

- Light theme adjustments:
  - Consider softer success colors
  - Maintain form element visibility
  - Ensure readable validation messages
- Dark theme adjustments:
  - Adjust modal background contrast
  - Modify input field backgrounds
  - Ensure validation states are visible
- Brand color handling:
  - Maintain consistent success/error states
  - Consider theme-specific feedback colors

### Accessibility Notes

- Contrast requirements:
  - Form labels: 4.5:1 minimum
  - Input text: 4.5:1 minimum
  - Button text: 4.5:1 minimum
- Focus indicators:
  - Visible focus rings on all interactive elements
  - Sufficient contrast for focus states
- Other considerations:
  - Clear error state indication
  - Visible validation feedback
  - Keyboard navigation support

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Implement proper focus states
- [ ] Add hover state transitions
- [ ] Update validation state colors
- [ ] Test contrast in all themes
- [ ] Verify form accessibility
- [ ] Test keyboard navigation
- [ ] Verify screen reader support

## Additional Notes

- Consider adding loading states for submission
- Evaluate animation needs for modal transitions
- Consider adding progress indication for multi-step forms
- May need special handling for currency inputs
