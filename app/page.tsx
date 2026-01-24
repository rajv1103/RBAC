'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Sparkles, Compass, LockKeyhole } from 'lucide-react'

/**
 * Public Landing Page
 * Shows a colorful animated marketing-style hero and links to all features.
 */
export default function Home() {
  const router = useRouter()

  // If the user is already authenticated, send them straight to the dashboard
  useEffect(() => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-40 -right-16 h-72 w-72 rounded-full bg-purple-500/40 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-sky-400/40 blur-3xl animate-float-slow" />
      </div>

      {/* Page content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Simple nav */}
        <header className="px-6 sm:px-10 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-sky-500/40">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-sky-700/80 dark:text-sky-300/80">
                Secure by design
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                RBAC Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-full bg-slate-900 text-slate-50 text-sm font-semibold px-4 py-1.5 shadow-lg shadow-slate-900/30 hover:-translate-y-[1px] hover:shadow-slate-900/40 transition-all"
            >
              <LockKeyhole className="mr-1.5 h-4 w-4" />
              Launch Console
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 sm:px-10 py-12 gap-12">
          <div className="max-w-xl space-y-6 animate-fade-in-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/60 dark:bg-slate-900/60 px-3 py-1 text-xs font-medium text-sky-700 dark:text-sky-300 shadow-sm ring-1 ring-slate-200/80 dark:ring-slate-800/80">
              <Sparkles className="h-3 w-3" />
              Live, visual Role‑Based Access Control
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Turn complex permissions into a{' '}
              <span className="bg-gradient-to-tr from-sky-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                beautiful control center
              </span>
              .
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-lg">
              Design roles, assign permissions, and even speak in natural language to shape your
              security model. All in one colorful, animated dashboard.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-xl shadow-sky-500/40 hover:shadow-sky-500/60 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Get started now
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-slate-900/10 bg-white/70 px-5 py-3 text-sm sm:text-base font-medium text-slate-800 hover:bg-white shadow-sm hover:-translate-y-0.5 transition-all dark:bg-slate-900/60 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
              >
                <Compass className="mr-2 h-4 w-4" />
                Skip to dashboard
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Real‑time updates across roles & permissions
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                Natural language configuration engine
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                Beautiful, responsive admin experience
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500 animate-pulse" />
                Built with Next.js, Prisma & Tailwind
              </div>
            </div>
          </div>

          {/* Feature grid */}
          <div className="w-full max-w-md space-y-4 animate-fade-in-up lg:animate-none">
            <div className="grid grid-cols-2 gap-4">
              <FeatureCard
                href="/permissions"
                title="Permissions"
                description="Create and organize fine‑grained capabilities."
                color="from-sky-400/80 to-cyan-500/90"
              />
              <FeatureCard
                href="/roles"
                title="Roles"
                description="Bundle permissions into reusable access levels."
                color="from-violet-400/80 to-fuchsia-500/90"
              />
              <FeatureCard
                href="/assign"
                title="Assign"
                description="Visually connect roles and permissions."
                color="from-emerald-400/80 to-lime-400/90"
              />
              <FeatureCard
                href="/natural-language"
                title="Natural language"
                description="Type a command. We handle the rest."
                color="from-amber-400/80 to-rose-400/90"
              />
            </div>

            <div className="glass-card rounded-3xl p-4 sm:p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-emerald-400/40">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Designed for teams
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Whether you&apos;re securing an internal tool or a full SaaS platform, this RBAC
                  console gives you a clear, animated picture of who can do what.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

interface FeatureCardProps {
  href: string
  title: string
  description: string
  color: string
}

function FeatureCard({ href, title, description, color }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-900/70 p-[1px] shadow-lg shadow-slate-900/5 hover:shadow-slate-900/20 transition-all hover:-translate-y-1"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-tr ${color} opacity-70 blur-xl group-hover:opacity-100 transition-opacity`}
      />
      <div className="relative h-full w-full rounded-[1.4rem] bg-slate-950/90 dark:bg-slate-950/95 px-4 py-4 flex flex-col justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
            Feature
          </p>
          <h3 className="text-base sm:text-lg font-semibold text-slate-50">
            {title}
          </h3>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-300 leading-snug">
            {description}
          </p>
        </div>
        <span className="mt-3 inline-flex items-center text-[11px] text-sky-300 group-hover:text-white transition-colors">
          Open
          <span className="ml-1 group-hover:translate-x-0.5 transition-transform">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
