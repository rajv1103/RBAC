'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Edit, Trash2, Shield, Search } from 'lucide-react'

interface Permission {
  id: string
  name: string
  description: string | null
  createdAt: string
  rolePermissions?: Array<{
    role: {
      id: string
      name: string
    }
  }>
}

/**
 * Permissions Manager Component
 * Provides CRUD operations for permissions
 */
export default function PermissionsManager() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const { toast } = useToast()

  // Fetch permissions
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

  useEffect(() => {
    fetchPermissions()
  }, [])

  // Handle create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      if (editingPermission) {
        // Update
        const response = await fetch(`/api/permissions/${editingPermission.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to update permission')
        }

        toast({
          title: 'Success',
          description: 'Permission updated successfully'
        })
      } else {
        // Create
        const response = await fetch('/api/permissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to create permission')
        }

        toast({
          title: 'Success',
          description: 'Permission created successfully'
        })
      }

      setIsDialogOpen(false)
      setFormData({ name: '', description: '' })
      setEditingPermission(null)
      fetchPermissions()
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
    if (!confirm('Are you sure you want to delete this permission?')) return

    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/permissions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to delete permission')

      toast({
        title: 'Success',
        description: 'Permission deleted successfully'
      })
      fetchPermissions()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete permission',
        variant: 'destructive'
      })
    }
  }

  // Open edit dialog
  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission)
    setFormData({
      name: permission.name,
      description: permission.description || ''
    })
    setIsDialogOpen(true)
  }

  // Open create dialog
  const handleCreate = () => {
    setEditingPermission(null)
    setFormData({ name: '', description: '' })
    setIsDialogOpen(true)
  }

  // Filter permissions
  const filteredPermissions = permissions.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-50">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-500 to-emerald-400 text-white shadow-md shadow-sky-500/40">
              <Shield className="h-5 w-5" />
            </span>
            Permissions Management
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Create, search, and refine the atomic actions that power your roles.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Permission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingPermission ? 'Edit Permission' : 'Create Permission'}
                </DialogTitle>
                <DialogDescription>
                  {editingPermission
                    ? 'Update the permission details below.'
                    : 'Add a new permission to the system.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., can_edit_articles"
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
                  {editingPermission ? 'Update' : 'Create'}
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
          placeholder="Search permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/70 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-700/80 focus-visible:ring-sky-500"
        />
      </div>

      {/* Permissions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-200/70 dark:bg-slate-800/60 animate-pulse"
            />
          ))}

        {!loading && filteredPermissions.map((permission) => (
          <Card
            key={permission.id}
            className="relative overflow-hidden rounded-2xl border-0 bg-white/80 dark:bg-slate-950/80 shadow-lg shadow-slate-900/10 hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-gradient-to-r from-sky-400/40 via-cyan-400/40 to-emerald-400/40 blur-2xl" />
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {permission.name}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(permission)}
                    className="hover:bg-sky-500/10 hover:text-sky-500"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(permission.id)}
                    className="hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
              {permission.description && (
                <CardDescription>{permission.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <p>Used by {permission.rolePermissions?.length || 0} role(s)</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Created: {new Date(permission.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPermissions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {searchTerm ? 'No permissions found matching your search' : 'No permissions yet. Create one to get started!'}
        </div>
      )}
    </div>
  )
}
