import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CreateAccountForm from '@/components/auth/create-account-form'
import { CalendarDays } from 'lucide-react'

export const metadata = {
  title: 'Create Account - HolidayBoost',
  description: 'Sign up for HolidayBoost to start automating your holiday marketing campaigns',
}

export default async function SignUpPage(props: { searchParams: Promise<{ message: string }> }) {
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
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full mix-blend-overlay filter blur-[120px] opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/20 rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none"></div>

      {/* Left side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 relative z-10 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <CreateAccountForm onSignup={handleSignup} />
        </div>
      </div>

      {/* Right side - Features (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 relative flex-col justify-center items-center p-12 overflow-hidden order-2">
        <div className="w-full max-w-sm space-y-12">
          {/* Branding */}
          <div className="z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent shadow-xl border border-white/20">
                <CalendarDays className="h-8 w-8 text-white font-bold" />
              </div>
              <h1 className="text-4xl font-extrabold text-foreground tracking-tight">HolidayBoost</h1>
            </div>
            <p className="text-muted-foreground font-medium tracking-wide uppercase text-sm">Smart Holiday Marketing</p>
          </div>

          {/* Features */}
          <div className="space-y-10 z-10">
            <div>
              <h2 className="text-4xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">Get Started Today</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Join thousands of small businesses automating their holiday marketing with AI-powered content.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center flex-shrink-0 rounded-2xl bg-primary/20 backdrop-blur-md shadow-inner border border-primary/20">
                  <span className="text-primary font-bold text-xl">✓</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">7-Day Smart Reminders</p>
                  <p className="font-medium text-muted-foreground">Never miss a marketing opportunity</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center flex-shrink-0 rounded-2xl bg-secondary/20 backdrop-blur-md shadow-inner border border-secondary/20">
                  <span className="text-secondary font-bold text-xl">✓</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">AI-Generated Content</p>
                  <p className="font-medium text-muted-foreground">Ready-to-use social media & email copy</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center flex-shrink-0 rounded-2xl bg-accent/20 backdrop-blur-md shadow-inner border border-accent/20">
                  <span className="text-accent font-bold text-xl">✓</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">Performance Analytics</p>
                  <p className="font-medium text-muted-foreground">Track engagement across all holidays</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
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
