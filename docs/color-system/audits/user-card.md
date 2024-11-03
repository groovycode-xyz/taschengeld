# Component Color Audit Template

## Purpose

This audit documents the current color usage in the UserCard component of the User Management interface.

## Component Information

- **Component Name**: UserCard
- **File Location**: components/user-management/user-card.tsx
- **Type**: UI Component
- **Has Theme Variants**: No
- **Uses Brand Colors**: Yes (User identification colors)

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - gray - 50 / 80; // Card background
backdrop - blur - sm; // Background effect
bg - green - 100; // Role indicator background (parent)
bg - blue - 100; // Role indicator background (child)

// Text Colors
text - gray - 900; // User name
text - gray - 600; // Secondary information
text - green - 600; // Parent role text
text - blue - 600; // Child role text

// Border Colors
border - gray - 200; // Card border
hover: border - gray - 300; // Card hover border

// Shadow Effects
shadow - sm; // Default shadow
hover: shadow - md; // Hover shadow state
```

### State Variations

- Default:
  - Card: bg-gray-50/80, border-gray-200, shadow-sm
  - Text: text-gray-900 (name), text-gray-600 (info)
- Hover:
  - Border: hover:border-gray-300
  - Shadow: hover:shadow-md
- Active: No specific active state
- Focus: No focus state defined
- Disabled: No disabled state

### Brand Color Usage

- Role-specific colors (parent/child indicators)
- User avatar background colors

## Required Changes

### Semantic Token Mapping

```tsx
// Backgrounds
bg-gray-50/80     → bg-background-secondary
bg-green-100      → bg-role-parent
bg-blue-100       → bg-role-child

// Text
text-gray-900     → text-content-primary
text-gray-600     → text-content-secondary
text-green-600    → text-role-parent
text-blue-600     → text-role-child

// Borders & Effects
border-gray-200   → border-primary
border-gray-300   → border-secondary
shadow-sm        → shadow-base
shadow-md        → shadow-elevated
```

### Theme Considerations

- Light theme adjustments:
  - Maintain role distinction
  - Ensure readable user information
  - Consider softer role indicators
- Dark theme adjustments:
  - Adjust card background opacity
  - Modify role indicator colors
  - Ensure avatar visibility
- Brand color handling:
  - Create consistent role color system
  - Maintain accessibility in all themes

### Accessibility Notes

- Contrast requirements:
  - User name: 4.5:1 minimum
  - Role indicators: 3:1 minimum
  - Secondary info: 4.5:1 minimum
- Focus indicators:
  - Add visible focus state
  - Implement focus ring
  - Support keyboard navigation
- Other considerations:
  - Role indication not solely dependent on color
  - Clear user identification
  - Readable information hierarchy

## Implementation Checklist

- [ ] Replace background colors with semantic tokens
- [ ] Update text colors with semantic tokens
- [ ] Update border colors with semantic tokens
- [ ] Add proper focus states
- [ ] Implement hover transitions
- [ ] Update role indicators
- [ ] Test contrast in all themes
- [ ] Add keyboard navigation
- [ ] Verify screen reader support
- [ ] Test with different avatar colors

## Additional Notes

- Consider adding selection state
- Evaluate click/tap target size
- Consider adding loading skeleton
- May need aria-labels for roles
- Consider adding tooltips for additional info
