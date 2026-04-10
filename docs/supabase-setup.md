# Supabase Integration Overview

This project uses the modern `@supabase/ssr` library, which allows seamless integration of Supabase authentication with the Next.js App Router (Server Components, Server Actions, and Route Handlers) while handling secure cookie storage.

## Folder Structure

The Supabase clients are centrally initialized in the `src/utils/supabase/` folder to provide robust and environment-aware client instances.

- **`client.ts`**: Returns a Supabase client instantiated for the browser. It should be used exclusively inside Client Components (files with the `"use client"` directive).
- **`server.ts`**: Returns a Supabase client configured for Next.js Server Components, Server Actions, and Route Handlers. It automatically accesses `cookieStore` to append the user session securely.
- **`middleware.ts`**: Provides helper functions exported specifically for Next.js middleware / proxy routing to refresh expired access tokens automatically in the background on arbitrary requests.

## How to use the clients

### 1. In a Client Component

If you need to subscribe to Realtime events or fetch data immediately on button clicks without Server Actions, you can do:

```tsx
"use client"
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function ClientData() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    const fetchIt = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('my_table').select()
      setData(data)
    }
    fetchIt()
  }, [])
  
  // ...
}
```

### 2. In Server Components (and Server Actions)

Directly import `createClient` from the `/server.ts` location. Since cookies must be accessed asynchronously in newer Next.js versions, the initialization needs `await`.

```tsx
import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return <p>Hello {user?.email}</p>
}
```
