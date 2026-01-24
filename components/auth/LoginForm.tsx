'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { LogIn, UserPlus } from 'lucide-react'

/**
 * Login Form Component
 * Handles user authentication and redirects to dashboard on success
 */
export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      if (isLogin) {
        // Store token and redirect
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast({
          title: 'Success!',
          description: 'Logged in successfully',
        })
        router.push('/dashboard')
      } else {
        toast({
          title: 'Account created!',
          description: 'Please log in with your credentials',
        })
        setIsLogin(true)
        setPassword('')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold text-center">
          RBAC Management
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
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
              className="text-primary hover:underline"
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
