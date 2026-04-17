---
name: debugging
description: 'Use when debugging errors, diagnosing broken UI, solving Supabase RLS or auth issues, investigating Server/Client component barriers, or fixing API route failures.'
---

# Debugging Guidelines

## When to Use This Skill
- Diagnosing server-side (Terminal) or client-side (Browser) errors in Next.js.
- Troubleshooting Supabase Row Level Security (RLS) policies returning empty data or unauthorized.
- Fixing hydration mismatches.
- Investigating API (Groq/Supabase) connection issues.
- Debugging unexpected redirects from the Next.js `proxy.ts`.

## Core Principles

1. **Isolate the Boundary**: Determine if the error is occurring on the server (terminal logs) or the client (browser console).
2. **Avoid Silent Failures**: Supabase often returns `{ data: null, error: details }`. Always `console.error` the `error` object before assuming success. Try to expose the error to the UI when developing.
3. **Check Auth State**: Next.js proxy redirects can often mask underlying page errors if the session context is invalid.
4. **Minimal Repro**: If a complex feature fails, isolate the logic natively.

## Common Scenarios & Procedures

### 1. Supabase Returning Empty Arrays or Null
- **Symptom**: Querying a table returns `[]` or `null` but records visually exist in the Supabase dashboard.
- **Fix**: Check your RLS (Row Level Security) policies in Supabase. By default, newly created tables deny all reads and writes. Ensure the policy allows `SELECT` for the authenticated user's ID (`auth.uid() = user_id`), or allow `anon` if the data is public.

### 2. Next.js Hydration Errors
- **Symptom**: "Text content did not match. Server: X Client: Y" in the browser console.
- **Fix**: Identify components using `window`, `document`, or `localStorage` during initial rendering. Wrap the logic in a `useEffect` hook, or dynamically import the offending component using `next/dynamic` with `{ ssr: false }`.

### 3. Server Components vs. Client Components Execution Context
- **Server Components**: Since they execute on the Next.js server, `console.log` statements print strictly to the **VS Code Terminal**. They cannot use hooks (`useState`, `useEffect`) or interact with the browser DOM.
- **Client Components**: Declared with `"use client"` at the top. Their `console.log` statements print to the **Browser Console**.

### 4. Diagnosing Build Errors
- Next.js requires strict types for dynamic routes `props`.
- Use `npm run build` locally to catch static generation errors (`Route Handlers`, `generateStaticParams`) before deploying. Watch the terminal output specifically.