import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error('Sign up error:', error)
      redirect(`/login?message=${encodeURIComponent(error.message)}`)
    }

    if (data?.user && data.user.identities?.length === 0) {
        redirect('/login?message=Email already registered. Try signing in.')
    }

    redirect('/login?message=Check email to continue sign in process')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 flex items-center justify-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <CalendarDays className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Smart Holiday Reminder
        </h1>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            {searchParams?.message && (
              <Alert variant={searchParams.message.includes('Check email') ? 'default' : 'destructive'} className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{searchParams.message}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2 mt-4">
              <button formAction={login} className={cn(buttonVariants({ variant: 'default' }), "w-full")}>
                Sign In
              </button>
              <button formAction={signup} className={cn(buttonVariants({ variant: 'outline' }), "w-full")}>
                Sign Up
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Empower your business with AI-generated marketing campaigns
      </p>
    </div>
  )
}

