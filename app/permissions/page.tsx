'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/natural-language/dashboard/DashboardHeader'
import PermissionsManager from '@/components/permissions/PermissionsManager'
import { Shield, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function PermissionsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    setMounted(true)
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null
    if (!token) router.push('/login')
  }, [router])

  if (!mounted) return null

  return (
    <div className="min-h-screen app-gradient-bg">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-10 space-y-8 animate-fade-in-up">
        <section className="glass-card rounded-3xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg lava-glow-sm">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Permissions
              </h1>
              <p className="text-sm text-neutral-400">
                Define granular capabilities that power your RBAC system. Reusable across roles.
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search permissions..."
              className="pl-9 rounded-xl border-orange-500/20 bg-neutral-900/80 text-white placeholder:text-neutral-500 focus-visible:ring-orange-500"
            />
          </div>
        </section>

        <section className="glass-card rounded-3xl p-6 sm:p-8">
          <PermissionsManager searchQuery={query} />
        </section>
      </main>
    </div>
  )
}
