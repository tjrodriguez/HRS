 'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/components/notifications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, User, Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface CreateAccountFormProps {
  onSignup: (email: string, password: string) => Promise<{ error?: string; success?: boolean }>
}

export default function CreateAccountForm({ onSignup }: CreateAccountFormProps): React.ReactElement {
  const { addNotification } = useNotification()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Full name is required')
      return false
    }
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setAlert({ type: 'error', message: 'Passwords do not match. Please check and try again.' })
      setLoading(false)
      return false
    }

    // Clear previous alerts
    setAlert(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Call server action
      const result = await onSignup(formData.email, formData.password)

      if (result.error) {
        setAlert({ type: 'error', message: result.error })
        addNotification(result.error, 'error')
      } else if (result.success) {
        setAlert({ type: 'success', message: 'Account created successfully! Redirecting to login...' })
        addNotification('Account created successfully!', 'success')
        setTimeout(() => {
          router.push('/login?message=Account created successfully. Please sign in.')
        }, 2000)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account. Please try again.'
      setError(errorMessage)
      addNotification(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-1 mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Create Account</h1>
        <p className="text-muted-foreground">Join HolidayBoost to start automating your holiday marketing</p>
      </div>

      <CardContent className="space-y-6">
        {/* Alert Notifications */}
        {alert && (
          <Alert
            variant={alert.type === 'success' ? 'default' : 'destructive'}
            className={`animate-in slide-in-from-top-2 duration-300 border ${
              alert.type === 'success'
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-destructive/10 border-destructive/30 text-destructive'
            }`}
          >
            {alert.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription className="ml-2 font-medium text-sm">{alert.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Full Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
                required
                aria-required="true"
                aria-label="Full name"
                className="pl-10"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                required
                aria-required="true"
                aria-label="Email address"
                className="pl-10"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                required
                aria-required="true"
                aria-label="Password"
                className="pl-10 pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                required
                aria-required="true"
                aria-label="Confirm password"
                className="pl-10 pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="terms"
              required
              aria-required="true"
              className="mt-1"
            />
            <Label
              htmlFor="terms"
              className="text-sm font-normal text-muted-foreground leading-relaxed cursor-pointer"
            >
              I agree to the{' '}
              <a href="#" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Privacy Policy
              </a>
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-primary hover:bg-primary-dark text-primary-foreground"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          {/* Sign In Link */}
          <div className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </div>
  )
}
