'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Sparkles, Compass, LockKeyhole } from 'lucide-react'

export default function Home(): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) router.push('/dashboard')
  }, [router])

  return (
    <main className="min-h-screen app-gradient-bg">
      {/* Fire / lava blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-16 h-80 w-80 rounded-full bg-orange-500/25 blur-3xl animate-fire-spark" />
        <div className="absolute -bottom-36 -left-10 h-96 w-96 rounded-full bg-amber-600/20 blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-3xl animate-ember-glow" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="container mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg lava-glow-sm">
              <Shield className="h-6 w-6 text-white" aria-hidden />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-white">RBAC</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-orange-200 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-full bg-orange-500 text-white text-sm font-semibold px-4 py-2 shadow-lg lava-glow-sm hover:bg-orange-400 hover:shadow-orange-500/40 transition-all"
            >
              <LockKeyhole className="mr-2 h-4 w-4" />
              Launch Console
            </Link>
          </div>
        </header>

        <section className="container mx-auto px-6 sm:px-10 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 max-w-2xl space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Turn complex permissions into a
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">control center on fire</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 max-w-xl">
              Design roles, assign permissions and let your team manage access confidently — with
              real-time updates, natural language configuration, and a responsive admin surface.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-6 py-3 text-base font-semibold text-white shadow-xl lava-glow hover:from-orange-400 hover:to-amber-400 hover:-translate-y-0.5 transition-all"
                aria-label="Get started — Sign up"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Get started now
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-orange-500/40 bg-neutral-900/80 px-5 py-3 text-base font-medium text-orange-100 hover:bg-orange-500/20 hover:border-orange-400/60 transition-all"
                aria-label="Skip to dashboard"
              >
                <Compass className="mr-2 h-4 w-4" />
                Skip to dashboard
              </Link>
            </div>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                Real-time updates across roles & permissions
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Natural language configuration engine
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                Beautiful, responsive admin experience
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Built with Next.js, Prisma & Tailwind
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="rounded-3xl p-[1px] bg-gradient-to-tr from-orange-500 to-amber-600 shadow-2xl lava-glow">
                <div className="rounded-3xl bg-neutral-950/95 p-5 sm:p-6 w-full border border-orange-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">RBAC</p>
                        <p className="text-xs text-orange-300/80">Admin Console</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-10 rounded-full bg-neutral-700" />
                      <div className="h-6 w-6 rounded-full bg-neutral-700" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="h-2.5 w-3/5 rounded-full bg-neutral-800" />
                    <div className="h-24 rounded-xl bg-neutral-900/80 border border-orange-500/10 p-3">
                      <div className="h-3 rounded-full bg-orange-500/60 w-[30%] mb-2" />
                      <div className="h-2 rounded-full bg-amber-500/50 w-[50%] mb-1" />
                      <div className="h-2 rounded-full bg-orange-400/40 w-[70%]" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg p-2 bg-neutral-800/80 border border-orange-500/10 text-center">
                        <p className="text-xs text-orange-300/70">Roles</p>
                        <p className="text-sm font-semibold text-white">24</p>
                      </div>
                      <div className="rounded-lg p-2 bg-neutral-800/80 border border-orange-500/10 text-center">
                        <p className="text-xs text-orange-300/70">Permissions</p>
                        <p className="text-sm font-semibold text-white">128</p>
                      </div>
                      <div className="rounded-lg p-2 bg-neutral-800/80 border border-orange-500/10 text-center">
                        <p className="text-xs text-orange-300/70">Active</p>
                        <p className="text-sm font-semibold text-white">8</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-neutral-500">Last update</span>
                      <span className="text-xs font-medium text-orange-300/80">2m ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 left-6 rounded-full bg-neutral-950/95 border border-orange-500/20 px-3 py-1.5 shadow-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-orange-200">Designed for teams</span>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 sm:px-10 pb-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard href="/permissions" title="Permissions" description="Create and organize fine‑grained capabilities." />
              <FeatureCard href="/roles" title="Roles" description="Bundle permissions into reusable access levels." />
              <FeatureCard href="/assign" title="Assign" description="Visually connect roles and permissions." />
              <FeatureCard href="/natural-language" title="Natural language" description="Type a command. We handle the rest." />
            </div>
            <div className="glass-card rounded-3xl p-4 sm:p-5 flex items-center gap-4 mt-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg lava-glow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">Built for teams</p>
                <p className="text-xs text-neutral-400">Secure internal tools or full SaaS platforms with a clear picture of who can do what.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-orange-500/10 py-6 mt-auto">
          <div className="container mx-auto px-6 sm:px-10 flex flex-col items-center justify-center text-center">
            <div className="text-sm text-neutral-500">© {new Date().getFullYear()} RBAC — All rights reserved</div>
            <div className="flex items-center gap-4 text-sm text-orange-300/70">
              <Link href="/" className="hover:text-orange-400 transition-colors">Terms</Link>
              <Link href="/" className="hover:text-orange-400 transition-colors">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

interface FeatureCardProps {
  href: string
  title: string
  description: string
}

function FeatureCard({ href, title, description }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl p-[1px] shadow-lg transition-all hover:-translate-y-1 border border-orange-500/20 bg-neutral-900/60 hover:border-orange-500/40"
      aria-label={`Open ${title}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-amber-600/20 opacity-60 group-hover:opacity-100 transition-opacity blur-xl" aria-hidden />
      <div className="relative rounded-xl bg-neutral-950/95 p-4 h-full flex flex-col justify-between border border-orange-500/10">
        <div>
          <p className="text-xs uppercase tracking-wider text-orange-400/80">Feature</p>
          <h3 className="text-lg font-semibold mt-1 text-white">{title}</h3>
          <p className="mt-2 text-sm text-neutral-400">{description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center text-sm text-orange-400 group-hover:text-orange-300 transition-colors">Open <span className="ml-2">→</span></span>
          <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs text-orange-300">Try</span>
        </div>
      </div>
    </Link>
  )
}
