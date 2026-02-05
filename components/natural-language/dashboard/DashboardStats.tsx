'use client'

import { useEffect, useState } from 'react'
import StatsCard from './StatsCard'
import { Shield, Users, Link, Activity, TrendingUp } from 'lucide-react'

interface Stats {
  totalPermissions: number
  totalRoles: number
  totalAssignments: number
  totalUsers: number
}

/**
 * DashboardStats — Polished
 * - Improved loading UI
 * - Persisted history in localStorage to generate sparklines and trends
 * - Trend % calculation against last snapshot
 * - Insight cards with contextual badges and micro bars
 * - No external libraries required
 */
export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalPermissions: 0,
    totalRoles: 0,
    totalAssignments: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [trends, setTrends] = useState<Record<string, { value: number; isPositive: boolean }>>({})
  const [history, setHistory] = useState<Record<string, number[]>>({
    permissions: [],
    roles: [],
    assignments: [],
    users: []
  })

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

        const [permissionsRes, rolesRes] = await Promise.all([
          fetch('/api/permissions', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/roles', { headers: { Authorization: `Bearer ${token}` } })
        ])

        if (!permissionsRes.ok || !rolesRes.ok) throw new Error('API error')

        const permissions = await permissionsRes.json()
        const roles = await rolesRes.json()

        const totalAssignments = roles.reduce((acc: number, role: any) => acc + (role.rolePermissions?.length || 0), 0)
        const totalUsers = roles.reduce((acc: number, role: any) => acc + (role.userRoles?.length || 0), 0)

        const newStats: Stats = {
          totalPermissions: Array.isArray(permissions) ? permissions.length : 0,
          totalRoles: Array.isArray(roles) ? roles.length : 0,
          totalAssignments,
          totalUsers
        }

        // load previous snapshot from localStorage to compute trends
        const prevRaw = typeof window !== 'undefined' ? localStorage.getItem('rbac_last_stats') : null
        const prev = prevRaw ? JSON.parse(prevRaw) : null

        const computeTrend = (key: keyof Stats) => {
          const prevVal = prev ? (prev[key] as number) : null
          const curVal = newStats[key]
          if (prevVal === null || prevVal === undefined || prevVal === 0) return { value: 0, isPositive: curVal >= (prevVal || 0) }
          const diff = ((curVal - prevVal) / Math.max(prevVal, 1)) * 100
          return { value: Math.round(diff), isPositive: diff >= 0 }
        }

        const newTrends = {
          permissions: computeTrend('totalPermissions'),
          roles: computeTrend('totalRoles'),
          assignments: computeTrend('totalAssignments'),
          users: computeTrend('totalUsers')
        }

        // Maintain a short history for sparklines (store in localStorage)
        const histRaw = typeof window !== 'undefined' ? localStorage.getItem('rbac_stats_history') : null
        const hist = histRaw ? JSON.parse(histRaw) : { permissions: [], roles: [], assignments: [], users: [] }

        const pushHistory = (arr: number[], v: number) => {
          const copy = Array.isArray(arr) ? [...arr] : []
          copy.push(v)
          // keep last 8 points
          if (copy.length > 8) copy.shift()
          return copy
        }

        const nextHist = {
          permissions: pushHistory(hist.permissions || [], newStats.totalPermissions),
          roles: pushHistory(hist.roles || [], newStats.totalRoles),
          assignments: pushHistory(hist.assignments || [], newStats.totalAssignments),
          users: pushHistory(hist.users || [], newStats.totalUsers)
        }

        // persist
        if (typeof window !== 'undefined') {
          localStorage.setItem('rbac_last_stats', JSON.stringify(newStats))
          localStorage.setItem('rbac_stats_history', JSON.stringify(nextHist))
        }

        setStats(newStats)
        setTrends({
          totalPermissions: newTrends.permissions,
          totalRoles: newTrends.roles,
          totalAssignments: newTrends.assignments,
          totalUsers: newTrends.users
        } as any)
        setHistory(nextHist)
      } catch (e) {
        console.error('Failed to fetch stats:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // optionally: refresh every 60s
    const id = setInterval(fetchStats, 60000)
    return () => clearInterval(id)
  }, [])

  if (loading) {
    return (
      <div className="mb-8 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-neutral-800/60 border border-orange-500/10 animate-pulse"
            />
          ))}
        </div>
        <div className="rounded-2xl p-4 border border-orange-500/20 glass-card">
          <div className="h-4 w-40 rounded-full bg-neutral-700/50 animate-pulse mb-3" />
          <div className="space-y-2">
            <div className="h-3 rounded-full bg-neutral-700/50 animate-pulse" />
            <div className="h-3 rounded-full bg-neutral-700/50 animate-pulse w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  const avgPermissionsPerRole = stats.totalRoles ? (stats.totalAssignments / stats.totalRoles).toFixed(1) : '0.0'
  const avgAssignmentsPerUser = stats.totalUsers ? (stats.totalAssignments / stats.totalUsers).toFixed(1) : '0.0'

  // small helper to render a micro bar (no libs)
  const MicroBar = ({ value, max = 10 }: { value: number; max?: number }) => {
    const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100))
    return (
      <div className="h-2 w-full rounded-full bg-neutral-800/50 overflow-hidden">
        <div className="h-2 rounded-full bg-orange-500" style={{ width: `${pct}%` }} />
      </div>
    )
  }

  return (
    <div className="mb-8 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Permissions"
          value={stats.totalPermissions}
          icon={Shield}
          description="System capabilities"
          trend={trends.totalPermissions}
          sparkline={history.permissions}
        />

        <StatsCard
          title="Roles"
          value={stats.totalRoles}
          icon={Users}
          description="Access groups"
          trend={trends.totalRoles}
          sparkline={history.roles}
        />

        <StatsCard
          title="Assignments"
          value={stats.totalAssignments}
          icon={Link}
          description="Role ↔ Permission links"
          trend={trends.totalAssignments}
          sparkline={history.assignments}
        />

        <StatsCard
          title="Users"
          value={stats.totalUsers}
          icon={Activity}
          description="Users with roles"
          trend={trends.totalUsers}
          sparkline={history.users}
        />
      </div>

      <div className="rounded-3xl border border-orange-500/20 glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-orange-400" />
          <h3 className="text-sm font-semibold text-white">Access Insights</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-4 bg-neutral-900/80 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400">Avg permissions per role</p>
                <p className="text-3xl font-bold mt-1 text-white">{avgPermissionsPerRole}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${parseFloat(avgPermissionsPerRole) > 10 ? 'bg-amber-500/20 text-amber-300' : 'bg-orange-500/20 text-orange-300'}`}>
                  {parseFloat(avgPermissionsPerRole) > 10 ? 'Broad roles' : 'Balanced'}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <MicroBar value={parseFloat(avgPermissionsPerRole)} max={20} />
              <p className="text-[11px] mt-2 text-neutral-500">High values indicate roles that may be too permissive.</p>
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-neutral-900/80 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-400">Avg assignments per user</p>
                <p className="text-3xl font-bold mt-1 text-white">{avgAssignmentsPerUser}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${parseFloat(avgAssignmentsPerUser) > 5 ? 'bg-amber-500/20 text-amber-300' : 'bg-orange-500/20 text-orange-300'}`}>
                  {parseFloat(avgAssignmentsPerUser) > 5 ? 'Complex' : 'Simple'}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <MicroBar value={parseFloat(avgAssignmentsPerUser)} max={10} />
              <p className="text-[11px] mt-2 text-neutral-500">If many users have many assignments, consider grouping or simplifying roles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
