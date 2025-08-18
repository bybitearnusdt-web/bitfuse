# Mobile Responsive UI

This document describes the mobile-first responsive UI implementation for BITFUSE.

## Features

### Mobile Navigation
- **Hamburger Menu**: Below 1024px, the sidebar collapses into a slide-out drawer
- **Accessibility**: Full keyboard navigation with ESC key support and focus trapping
- **Touch Targets**: All interactive elements meet the 44x44px minimum touch target size

### Responsive Breakpoints
- **1024px and below**: Mobile navigation, touch-friendly buttons
- **768px and below**: Single-column layouts, mobile card views for tables
- **480px and below**: Extra mobile optimizations and reduced padding

### Layout Adaptations
- **KPI Cards**: Stack vertically in single column on mobile
- **Tables**: Transform into mobile card view with labeled fields
- **Forms**: Full-width inputs with proper touch target sizing
- **Modals**: Full-screen experience on mobile devices

## Implementation

### CSS Classes
The mobile responsive styles are implemented in `styles/mobile.css` with the following utility classes:

- `.responsive-grid`: Automatically becomes single-column on mobile
- `.mobile-form`: Applies mobile-friendly form styling
- `.mobile-button`: Ensures proper touch target sizing
- `.touch-target`: 44x44px minimum size for accessibility
- `.mobile-padding`: Optimized padding for small screens

### Accessibility Features
- ARIA attributes for drawer navigation
- Focus trapping within mobile drawer
- ESC key to close drawer
- Proper semantic markup with roles
- Screen reader support

### Components
- **MobileNavigation** (`lib/mobileNav.ts`): Utility class for accessibility features
- **ResponsiveTable** (`components/ui/responsive-table.tsx`): Table component with mobile card view
- **Enhanced Sidebar** (`components/layout/sidebar.tsx`): Mobile-aware navigation component

## Customization

### Breakpoints
To customize breakpoints, edit `styles/mobile.css`:

```css
/* Change mobile breakpoint from 1024px */
@media (max-width: your-breakpoint) {
  /* Mobile styles */
}
```

### Touch Targets
Minimum touch target size can be adjusted:

```css
.touch-target {
  min-height: 44px; /* Change this value */
  min-width: 44px;
}
```

### Responsive Tables
To make a table responsive, add the `responsive-table` class:

```tsx
<table className="responsive-table">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Column 1">Value 1</td>
      <td data-label="Column 2">Value 2</td>
    </tr>
  </tbody>
</table>
```

The `data-label` attributes are used to show field labels in the mobile card view.

## Testing

### Manual Testing
1. Resize browser to 375px width
2. Verify hamburger menu appears and functions
3. Test ESC key and backdrop click to close drawer
4. Verify cards stack vertically
5. Check touch target sizes are adequate

### Viewport Testing
Test at these key viewport sizes:
- 375px (iPhone SE)
- 390px (iPhone 12)
- 768px (iPad portrait)
- 1024px (iPad landscape)
- 1200px+ (Desktop)

## Browser Support
- Modern browsers with CSS Grid support
- iOS Safari 12+
- Chrome 57+
- Firefox 52+
- Edge 16+

## Performance
- Minimal CSS overhead (~2KB gzipped)
- No JavaScript dependencies beyond React
- Uses CSS transforms for smooth animations
- Leverages hardware acceleration where possible