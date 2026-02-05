'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) router.push('/dashboard')
  }, [router])

  return (
    <main className="min-h-screen app-gradient-bg flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl animate-fire-spark" />
        <div className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-amber-600/15 blur-3xl animate-float-slow" />
      </div>
      <div className="relative z-10 max-w-md w-full glass-card rounded-3xl p-6 sm:p-8 animate-fade-in-up">
        <LoginForm />
      </div>
    </main>
  )
}
