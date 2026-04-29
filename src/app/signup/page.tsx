import * as React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CreateAccountForm from '@/components/auth/create-account-form'
import { CalendarDays, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'Create Account - HolidayBoost',
  description: 'Sign up for HolidayBoost to start automating your holiday marketing campaigns',
}

export default async function SignUpPage(props: { searchParams: Promise<{ message: string }> }): Promise<React.ReactElement> {
  const searchParams = await props.searchParams

  const handleSignup = async (email: string, password: string, name: string) => {
    'use server'

    const supabase = await createClient()

    // Attempt to sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return { error: error.message || 'Failed to create account' }
    }

    // Check if user already exists
    if (data?.user && data.user.identities?.length === 0) {
      return { error: 'Email already registered. Try signing in instead.' }
    }

    return { success: true }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background relative overflow-hidden">
      {/* Decorative background elements - using solid colors */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full" />
      </div>

      {/* Left side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 relative z-10 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <CreateAccountForm onSignup={handleSignup} />
        </div>
      </div>

      {/* Right side - Features (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden order-2 bg-muted/30">
        {/* Decorative elements - using solid colors */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/10 rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center justify-center p-12 max-w-xl mx-auto">
          <div className="text-center space-y-8">
            {/* Branding */}
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Marketing</span>
              </div>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-xl border border-white/20">
                  <CalendarDays className="h-8 w-8 text-primary-foreground font-bold" />
                </div>
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight">HolidayBoost</h1>
              </div>
              <p className="text-muted-foreground font-medium tracking-wide uppercase text-sm">Smart Holiday Marketing</p>
            </div>

            {/* Features */}
            <div className="space-y-6 z-10">
              <h2 className="text-4xl font-extrabold text-foreground leading-tight">Get Started Today</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Join thousands of small businesses automating their holiday marketing with AI-powered content.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-sm">Instant Content</h4>
                    <p className="text-xs text-muted-foreground">Generate captions in seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-sm">Brand Safe</h4>
                    <p className="text-xs text-muted-foreground">Consistent tone & messaging</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-sm">Grow Faster</h4>
                    <p className="text-xs text-muted-foreground">Never miss opportunities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-sm">AI-Powered</h4>
                    <p className="text-xs text-muted-foreground">Smart suggestions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/30">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">No credit card required.</span> Start your free trial instantly and see the difference AI can make in your holiday marketing strategy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
