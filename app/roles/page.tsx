'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/natural-language/dashboard/DashboardHeader'
import RolesManager from '@/components/roles/RolesManager'
import { Users } from 'lucide-react'

export default function RolesPage() {
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
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Roles
              </h1>
              <p className="text-sm text-neutral-400">
                Structure your organization with clear, reusable access levels.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xs">
            Map your real‑world teams into roles that can be assigned to any user.
          </p>
        </section>

        <section className="glass-card rounded-3xl p-6 sm:p-8">
          <RolesManager />
        </section>
      </main>
    </div>
  )
}

