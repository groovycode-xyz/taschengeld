# Component Color Audit Template

## Purpose

This audit documents the current color usage in the MainLayout component and outlines required changes for the new color system.

## Component Information

- **Component Name**: MainLayout
- **File Location**: components/main-layout.tsx
- **Type**: Core Layout
- **Has Theme Variants**: No
- **Uses Brand Colors**: No

## Current Color Usage

### Direct Color Values

```tsx
// Background Colors
bg - white; // Default background
bg - [#FFEAC5]; // Custom background (when passed via className)
bg - black; // Used in home page via className override

// Layout Properties
flex - 1; // No direct colors, but affects layout containment
overflow - auto; // No direct colors, but affects content display
p - 8; // No direct colors, but affects spacing
```

### State Variations

- Default:
  - Background: bg-white
- Custom:
  - Backgrounds passed via className prop
- No hover, active, disabled, or focus states (container element)

### Brand Color Usage

None directly in component, but accepts custom backgrounds via className

## Required Changes

### Semantic Token Mapping

```tsx
// Background
bg-white          → bg-background-primary
bg-[#FFEAC5]      → bg-background-custom (new token needed)
bg-black          → bg-background-dark (new token needed)

// Consider adding semantic background variations for different interface types:
bg-interface-task      // For task-related pages
bg-interface-piggy     // For piggy bank interface
bg-interface-settings  // For settings pages
```

### Theme Considerations

- Light theme adjustments:
  - Define default background color
  - Create semantic tokens for interface-specific backgrounds
  - Consider subtle patterns or gradients
- Dark theme adjustments:
  - Ensure proper contrast with content
  - Maintain visual hierarchy
  - Consider reducing intensity of custom backgrounds
- Brand color handling:
  - Create system for interface-specific background colors
  - Maintain consistency across themes

### Accessibility Notes

- Contrast requirements:
  - Ensure sufficient contrast with content elements
  - Maintain readability of text elements
  - Consider users with visual sensitivity
- Focus indicators:
  - N/A (container element)
- Other considerations:
  - Ensure background colors don't interfere with content visibility
  - Consider color preferences in system settings
  - Test with different content types

## Implementation Checklist

- [ ] Replace direct background colors with semantic tokens
- [ ] Create new semantic tokens for interface-specific backgrounds
- [ ] Implement theme variant support
- [ ] Test with different content types
- [ ] Verify accessibility with various background colors
- [ ] Document usage guidelines for className overrides
- [ ] Test color transitions between routes
- [ ] Verify nested component contrast

## Additional Notes

- Consider adding subtle transitions for background color changes
- May need to implement a background hierarchy system
- Consider adding support for background patterns/textures
- Document guidelines for custom background usage
- Consider adding color scheme detection support
