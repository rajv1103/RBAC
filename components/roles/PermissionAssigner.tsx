'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle2, Circle, Save } from 'lucide-react'

interface Permission {
  id: string
  name: string
  description: string | null
}

interface Role {
  id: string
  name: string
  rolePermissions?: Array<{
    permission: Permission
  }>
}

interface PermissionAssignerProps {
  roles: Role[]
  onUpdate: () => void
}

/**
 * Permission Assigner Component
 * Allows assigning/unassigning permissions to roles
 */
export default function PermissionAssigner({ roles, onUpdate }: PermissionAssignerProps) {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  // Fetch all permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/permissions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Failed to fetch permissions')
        const data = await response.json()
        setPermissions(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load permissions',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [toast])

  // Update selected permissions when role changes
  useEffect(() => {
    if (selectedRole) {
      const rolePermissions = selectedRole.rolePermissions || []
      const permissionIds = new Set(rolePermissions.map(rp => rp.permission.id))
      setSelectedPermissions(permissionIds)
    } else {
      setSelectedPermissions(new Set())
    }
  }, [selectedRole])

  // Handle permission toggle
  const togglePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions)
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId)
    } else {
      newSelected.add(permissionId)
    }
    setSelectedPermissions(newSelected)
  }

  // Save assignments
  const handleSave = async () => {
    if (!selectedRole) return

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/roles/${selectedRole.id}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          permissionIds: Array.from(selectedPermissions)
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save permissions')
      }

      toast({
        title: 'Success',
        description: 'Permissions updated successfully'
      })
      onUpdate()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save permissions',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Role Selection */}
      <Card className="rounded-3xl border border-orange-500/20 glass-card">
        <CardHeader>
          <CardTitle className="text-white">Select Role</CardTitle>
          <CardDescription className="text-neutral-400">Choose a role to manage its permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {roles.map((role) => (
              <Button
                key={role.id}
                variant={selectedRole?.id === role.id ? 'default' : 'outline'}
                className="w-full justify-start rounded-2xl border-orange-500/20 data-[state=true]:border-orange-400/60 data-[state=true]:bg-orange-500/20 transition-all text-white hover:bg-orange-500/10"
                onClick={() => setSelectedRole(role)}
              >
                {role.name}
                <span className="ml-auto text-xs opacity-70">
                  {role.rolePermissions?.length || 0} permissions
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permission Selection */}
      <Card className="lg:col-span-2 rounded-3xl border border-orange-500/20 bg-neutral-900/90 text-white shadow-xl lava-glow-sm">
        <CardHeader>
          <CardTitle className="text-white">
            {selectedRole ? `Permissions for ${selectedRole.name}` : 'Select a Role'}
          </CardTitle>
          <CardDescription className="text-neutral-400">
            {selectedRole
              ? 'Toggle permissions to assign or remove them from this role'
              : 'Choose a role from the left to manage its permissions'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedRole ? (
            <>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {permissions.map((permission) => {
                  const isSelected = selectedPermissions.has(permission.id)
                  return (
                    <div
                      key={permission.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-orange-500/20 hover:border-orange-400/50 hover:bg-orange-500/10 cursor-pointer transition-all"
                      onClick={() => togglePermission(permission.id)}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="h-5 w-5 text-orange-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-neutral-500" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base text-white">{permission.name}</p>
                        {permission.description && (
                          <p className="text-xs sm:text-sm text-neutral-400">
                            {permission.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-xs sm:text-sm text-neutral-400">
                  {selectedPermissions.size} of {permissions.length} permissions selected
                </p>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-semibold px-5 lava-glow-sm"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              Please select a role to manage its permissions
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
