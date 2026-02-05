'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardHeader from '@/components/natural-language/dashboard/DashboardHeader'
import DashboardStats from '@/components/natural-language/dashboard/DashboardStats'
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
    <div className="min-h-screen app-gradient-bg">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 space-y-8 animate-fade-in-up">
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
      className="group relative overflow-hidden rounded-3xl border border-orange-500/20 glass-card hover:-translate-y-1 transition-all duration-200"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-gradient-to-r from-orange-500/30 via-amber-500/20 to-orange-600/30 blur-2xl" />
      <div className="relative p-5 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-inner lava-glow-sm">
              {icon}
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white">
              {title}
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.16em] bg-orange-500/20 text-orange-200 group-hover:bg-orange-500/30 transition-colors">
            {pill}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 mb-3">
          {description}
        </p>
        <span className="inline-flex items-center text-[11px] text-orange-400 group-hover:translate-x-0.5 transition-transform">
          Open workspace
          <span className="ml-1">→</span>
        </span>
      </div>
    </Link>
  )
}
