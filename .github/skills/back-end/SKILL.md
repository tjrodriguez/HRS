---
name: back-end
description: 'Rules and procedures for the Next.js server infrastructure, including Server Components, Server Actions, Route Handlers, Database integrations, and Authentication flows using Supabase.'
---

# Back-End Guidelines (Next.js + Supabase)

## When to Use This Skill
- Working with Next.js App Router API routes (`route.ts`).
- Implementing `Server Actions` for form submissions or API logic.
- Reading data inside `Server Components`.
- Using `@supabase/ssr` to perform queries inside Server Actions, Middleware (`proxy.ts`), or Route handlers.
- Configuring environment variables.

## Core Principles

1. **Security First:** Never trust the client. Validate all incoming data.
2. **Prefer Server Actions:** Use Next.js Server Actions over standard API endpoints to mutate data wherever possible.
3. **Database Initialization:** Always use the appropriate server initialization function `createClient()` from `@/utils/supabase/server` when fetching data to ensure proper parsing of HTTP cookies.
4. **Environment Variables:** Add `NEXT_PUBLIC_` specifically to variables that are required on the client side. Any secure secrets should NOT have a prefix.

## Common Operations

### Read Data (Server Component)

```tsx
import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('my_table').select()
}
```

### Mutate Data (Server Action)

```tsx
"use server"
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function mutateAction(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('my_table').insert({ name: formData.get('name') })
  if (!error) revalidatePath('/')
}
```