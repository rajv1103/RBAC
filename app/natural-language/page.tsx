'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
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
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-10 space-y-8 animate-fade-in-up">
        <section className="glass-card rounded-3xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-amber-400/40">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                Natural Language
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Describe changes in English and let the engine translate them into RBAC actions.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs">
            Perfect for demoing complex security changes to non‑technical teammates.
          </p>
        </section>

        <section className="glass-card rounded-3xl p-6 sm:p-8">
          <NaturalLanguageConfig />
        </section>
      </main>
    </div>
  )
}

