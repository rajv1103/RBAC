'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, User, Shield } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

/**
 * Dashboard Header Component
 * Displays app title, user info and logout button
 */
export default function DashboardHeader() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    })
    router.push('/login')
  }

  const user = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || '{}')
    : null

  return (
    <header className="relative border-b border-slate-200/70 dark:border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-50 shadow-lg shadow-slate-900/40">
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-sky-500/0 via-sky-400/80 to-fuchsia-500/0" />
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-sky-500/40">
            <Shield className="h-6 w-6 text-white drop-shadow" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              RBAC Management Tool
            </h1>
            <p className="text-[11px] md:text-xs text-slate-300/90">
              Visual roles, permissions & access in one place
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          {user?.email && (
            <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-slate-200/90 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/80 shadow-inner shadow-black/40">
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-sky-300" />
              <span>{user.email}</span>
            </div>
          )}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-slate-600 bg-slate-900/60 text-slate-100 hover:bg-slate-800 hover:border-sky-400/80 hover:text-white transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
