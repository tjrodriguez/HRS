---
name: ui-ux
description: 'Design principles and user experience guidelines. Use to ensure accessibility, responsiveness, consistent design language, and intuitive user interfaces.'
---

# UI/UX & Design Guidelines

## When to Use This Skill
- Designing new pages, forms, or views.
- Adjusting spacing, typography, and color schemes via Tailwind.
- Auditing components for accessibility (a11y) and responsive design issues.
- Improving layout semantics (grid, flexbox).

## Core Principles

1. **Accessibility First (A11y)**: Ensure all interactive elements have proper `aria-` labels or semantic HTML tags (e.g., `<button>` over `<div onClick>`). Maintain high contrast ratios for text.
2. **Mobile First Design**: Start by styling the layout for mobile devices using default Tailwind classes. Build up for larger screens using `sm:`, `md:`, `lg:`, and `xl:`.
3. **Consistency**: Retain the same padding, border radii, colors, and font scales across components. Use CSS variables or Tailwind configured themes.
4. **State Feedback**: Provide immediate visual feedback for loading states (`aria-busy`), hover states (`hover:` classes), and active/disabled states.

## Procedures

### Creating a Loading State
When writing interfaces that fetch data on the client side or invoke a server action, always implement a loading indicator:
- Provide Skeleton loaders for content placeholders.
- Gray out submit buttons or replace them with an activity spinner when a Server Action is processing (`useFormStatus` from `react-dom`).

### Responsive Layouts
- **Containers**: Use `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` to govern widths.
- **Grids**: Use `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` to adapt naturally.
- **Flexbox**: Generally use `flex flex-col md:flex-row` for stacked elements on mobile that should be side-by-side on desktop.
