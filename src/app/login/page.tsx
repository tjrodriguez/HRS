import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default function LoginPage() {
  const login = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      redirect('/login?message=Could not authenticate user')
    }

    redirect('/')
  }

  const signup = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      redirect('/login?message=Could not sign up user')
    }

    redirect('/login?message=Check email to continue sign in process')
  }

  return (
    <div className="flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-8 mx-auto">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button
          formAction={login}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
        >
          Sign In
        </button>
        <button
          formAction={signup}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}
