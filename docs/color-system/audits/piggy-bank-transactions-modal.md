# Component Color Audit Template

## Purpose

This audit documents the current color usage in the TransactionsModal component of the Piggy Bank interface.

## Component Information

- **Component Name**: TransactionsModal
- **File Location**: components/piggy-bank/transactions-modal.tsx
- **Type**: Modal Dialog
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (Transaction type indicators)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Modal background
bg - gray - 50; // Transaction row background
bg - green - 100; // Positive transaction background
bg - red - 100; // Negative transaction background

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text
text - green - 600; // Positive amount
text - red - 600; // Negative amount
text - gray - 500; // Transaction date

// Border Colors
border - gray - 200; // Modal border
border - gray - 100; // Row dividers
border - b; // List item separators

// Shadow Effects
shadow - lg; // Modal shadow
divide - y; // List dividers
```

### State Variations

- Default:
  - Rows: bg-gray-50
  - Text: text-gray-900
- Transaction Types:
  - Deposit: bg-green-100, text-green-600
  - Withdrawal: bg-red-100, text-red-600
- Hover:
  - Rows: hover:bg-gray-100
- Focus: No specific focus states
- Disabled: No disabled states

### Brand Color Usage

- Transaction type indicators (green/red)
- Optional task completion references

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-gray-50        → bg-background-secondary
bg-green-100      → bg-feedback-success-subtle
bg-red-100        → bg-feedback-error-subtle

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-gray-500     → text-content-tertiary
text-green-600    → text-feedback-success
text-red-600      → text-feedback-error

// Borders
border-gray-200   → border-primary
border-gray-100   → border-secondary
divide-y         → border-divider
```

### Theme Considerations

- Light theme adjustments:
  - Maintain transaction type visibility
  - Ensure readable amounts
  - Consider softer feedback colors
- Dark theme adjustments:
  - Adjust transaction backgrounds
  - Maintain type distinction
  - Modify divider opacity
- Brand color handling:
  - Consistent transaction type indicators
  - Clear visual hierarchy

### Accessibility Notes

- Contrast requirements:
  - Transaction amounts: 4.5:1 minimum
  - Date and details: 4.5:1 minimum
  - Type indicators: 3:1 minimum
- Focus indicators:
  - Add keyboard navigation support
  - Implement row focus states
- Other considerations:
  - Multiple indicators for transaction types
  - Clear temporal organization
  - Screen reader friendly list structure

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Add proper list semantics
- [ ] Implement focus states
- [ ] Add keyboard navigation
- [ ] Test contrast in all themes
- [ ] Verify screen reader support
- [ ] Add transaction type icons
- [ ] Test list virtualization

## Additional Notes

- Consider adding transaction grouping by date
- Add sorting capabilities
- Consider adding search/filter functionality
- May need pagination for large transaction lists
- Consider adding transaction details expansion
