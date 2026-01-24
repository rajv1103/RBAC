'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Edit, Trash2, Users, Search, Settings } from 'lucide-react'
import PermissionAssigner from './PermissionAssigner'

interface Role {
  id: string
  name: string
  description: string | null
  createdAt: string
  rolePermissions?: Array<{
    permission: {
      id: string
      name: string
      description: string | null
    }
  }>
  userRoles?: Array<{
    user: {
      id: string
      email: string
    }
  }>
}

interface RolesManagerProps {
  showAssignMode?: boolean
}

/**
 * Roles Manager Component
 * Provides CRUD operations for roles and permission assignment
 */
export default function RolesManager({ showAssignMode = false }: RolesManagerProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const { toast } = useToast()

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/roles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch roles')
      const data = await response.json()
      setRoles(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load roles',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  // Handle create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      if (editingRole) {
        // Update
        const response = await fetch(`/api/roles/${editingRole.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to update role')
        }

        toast({
          title: 'Success',
          description: 'Role updated successfully'
        })
      } else {
        // Create
        const response = await fetch('/api/roles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to create role')
        }

        toast({
          title: 'Success',
          description: 'Role created successfully'
        })
      }

      setIsDialogOpen(false)
      setFormData({ name: '', description: '' })
      setEditingRole(null)
      fetchRoles()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      })
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return

    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete role')

      toast({
        title: 'Success',
        description: 'Role deleted successfully'
      })
      fetchRoles()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete role',
        variant: 'destructive'
      })
    }
  }

  // Open edit dialog
  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description || ''
    })
    setIsDialogOpen(true)
  }

  // Open create dialog
  const handleCreate = () => {
    setEditingRole(null)
    setFormData({ name: '', description: '' })
    setIsDialogOpen(true)
  }

  // Filter roles
  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // If in assign mode, show permission assigner
  if (showAssignMode) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-50">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-sky-400 text-white shadow-md shadow-emerald-400/40">
              <Settings className="h-5 w-5" />
            </span>
            Assign Permissions to Roles
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Manage which permissions are assigned to each role through a visual matrix.
          </p>
        </div>
        <div className="glass-card rounded-3xl p-5 sm:p-7">
          <PermissionAssigner roles={roles} onUpdate={fetchRoles} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-50">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-500 via-indigo-500 to-sky-500 text-white shadow-md shadow-violet-500/40">
              <Users className="h-5 w-5" />
            </span>
            Roles Management
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Design higher‑level access bundles that you can assign to many users.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingRole ? 'Edit Role' : 'Create Role'}
                </DialogTitle>
                <DialogDescription>
                  {editingRole
                    ? 'Update the role details below.'
                    : 'Add a new role to the system.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Administrator"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRole ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/70 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-700/80 focus-visible:ring-violet-500"
        />
      </div>

      {/* Roles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-200/70 dark:bg-slate-800/60 animate-pulse"
            />
          ))}

        {!loading && filteredRoles.map((role) => (
          <Card
            key={role.id}
            className="relative overflow-hidden rounded-2xl border-0 bg-white/80 dark:bg-slate-950/80 shadow-lg shadow-slate-900/10 hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-gradient-to-r from-violet-400/35 via-indigo-400/35 to-sky-400/35 blur-2xl" />
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {role.name}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(role)}
                    className="hover:bg-violet-500/10 hover:text-violet-500"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(role.id)}
                    className="hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
              {role.description && (
                <CardDescription>{role.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-slate-600 dark:text-slate-300">
                  <span className="font-medium">{role.rolePermissions?.length || 0}</span> permission(s)
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <span className="font-medium">{role.userRoles?.length || 0}</span> user(s)
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Created: {new Date(role.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {searchTerm ? 'No roles found matching your search' : 'No roles yet. Create one to get started!'}
        </div>
      )}
    </div>
  )
}
