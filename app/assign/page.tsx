'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import RolesManager from '@/components/roles/RolesManager'
import { Settings } from 'lucide-react'

export default function AssignPage() {
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
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-emerald-400/40">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                Assign Permissions
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Connect roles to permissions in a visual matrix view.
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs">
            See exactly which capabilities each role grants and adjust with a single click.
          </p>
        </section>

        <section className="glass-card rounded-3xl p-6 sm:p-8">
          <RolesManager showAssignMode />
        </section>
      </main>
    </div>
  )
}

