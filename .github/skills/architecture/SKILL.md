---
name: architecture
description: 'High-level Architectural patterns, folder structure conventions, state management, and system design principles for Next.js.'
---

# Architecture & System Design

## When to Use This Skill
- Designing complex features, deciding on folder structure.
- Adopting and combining state management paradigms.
- Structuring APIs or Supabase schema interfaces.
- Assessing performance optimizations and refactoring codebase structures.

## Core Principles

1. **Folder Structure Convention**: Follow a strict domain-driven or feature-driven folder architecture. Group functions closely to where they are used.
   - `src/app/`: Only page routing, layout, `loading.tsx`, `error.tsx`
   - `src/components/`: Reusable, generic UI components (e.g., `Button.tsx`).
   - `src/features/`: Complex modules structured around business logic (e.g., `UserDashboard/`, `CheckoutFlow/`).
   - `src/utils/`: Generic helper functions, parsers, and client configurations (e.g., `supabase/`, `formatters.ts`).
2. **State Management**: Identify where state should live.
   - **URL/Search Params**: For sort, pagination, or shareable UI state.
   - **Local State** (`useState`, `useReducer`): UI toggles, text fields.
   - **Server State** (React Cache, Supabase fetch): Use React Server Components to load initial data without third-party state managers whenever possible.
3. **Data Fetching Patterns**: Use Parallel Fetching combined with `Promise.all` inside Server Components over sequential requests to reduce water-falling HTTP calls.
4. **Proxy/Middleware**: Keep it extremely lightweight. Avoid running DB queries from `proxy.ts`; rely on session claims/JWT expiration checks instead to prevent blocking resources unnecessarily.

## Review Process
Always check new designs to ensure they decouple the database layer adequately through server actions, isolating security to the Next.js server so clients only render templates.
