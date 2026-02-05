'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { LogIn, UserPlus, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim()) && email.length <= 255
}

function passwordRequirements(password: string) {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  }
}

function passwordStrength(password: string): number {
  if (!password) return 0
  const { minLength, uppercase, lowercase, number } = passwordRequirements(password)
  return [minLength, uppercase, lowercase, number].filter(Boolean).length
}

/** Bar fill color by strength (0–4): weak → strong */
function strengthBarColor(strength: number): string {
  switch (strength) {
    case 0:
      return 'bg-red-500'
    case 1:
      return 'bg-red-400'
    case 2:
      return 'bg-orange-500'
    case 3:
      return 'bg-amber-500'
    case 4:
      return 'bg-emerald-500'
    default:
      return 'bg-neutral-500'
  }
}

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const emailValid = useMemo(() => (email.trim() ? validateEmail(email) : true), [email])
  const req = useMemo(() => passwordRequirements(password), [password])
  const strength = useMemo(() => passwordStrength(password), [password])
  const signupValid = useMemo(
    () => emailValid && req.minLength && req.uppercase && req.lowercase && req.number,
    [emailValid, req]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLogin) {
      if (!validateEmail(email)) {
        toast({ title: 'Invalid email', description: 'Please enter a valid email address.', variant: 'destructive' })
        return
      }
      if (!req.minLength || !req.uppercase || !req.lowercase || !req.number) {
        toast({
          title: 'Password too weak',
          description: 'Use at least 8 characters with uppercase, lowercase, and a number.',
          variant: 'destructive',
        })
        return
      }
    }

    setLoading(true)
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await response.json()

      if (!response.ok) {
        const msg = data.details
          ? Object.values(data.details).flat().join(' ')
          : data.error || 'Something went wrong'
        throw new Error(msg)
      }

      if (isLogin) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast({ title: 'Success!', description: 'Logged in successfully' })
        router.push('/dashboard')
      } else {
        toast({ title: 'Account created!', description: 'Please log in with your credentials' })
        setIsLogin(true)
        setPassword('')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-2xl border-orange-500/20 bg-neutral-900/50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center text-white">
          RBAC Management
        </CardTitle>
        <CardDescription className="text-center text-neutral-400">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-neutral-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`bg-neutral-800/80 border-orange-500/20 text-white placeholder:text-neutral-500 focus-visible:ring-orange-500 ${!isLogin && email.trim() && !emailValid ? 'border-red-500/50 focus-visible:ring-red-500' : ''
                }`}
              required
              maxLength={255}
            />
            {!isLogin && email.trim() && !emailValid && (
              <p className="text-xs text-red-400">Enter a valid email address.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-neutral-300">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder={isLogin ? '••••••••' : 'Min 8 chars, 1 uppercase, 1 number'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-800/80 border-orange-500/20 text-white placeholder:text-neutral-500 focus-visible:ring-orange-500"
              required
              minLength={isLogin ? 6 : 8}
            />
            {!isLogin && (
              <>
                <div className="space-y-1.5">
                  <div className="h-2.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300 ease-out',
                        strengthBarColor(strength)
                      )}
                      style={{ width: `${(strength / 4) * 100}%`, minWidth: password ? 4 : 0 }}
                    />
                  </div>
                  
                </div>
               
              </>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-lg lava-glow-sm disabled:opacity-70"
            disabled={loading || (!isLogin && !signupValid)}
          >
            {isLogin ? (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </>
            )}
          </Button>
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setPassword('')
              }}
              className="text-orange-400 hover:text-orange-300 hover:underline"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function Requirement({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 ${met ? 'text-emerald-400' : 'text-neutral-500'}`}>
      {met ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
      {label}
    </li>
  )
}
