# Design System Documentation

## Overview

The HolidayBoost design system is defined in [src/app/globals.css](../src/app/globals.css). It contains all global CSS, including:
- Tailwind imports and theme customization
- CSS custom properties for colors, spacing, typography, shadows
- Light and dark mode theme definitions
- Base layer element styles
- Typography utilities and semantic classes

## CSS Variables Organization

### Colors (in `:root` and `.dark`)

- **--background**: Page background
- **--foreground**: Primary text color
- **--card**: Card component background
- **--card-foreground**: Text on cards
- **--primary**: Primary action color (blue)
- **--primary-foreground**: Text on primary buttons
- **--secondary**: Secondary color (muted blue)
- **--secondary-foreground**: Text on secondary elements
- **--accent**: Accent color (purple)
- **--accent-foreground**: Text on accents
- **--muted**: Subtle backgrounds
- **--muted-foreground**: Subtle text color
- **--destructive**: Error/danger color
- **--destructive-foreground**: Text on destructive elements
- **--border**: UI element borders
- **--input**: Input field color
- **--ring**: Focus ring color
- **--success**: Success indicator color
- **--info**: Information indicator color
- **--warning**: Warning indicator color
- **--sidebar-***: Sidebar-specific color variants
- **--chart-1 to --chart-5**: Data visualization colors

### Spacing (`--spacing-*`)

| Variable | Value | Pixels |
|----------|-------|--------|
| `--spacing-xs` | 0.25rem | 4px |
| `--spacing-sm` | 0.5rem | 8px |
| `--spacing-md` | 1rem | 16px |
| `--spacing-lg` | 1.5rem | 24px |
| `--spacing-xl` | 2rem | 32px |
| `--spacing-2xl` | 2.5rem | 40px |
| `--spacing-3xl` | 3rem | 48px |
| `--spacing-4xl` | 4rem | 64px |

### Border Radius (`--radius-*`)

| Variable | Value | Pixels |
|----------|-------|--------|
| `--radius-none` | 0 | 0px |
| `--radius-sm` | 0.375rem | 6px |
| `--radius-md` | 0.5rem | 8px |
| `--radius-lg` | 0.75rem | 12px |
| `--radius-xl` | 1rem | 16px |
| `--radius-2xl` | 1.5rem | 24px |
| `--radius-3xl` | 2rem | 32px |
| `--radius-full` | 9999px | Rounded circles |

### Shadows (`--shadow-*`)

Used for elevation and depth. Increases from `xs` to `2xl`.

- `--shadow-none`: No shadow
- `--shadow-xs`: Subtle shadow (1px offset)
- `--shadow-sm`: Small shadow (3px offset)
- `--shadow-md`: Medium shadow (6px offset)
- `--shadow-lg`: Large shadow (15px offset)
- `--shadow-xl`: Extra large shadow (25px offset)
- `--shadow-2xl`: Maximum shadow (50px offset)

### Max Width (`--max-width-*`)

| Variable | Value | Pixels |
|----------|-------|--------|
| `--max-width-sm` | 24rem | 384px |
| `--max-width-md` | 28rem | 448px |
| `--max-width-lg` | 32rem | 512px |
| `--max-width-xl` | 36rem | 576px |
| `--max-width-2xl` | 42rem | 672px |

## Typography Classes

### Heading Scales

- **h1-h6**: Semantic heading elements with responsive scaling
- **.h1 to .h6**: Utility classes matching heading styles (use when semantic HTML not available)

### Body Text

- **.text-body-lg**: Large body text (18px)
- **.text-body-md**: Regular body text (16px) — Default
- **.text-body-sm**: Small body text (14px)
- **.text-body-xs**: Extra small body text (12px)

All body text uses consistent line-height for readability.

### Text Utilities

- **.text-subtle**: Uses muted-foreground color for secondary text
- **.text-emphasized**: Bold foreground color for emphasis
- **.text-strong**: Extra bold foreground color for strong emphasis

## Component Classes

### Card Base

- **.card-base**: Pre-styled card with:
  - Rounded corners (`border-radius: var(--radius)`)
  - Border color (`border-border`)
  - Background color (`bg-card`)
  - Shadow for elevation (`shadow-md`)
  - Smooth transitions for interactive states

**Usage:**
```html
<div class="card-base p-4">
  <p>Card content</p>
</div>
```

## Color System Philosophy

The design system uses perceptually uniform colors designed for accessibility and visual harmony.

### Color Space: OKLch

- **O**: Oklch color space for perceptually uniform colors
- **K**: Perceptual lightness (0-1)
- **L**: Chroma/saturation (0-0.37)
- **C**: Hue angle (0-360°)

Benefits:
- Colors maintain consistent perceived brightness across hues
- Better accessibility for color-blind users
- More predictable and maintainable color tokens

### Light Mode

- White/off-white backgrounds for high contrast
- WCAG AAA compliant contrast ratios (4.5:1+)
- Vibrant primary colors for CTAs
- Muted secondary colors for supporting UI

### Dark Mode

- Dark gray/charcoal backgrounds
- WCAG AA compliant contrast ratios (4.5:1+)
- Lighter primary colors adapted for dark backgrounds
- Increased color brightness for readability

### Chart Colors

Five harmonious colors with broad perceptual separation:
1. **Chart-1**: Warm amber for positive/first data series
2. **Chart-2**: Warm red for alerts/second series
3. **Chart-3**: Purple for mixed/third series
4. **Chart-4**: Teal for cool-toned/fourth series
5. **Chart-5**: Violet for contrast/fifth series

Accessible in both light and dark modes.

## Using the Design System

### In Components

```tsx
// Use Tailwind classes with design system colors
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Action Button
</button>

// Semantic text colors
<p className="text-body-md text-foreground">Main text</p>
<p className="text-body-sm text-muted-foreground">Secondary text</p>

// With responsive sizing
<h1 className="h1">Large Heading</h1>
<p className="text-body-lg md:text-body-md">Responsive text</p>
```

### CSS Variables in Custom CSS

```css
/* Reference design tokens directly */
.custom-component {
  background-color: var(--card);
  border-color: var(--border);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

### Dark Mode Support

The system automatically handles dark mode via the `.dark` class on the root element.

```tsx
// Automatically uses dark-mode colors when needed
<p className="text-foreground">Text adapts automatically</p>
```

## Best Practices

1. **Always use semantic color variables** instead of hardcoded hex values
2. **Prefer Tailwind utilities** over writing custom CSS when possible
3. **Use responsive text sizes** (e.g., `text-body-md md:text-body-lg`)
4. **Follow spacing scale** (use `--spacing-*` values, not arbitrary values)
5. **Leverage card-base class** for consistent card styling
6. **Test contrast ratios** for text on custom backgrounds
7. **Use chart colors** for data visualizations to ensure consistency
8. **Respect dark mode** by avoiding hardcoded light colors

## Maintenance

- All design tokens are centralized in [src/app/globals.css](../src/app/globals.css)
- Updates to tokens automatically propagate across the entire application
- No need to modify individual component files when updating the design system
- Use Tailwind's developer tools to inspect active tokens at runtime

**Last Updated:** April 11, 2026  
**Maintained By:** HolidayBoost Team
