'use client'

import { useEffect, useState } from 'react'
import StatsCard from './StatsCard'
import { Shield, Users, Link, Activity } from 'lucide-react'

interface Stats {
  totalPermissions: number
  totalRoles: number
  totalAssignments: number
  totalUsers: number
}

/**
 * Dashboard Stats Component
 * Displays overview statistics for the RBAC system
 */
export default function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalPermissions: 0,
    totalRoles: 0,
    totalAssignments: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        
        // Fetch all data in parallel
        const [permissionsRes, rolesRes] = await Promise.all([
          fetch('/api/permissions', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/roles', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ])

        const permissions = await permissionsRes.json()
        const roles = await rolesRes.json()

        // Calculate total assignments
        const totalAssignments = roles.reduce((acc: number, role: any) => {
          return acc + (role.rolePermissions?.length || 0)
        }, 0)

        setStats({
          totalPermissions: permissions.length,
          totalRoles: roles.length,
          totalAssignments,
          totalUsers: roles.reduce((acc: number, role: any) => {
            return acc + (role.userRoles?.length || 0)
          }, 0)
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 mb-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-slate-200/70 dark:bg-slate-800/60 animate-pulse"
            />
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-2.5 rounded-full bg-slate-200/70 dark:bg-slate-800/60 animate-pulse" />
          <div className="h-2.5 rounded-full bg-slate-200/70 dark:bg-slate-800/60 animate-pulse" />
          <div className="h-2.5 rounded-full bg-slate-200/70 dark:bg-slate-800/60 animate-pulse" />
        </div>
      </div>
    )
  }

  const avgPermissionsPerRole =
    stats.totalRoles > 0 ? (stats.totalAssignments / stats.totalRoles).toFixed(1) : '0.0'
  const avgAssignmentsPerUser =
    stats.totalUsers > 0 ? (stats.totalAssignments / stats.totalUsers).toFixed(1) : '0.0'

  return (
    <div className="mb-8 space-y-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Permissions"
          value={stats.totalPermissions}
          icon={Shield}
          description="System permissions"
        />
        <StatsCard
          title="Total Roles"
          value={stats.totalRoles}
          icon={Users}
          description="User roles"
        />
        <StatsCard
          title="Role-Permission Links"
          value={stats.totalAssignments}
          icon={Link}
          description="Active assignments"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Activity}
          description="Users with roles"
        />
      </div>

      {/* Insight cards instead of bars to keep it simple and useful */}
      <div className="glass-card rounded-2xl px-4 py-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
            Average permissions per role
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {avgPermissionsPerRole}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Helps you see if roles are too broad (very high number) or too narrow (very low).
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">
            Average assignments per user
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {avgAssignmentsPerUser}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Quick signal for under‑provisioned users (close to 0) or complex access (very high).
          </p>
        </div>
      </div>
    </div>
  )
}
