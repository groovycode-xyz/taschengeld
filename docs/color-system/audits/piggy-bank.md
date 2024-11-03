# Component Color Audit Template

## Purpose

This audit documents the current color usage in the Piggy Bank interface and outlines required changes for the new color system.

## Component Information

- **Component Name**: Piggy Bank Interface
- **File Location**: components/piggy-bank.tsx
- **Type**: Primary Interface
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (User-related colors)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Main container background
bg - gray - 50; // Account card background
bg - blue - 500; // Balance indicator
bg - green - 500; // Positive transaction
bg - red - 500; // Negative transaction

// Text Colors
text - gray - 900; // Primary text
text - gray - 600; // Secondary text
text - white; // Text on colored backgrounds
text - green - 600; // Positive amounts
text - red - 600; // Negative amounts

// Border Colors
border - gray - 200; // Card borders
border - gray - 100; // Dividers

// Shadow Effects
shadow - lg; // Card shadows
shadow - sm; // Minor elevation
```

### State Variations

- Default:
  - Cards: bg-white, border-gray-200
  - Text: text-gray-900
- Hover:
  - Cards: hover:shadow-xl
- Active: No specific active states
- Disabled: opacity-50
- Focus: No specific focus states

### Brand Color Usage

- User identification colors in account cards
- Transaction type indicators

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-white          → bg-background-primary
bg-gray-50        → bg-background-secondary
bg-blue-500       → bg-brand-piggy
bg-green-500      → bg-feedback-success
bg-red-500        → bg-feedback-error

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-white        → text-content-inverse
text-green-600    → text-feedback-success
text-red-600      → text-feedback-error

// Borders
border-gray-200   → border-primary
border-gray-100   → border-secondary
```

### Theme Considerations

- Light theme adjustments:
  - Consider softer feedback colors
  - Maintain clear transaction type distinction
  - Ensure readable balance displays
- Dark theme adjustments:
  - Adjust card contrasts
  - Modify shadow effects
  - Ensure transaction colors are visible
- Brand color handling:
  - Maintain user color associations
  - Ensure feedback colors work in all themes

### Accessibility Notes

- Contrast requirements:
  - Balance amounts: 4.5:1 minimum
  - Transaction amounts: 4.5:1 minimum
  - User identification: 3:1 minimum
- Focus indicators:
  - Add visible focus states for interactive elements
  - Implement focus rings for buttons and cards
- Other considerations:
  - Ensure color is not sole indicator of transaction type
  - Maintain readability of financial information
  - Consider colorblind users

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Add missing interaction states
- [ ] Implement theme variant support
- [ ] Add focus indicators
- [ ] Test contrast ratios in all themes
- [ ] Verify financial information clarity
- [ ] Test with screen readers
- [ ] Verify transaction type indicators

## Additional Notes

- Consider adding icons to reinforce transaction types
- Evaluate animation needs for balance updates
- Consider adding hover states for transaction items
- May need special handling for large numbers
- Consider adding loading states for async operations
