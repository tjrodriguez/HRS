---
name: front-end
description: 'Guidelines and procedures for developing the front-end of the application. Use when building React components, styling with Tailwind CSS, or implementing Next.js client-side features.'
---

# Front-End Development Guidelines

## When to Use This Skill
- Constructing or modifying React components in Next.js.
- Implementing Client Components (using `"use client"`).
- Styling interfaces using Tailwind CSS.
- Fetching data from the client side.

## Core Principles

1. **Default to Server Components:** In the Next.js App Router, all components are Server Components by default. Only use `"use client"` when you need browser APIs, interactivity (e.g., `useState`, `onClick`), or context.
2. **Component Composition:** Keep components small, modular, and focused on a single responsibility.
3. **Styling:** Use Tailwind CSS utility classes. Avoid inline styles or custom CSS files unless strictly necessary.
4. **Data Fetching:** Prefer fetching data on the server. If client fetching is needed, use tools like SWR or React Query, or the `createClient` from `@/utils/supabase/client`.

## Procedures

### Creating a New Component
1. Decide if it strictly requires client-side interactivity. If not, omit the `"use client"` directive.
2. Place reusable components in a `src/components/` directory.
3. Keep the file name PascalCase (e.g., `Button.tsx`).
4. Ensure TypeScript interfaces are defined for all props.

### Integrating Supabase on the Client
- When a user interaction requires a database query:
  ```tsx
  "use client"
  import { createClient } from '@/utils/supabase/client'
  // ...
  const supabase = createClient()
  // supabase.from('table').select()
  ```