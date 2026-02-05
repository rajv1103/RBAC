'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  sparkline?: number[]
}

/**
 * Polished StatsCard
 * - Modern glassy card with subtle depth and hover lift
 * - Inline SVG sparkline (no external libs)
 * - Trend badge, description, and accessible markup
 */
export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  sparkline = []
}: StatsCardProps) {
  // Build sparkline path
  const Sparkline = ({ data }: { data: number[] }) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-6" aria-hidden>
          <div className="h-1 w-16 rounded-full bg-neutral-700/40" />
        </div>
      )
    }

    const width = 120
    const height = 28
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const points = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * width
        const y = height - ((d - min) / range) * height
        return `${x},${y}`
      })
      .join(' ')

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block">
        <polyline fill="none" strokeWidth={2} stroke="rgba(249,115,22,0.9)" points={points} />
      </svg>
    )
  }

  return (
    <Card className="relative overflow-hidden border border-orange-500/20 bg-neutral-900/90 text-white shadow-xl hover:shadow-2xl lava-glow-sm transform transition-all hover:-translate-y-1">
      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-orange-500/10" />
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-tr from-orange-500/20 to-amber-500/10 blur-2xl" />

      <CardHeader className="flex items-start justify-between space-y-0 p-4">
        <div>
          <CardTitle className="text-xs sm:text-sm font-semibold text-neutral-300">{title}</CardTitle>
          {description && <div className="text-[11px] mt-1 text-neutral-400">{description}</div>}
        </div>

        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shadow-inner">
            <Icon className="h-4 w-4 text-orange-400" />
          </div>

          {trend && (
            <div
              role="status"
              aria-label={`${trend.isPositive ? 'up' : 'down'} ${trend.value} percent`}
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${trend.isPositive ? 'bg-orange-500/20 text-orange-300' : 'bg-red-900/30 text-red-300'
                }`}
            >
              <span aria-hidden>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{value}</div>
            <div className="mt-2 sm:mt-3 w-full">
              <Sparkline data={sparkline} />
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end text-xs text-neutral-400">
            <div>Compare</div>
            <div className="mt-1 text-neutral-300">This month</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
