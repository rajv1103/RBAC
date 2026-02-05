'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/natural-language/dashboard/DashboardHeader'
import NaturalLanguageConfig from '@/components/natural-language/NaturalLanguageConfig'
import { Sparkles } from 'lucide-react'

export default function NaturalLanguagePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null
    if (!token) {
      router.push('/login')
    }
  }, [router])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen app-gradient-bg">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-10 space-y-8 animate-fade-in-up">
        <section className="glass-card rounded-3xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg lava-glow-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Natural Language
              </h1>
            </div>
          </div>
        </section>

        <section className="glass-card rounded-3xl p-6 sm:p-8">
          <NaturalLanguageConfig />
        </section>
      </main>
    </div>
  )
}

