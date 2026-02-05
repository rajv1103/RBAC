'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardHeader from '@/components/natural-language/dashboard/DashboardHeader'
import { User, Mail, Shield, KeyRound } from 'lucide-react'

type UserRole = { role: { name: string; rolePermissions: { permission: { name: string }[] } } }
type StoredUser = {
  id?: string
  email?: string
  createdAt?: string
  userRoles?: UserRole[]
}

export default function ProfilePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<StoredUser | null>(null)

  useEffect(() => {
    setMounted(true)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/login')
      return
    }
    try {
      const raw = localStorage.getItem('user')
      if (raw) setUser(JSON.parse(raw) as StoredUser)
    } catch {
      setUser(null)
    }
  }, [router])

  if (!mounted) return null

  const roles = user?.userRoles?.map((ur) => ur.role.name) ?? []
  const allPermissions = new Set<string>()
  user?.userRoles?.forEach((ur) => {
    ur.role.rolePermissions?.forEach((rp) => {
      rp.permission?.name && allPermissions.add(rp.permission.name)
    })
  })

  return (
    <div className="min-h-screen app-gradient-bg">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in-up">
        <div className="rounded-3xl border border-orange-500/20 glass-card overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-inner lava-glow-sm">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">My profile</h1>
                <p className="text-sm text-neutral-400">Account details from your session</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-800/50 border border-orange-500/10">
                <Mail className="h-5 w-5 text-orange-400 shrink-0" />
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider">Email</p>
                  <p className="text-white font-medium">{user?.email ?? '—'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-neutral-800/50 border border-orange-500/10">
                <Shield className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Roles</p>
                  {roles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {roles.map((r) => (
                        <span key={r} className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-200 text-sm">
                          {r}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-400 text-sm">No roles assigned</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-neutral-800/50 border border-orange-500/10">
                <KeyRound className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Permissions</p>
                  {allPermissions.size > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(allPermissions).map((p) => (
                        <span key={p} className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-200 text-sm">
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-400 text-sm">No permissions from roles</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
