# Component Color Audit Template

## Purpose

This audit documents the current color usage in the WithdrawFundsModal component of the Piggy Bank interface.

## Component Information

- **Component Name**: WithdrawFundsModal
- **File Location**: components/piggy-bank/withdraw-funds-modal.tsx
- **Type**: Modal Dialog
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (Warning/Danger indicators)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Modal background
bg - gray - 50; // Form input backgrounds
bg - red - 500; // Submit button (withdraw)
bg - gray - 200; // Cancel button

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text
text - gray - 500; // Input labels
text - white; // Button text
text - red - 600; // Warning messages

// Border Colors
border - gray - 200; // Modal border
border - gray - 300; // Input borders
focus: border - blue - 500; // Input focus
border - red - 500; // Validation error

// Shadow Effects
shadow - lg; // Modal shadow
ring - offset - white; // Focus ring offset
```

### State Variations

- Default:
  - Inputs: bg-gray-50, border-gray-300
  - Buttons: bg-red-500 (withdraw), bg-gray-200 (cancel)
- Hover:
  - Withdraw: hover:bg-red-600
  - Cancel: hover:bg-gray-300
- Focus:
  - Inputs: focus:border-blue-500, focus:ring-2
- Error:
  - border-red-500
  - text-red-600
- Disabled: opacity-50

### Brand Color Usage

- Warning/Danger indicators (red)
- Error states (red)

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-gray-50        → bg-background-secondary
bg-red-500        → bg-interactive-danger
bg-gray-200       → bg-interactive-secondary

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-gray-500     → text-content-tertiary
text-white        → text-content-inverse
text-red-600      → text-feedback-danger

// Borders & Focus
border-gray-200   → border-primary
border-gray-300   → border-secondary
border-red-500    → border-danger
border-blue-500   → border-focus
```

### Theme Considerations

- Light theme adjustments:
  - Consider softer danger colors
  - Maintain clear warning indicators
  - Ensure validation messages are prominent
- Dark theme adjustments:
  - Adjust modal background contrast
  - Modify danger colors for dark theme
  - Ensure warning states are visible
- Brand color handling:
  - Maintain consistent warning/danger states
  - Consider theme-specific feedback colors

### Accessibility Notes

- Contrast requirements:
  - Form labels: 4.5:1 minimum
  - Input text: 4.5:1 minimum
  - Warning text: 4.5:1 minimum
- Focus indicators:
  - Visible focus rings on all interactive elements
  - High contrast focus states
- Other considerations:
  - Clear withdrawal amount indication
  - Multiple warning indicators (not just color)
  - Clear error messaging

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Implement proper focus states
- [ ] Add hover state transitions
- [ ] Update warning state colors
- [ ] Test contrast in all themes
- [ ] Verify form accessibility
- [ ] Test keyboard navigation
- [ ] Verify screen reader support

## Additional Notes

- Consider adding confirmation step for large withdrawals
- Add non-color warning indicators (icons)
- Consider adding withdrawal limits visualization
- Add balance preview after withdrawal
