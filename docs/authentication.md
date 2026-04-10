# Authentication Flow

This document details how the Server Actions and the Proxy system collaborate to provide a complete Auth ecosystem using `@supabase/ssr`.

## Middlewares with `src/proxy.ts`

To keep sessions active natively and protect certain routes from being shown briefly before redirecting to `/login`, we leverage `src/proxy.ts` combined with `src/utils/supabase/middleware.ts`.

It runs on almost every request (using an exclude `matcher`) and evaluates:
1. `supabase.auth.getUser()`: Verifies if a user's session is active, refreshing expired tokens.
2. Checks Route Permissions: It strictly forces unauthenticated users specifically away from protected components to the `/login` route. Conversely, unauthenticated routes like `/auth` remain unlocked.

## Logging in and Signing up (Server Actions)

We interact with the database completely on the server via Server Actions.

Location: `src/app/login/page.tsx`

By specifying `<form action={login}>`, where `login` is a string marked `"use server"`, we sidestep creating distinct API endpoints for user handling, streamlining the boilerplate.

### Server Action Example (`signInWithPassword`)
We retrieve `email` and `password` natively via standard DOM `FormData`. We instantiate a `createServerClient` ensuring sessions get stamped directly to the response's cookies.

```typescript
const login = async (formData: FormData) => {
  'use server'
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
}
```

### Sign Out Process
In `src/app/page.tsx`, we defined a similar server action bound to the "Sign out" button:

```typescript
const signOut = async () => {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/login')
}
```
This forces the server to destroy the session cookie entirely and issues a safe redirect away from the protected root path back to `/login`.
