import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarDays, Apple, ArrowRight, AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'Sign In - HolidayBoost',
  description: 'Sign in to your HolidayBoost account to manage your holiday marketing campaigns',
}

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }) {
  const searchParams = await props.searchParams

  const login = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const rememberMe = formData.get('rememberMe') === 'on'
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      redirect(`/login?message=${encodeURIComponent(error.message || 'Could not authenticate user')}`)
    }

    redirect('/')
  }

  const createAccount = async (email: string, password: string, name: string) => {
    'use server'

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return { error: error.message || 'Failed to create account' }
    }

    if (data?.user && data.user.identities?.length === 0) {
      return { error: 'Email already registered. Try signing in instead.' }
    }

    return { success: true }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full mix-blend-overlay filter blur-[120px] opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/20 rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none"></div>

      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 relative z-10 order-2 lg:order-1">
        <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
          <CardHeader className="space-y-3 relative z-10 p-6 sm:p-8 pb-4">
            <div className="lg:hidden flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-secondary to-accent shadow-md border border-white/20">
                <CalendarDays className="h-5 w-5 text-white drop-shadow-sm" />
              </div>
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">HolidayBoost</h1>
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-sm sm:text-base text-muted-foreground">
              Sign in to access your holiday marketing schedule
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 p-6 sm:p-8 pt-4 space-y-6">
            {/* Error/Success Messages */}
            {searchParams?.message && (
              <Alert 
                variant={searchParams.message.includes('email') || searchParams.message.includes('Check') ? 'default' : 'destructive'} 
                className={`backdrop-blur border ${
                  searchParams.message.includes('email') || searchParams.message.includes('Check')
                    ? 'bg-accent/15 border-accent/30 text-accent'
                    : 'bg-destructive/15 border-destructive/30 text-destructive'
                }`}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2 font-medium text-sm">{searchParams.message}</AlertDescription>
              </Alert>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick access</p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  type="button"
                  variant="outline"
                  size="lg"
                  aria-label="Sign in with Google"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                  </svg>
                  <span className="hidden sm:inline ml-2">Google</span>
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  size="lg"
                  aria-label="Sign in with Apple"
                >
                  <Apple className="w-5 h-5" />
                  <span className="hidden sm:inline ml-2">Apple</span>
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground font-semibold">Or email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="email" className="text-foreground font-semibold text-sm">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  aria-required="true"
                  aria-describedby="email-error"
                  className="bg-background/60 border-white/20 focus-visible:ring-primary h-11 sm:h-12 text-base transition-all hover:bg-background/80 focus-visible:border-primary/50"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground font-semibold text-sm">Password</Label>
                  <a 
                    href="#forgot-password" 
                    className="text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded px-1"
                    aria-label="Forgot password"
                  >
                    Forgot?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  aria-required="true"
                  className="bg-background/60 border-white/20 focus-visible:ring-primary h-11 sm:h-12 text-base transition-all hover:bg-background/80 focus-visible:border-primary/50 pr-10"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3 px-1">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  aria-label="Remember me"
                />
                <Label 
                  htmlFor="rememberMe" 
                  className="text-sm font-medium text-muted-foreground cursor-pointer select-none"
                >
                  Keep me signed in
                </Label>
              </div>

              {/* Sign In Button */}
              <Button 
                type="submit"
                formAction={login} 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                size="lg"
                aria-label="Sign in to your account"
              >
                Sign In
              </Button>

            </form>

            {/* Sign Up */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <a 
                href="/signup" 
                className="text-primary font-semibold hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded px-1"
              >
                Create one
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Sneak Peek (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 relative flex-col justify-center items-center p-12 overflow-hidden order-2">
        <div className="w-full max-w-sm">
          {/* Sneak Peek Card */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-accent/10 mix-blend-overlay"></div>
            
            {/* Decorative elements */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/20 rounded-full mix-blend-overlay filter blur-3xl opacity-60"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/30 rounded-full mix-blend-overlay filter blur-3xl opacity-40"></div>
            
            <div className="relative p-8 backdrop-blur-md border border-white/20 rounded-3xl">
              <div className="space-y-6 z-10">
                {/* Header */}
                <div>
                  <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Your Schedule</p>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">Next Event</h3>
                </div>

                {/* Event Preview (Blurred) */}
                <div className="space-y-4 backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/20">
                  <div className="h-6 bg-white/20 rounded-full w-3/4 blur-sm"></div>
                  <div className="h-4 bg-white/15 rounded-full w-full blur-sm"></div>
                  <div className="h-4 bg-white/15 rounded-full w-2/3 blur-sm"></div>
                </div>

                {/* CTA */}
                <div className="pt-4 border-t border-white/20 space-y-3">
                  <p className="text-white/90 font-medium">Sign in to see your personalized holiday calendar and AI-generated content ideas.</p>
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <span>Unlock your schedule</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/80"></div>
                    <span className="text-xs font-medium text-white/90">7-day reminders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/80"></div>
                    <span className="text-xs font-medium text-white/90">AI-generated captions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/80"></div>
                    <span className="text-xs font-medium text-white/90">Performance tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/80"></div>
                    <span className="text-xs font-medium text-white/90">Multi-channel content</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
