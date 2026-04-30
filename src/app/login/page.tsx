import * as React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
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
import { CalendarDays, ArrowRight, AlertCircle, Zap } from 'lucide-react'

export const metadata = {
  title: 'Sign In - HolidayBoost',
  description: 'Sign in to your HolidayBoost account to manage your holiday marketing campaigns',
}

export default async function LoginPage(props: { searchParams: Promise<{ message: string }> }): Promise<React.ReactElement> {
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
      redirect(`/login?message=${encodeURIComponent(error.message || 'Could not authenticate user')}`)
    }

    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <Card className="w-full max-w-md border-border/50 shadow-xl bg-card">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <CalendarDays className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-2xl font-bold text-foreground">
                  HolidayBoost
                </span>
                <p className="text-xs text-muted-foreground">AI-Powered Marketing</p>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Sign in to your account to manage your holiday campaigns
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 p-6 sm:p-8 pt-4 space-y-6">
            {/* Error/Success Messages */}
            {searchParams?.message && (
              <Alert 
                variant={searchParams.message.includes('success') || searchParams.message.includes('Check') ? 'default' : 'destructive'} 
                className={`animate-in slide-in-from-top-2 duration-300 border ${
                  searchParams.message.includes('success') || searchParams.message.includes('Check')
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-destructive/10 border-destructive/30 text-destructive'
                }`}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2 font-medium text-sm">{searchParams.message}</AlertDescription>
              </Alert>
            )}

            <form action={login} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground/80">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" name="rememberMe" className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none text-foreground/70 cursor-pointer hover:text-foreground transition-colors"
                  >
                    Remember me
                  </label>
                </div>
                <Link href="#" className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary-dark transition-all duration-300 shadow-lg font-semibold text-primary-foreground">
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            {/* Sign Up */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don&apos;t have an account? </span>
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

      {/* Right side - Features (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 relative flex-col justify-center items-center p-12 overflow-hidden order-2 bg-muted/30">
        <div className="w-full max-w-sm">
          {/* Feature Card */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-card border border-border">
            {/* Decorative elements */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full" />
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/10 rounded-full" />
            
            <div className="relative p-8">
              <div className="space-y-6 z-10">
                {/* Header */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Your Schedule</p>
                  <h3 className="text-3xl font-extrabold text-foreground tracking-tight">Next Event</h3>
                </div>

                {/* Event Preview (Placeholder) */}
                <div className="space-y-4 bg-muted rounded-2xl p-6 border border-border">
                  <div className="h-6 bg-muted-foreground/20 rounded-full w-3/4"></div>
                  <div className="h-4 bg-muted-foreground/15 rounded-full w-full"></div>
                  <div className="h-4 bg-muted-foreground/15 rounded-full w-2/3"></div>
                </div>

                {/* CTA */}
                <div className="pt-4 border-t border-border space-y-3">
                  <p className="text-foreground/90 font-medium">Sign in to see your personalized holiday calendar and AI-generated content ideas.</p>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <span>Unlock your schedule</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Features */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted border border-border">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-xs font-medium text-foreground">7-day reminders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <span className="text-xs font-medium text-foreground">AI-generated captions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span className="text-xs font-medium text-foreground">Performance tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-xs font-medium text-foreground">Multi-channel content</span>
                    </div>
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
