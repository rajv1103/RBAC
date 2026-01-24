'use client'

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
}

/**
 * Stats Card Component
 * Displays a statistic with an icon and optional trend
 */
export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend
}: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-50 shadow-xl shadow-slate-900/40 hover:shadow-2xl hover:shadow-sky-500/30 transition-all hover:-translate-y-1">
      <div className="pointer-events-none absolute inset-px rounded-xl border border-slate-700/80" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-500/30 blur-2xl" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-xl bg-slate-900/60 border border-sky-500/40 flex items-center justify-center shadow-inner shadow-black/40">
          <Icon className="h-4 w-4 text-sky-300" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {value}
        </div>
        {description && (
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
            {description}
          </p>
        )}
        {trend && (
          <p
            className={`text-xs mt-1 ${
              trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </p>
        )}
      </CardContent>
    </Card>
  )
}
