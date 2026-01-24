'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'

/**
 * Login / Signup Page
 * Shows the authentication form with a soft, colorful background.
 */
export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full glass-card rounded-3xl p-6 sm:p-8 animate-fade-in-up">
        <LoginForm />
      </div>
    </main>
  )
}

