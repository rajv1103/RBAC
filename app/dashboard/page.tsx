'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DashboardStats from '@/components/dashboard/DashboardStats'
import { Shield, Users, Settings, Sparkles } from 'lucide-react'

/**
 * Main Dashboard Page
 * Overview with stats and navigation cards into each feature
 */
export default function Dashboard() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check authentication
    const token = localStorage.getItem('token')
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
      <main className="container mx-auto px-4 py-8 space-y-8 animate-fade-in-up">
        <section className="glass-card rounded-3xl px-6 py-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">
              <Sparkles className="h-3 w-3 text-sky-300" />
              RBAC overview
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
              Live access control cockpit
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Keep an eye on your roles, permissions, and assignments in real time. Use the cards
              below to jump into each workspace.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              Visual RBAC statistics
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Feature‑specific workspaces
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              Natural language engine
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Designed for security teams
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <DashboardStats />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              href="/permissions"
              title="Permissions"
              description="Define and organize every capability in your system."
              icon={<Shield className="h-5 w-5" />}
              pill="Start here"
            />
            <FeatureCard
              href="/roles"
              title="Roles"
              description="Bundle permissions into clear, reusable access levels."
              icon={<Users className="h-5 w-5" />}
              pill="Design access"
            />
            <FeatureCard
              href="/assign"
              title="Assign"
              description="Visually connect roles to permissions for each team."
              icon={<Settings className="h-5 w-5" />}
              pill="Wire it up"
            />
            <FeatureCard
              href="/natural-language"
              title="Natural language"
              description="Describe changes in English and let the tool handle the rest."
              icon={<Sparkles className="h-5 w-5" />}
              pill="Speak to configure"
            />
          </div>
        </section>
      </main>
    </div>
  )
}

interface FeatureCardProps {
  href: string
  title: string
  description: string
  icon: React.ReactNode
  pill: string
}

function FeatureCard({ href, title, description, icon, pill }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-3xl border-0 bg-white/80 dark:bg-slate-950/80 shadow-lg shadow-slate-900/10 hover:shadow-2xl hover:-translate-y-1 transition-all"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-gradient-to-r from-sky-400/40 via-violet-400/40 to-emerald-400/40 blur-2xl" />
      <div className="relative p-5 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-slate-950/90 text-slate-50 flex items-center justify-center shadow-inner shadow-black/40">
              {icon}
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50">
              {title}
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.16em] bg-slate-900/90 text-slate-100 group-hover:bg-slate-50 group-hover:text-slate-900 transition-colors">
            {pill}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-3">
          {description}
        </p>
        <span className="inline-flex items-center text-[11px] text-sky-600 dark:text-sky-300 group-hover:translate-x-0.5 transition-transform">
          Open workspace
          <span className="ml-1">→</span>
        </span>
      </div>
    </Link>
  )
}
