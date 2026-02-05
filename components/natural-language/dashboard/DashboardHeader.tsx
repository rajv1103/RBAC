'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut, User, Shield, ChevronDown, Menu, Settings, LayoutDashboard, X, KeyRound, Sparkles, Link2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/roles', label: 'Roles', icon: Shield },
  { href: '/permissions', label: 'Permissions', icon: KeyRound },
  { href: '/assign', label: 'Assign', icon: Link2 },
  { href: '/natural-language', label: 'Natural language', icon: Sparkles },
] as const

export default function DashboardHeader(): JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (u) setUser(JSON.parse(u))
    } catch (err) {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const initials = (() => {
    const name = user?.name || user?.email || 'RB'
    return name
      .split(/\s+|@/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast({ title: 'Logged out', description: 'See you next time!' })
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-500/20 bg-neutral-950/90 backdrop-blur-xl">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 p-0.5 shadow-lg lava-glow-sm transition-transform duration-200 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-neutral-950">
                <Shield className="h-5 w-5 text-orange-400" />
              </div>
            </div>
            <div className="hidden md:block">
              <span className="text-sm font-bold tracking-tight text-white block leading-none">RBAC</span>
              <span className="text-[10px] text-orange-300/70 uppercase tracking-[0.2em] font-medium">Control center</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive ? 'bg-orange-500/20 text-white shadow-inner' : 'text-neutral-400 hover:text-orange-200 hover:bg-orange-500/10'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-all duration-200 active:scale-[0.98]"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white shadow-inner shadow-black/30">
                {initials}
              </div>
              <ChevronDown className={cn('h-4 w-4 text-neutral-400 transition-transform duration-200', menuOpen && 'rotate-180')} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl border border-orange-500/20 bg-neutral-900/95 backdrop-blur-xl shadow-2xl lava-glow overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-4 border-b border-orange-500/10 bg-gradient-to-r from-orange-500/10 to-amber-500/5">
                  <p className="text-sm font-semibold text-white truncate">{user?.name || user?.email || 'User'}</p>
                  {user?.email && <p className="text-xs text-neutral-500 truncate mt-0.5">{user.email}</p>}
                </div>
                <div className="p-2 space-y-0.5">
                  <DropdownLink href="/profile" icon={<User className="h-4 w-4" />} label="My profile" />
                  <DropdownLink href="/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
                  <div className="h-px bg-orange-500/10 my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2.5 rounded-xl text-neutral-400 hover:text-orange-300 hover:bg-orange-500/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-orange-500/10 bg-neutral-950/98 backdrop-blur-xl p-4 space-y-2">
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-2 space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <MobileLink key={href} href={href} icon={<Icon className="h-4 w-4" />} label={label} />
            ))}
          </div>
          <div className="pt-3 border-t border-orange-500/10">
            <button
              onClick={() => { setMobileOpen(false); handleLogout(); }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out{user?.email ? ` · ${user.email}` : ''}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

function DropdownLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-300 hover:bg-orange-500/10 hover:text-orange-200 transition-colors">
      {icon}
      {label}
    </Link>
  )
}

function MobileLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 w-full p-3 rounded-xl bg-orange-500/5 hover:bg-orange-500/15 text-neutral-200 transition-colors">
      {icon}
      {label}
    </Link>
  )
}