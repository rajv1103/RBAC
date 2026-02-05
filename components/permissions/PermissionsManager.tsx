'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Plus, Edit, Trash2, Search } from 'lucide-react'

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

interface PermissionsManagerProps {
  /** When provided, filters by this query and hides internal search (page provides header + search) */
  searchQuery?: string
}

/**
 * Permissions Manager Component
 * Provides CRUD operations for permissions. No duplicate header when used with searchQuery.
 */
export default function PermissionsManager({ searchQuery }: PermissionsManagerProps) {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const { toast } = useToast()

  const filterQuery = searchQuery !== undefined ? searchQuery : searchTerm

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

  // Filter permissions (use searchQuery from page or internal searchTerm)
  const filteredPermissions = permissions.filter(p =>
    p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(filterQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Toolbar: Create only (page provides title + search when searchQuery is passed) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {searchQuery === undefined && (
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-orange-500/20 bg-neutral-900/80 text-white placeholder:text-neutral-500 focus-visible:ring-orange-500"
            />
          </div>
        )}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleCreate}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-lg lava-glow-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Permission
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
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

      {/* Permissions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-neutral-800/60 animate-pulse"
            />
          ))}

        {!loading && filteredPermissions.map((permission) => (
          <Card
            key={permission.id}
            className="relative overflow-hidden rounded-2xl border border-orange-500/20 glass-card hover:-translate-y-1 transition-all duration-200"
          >
            <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-gradient-to-r from-orange-500/30 via-amber-500/20 to-orange-600/30 blur-2xl" />
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-base sm:text-lg font-semibold text-white">
                  {permission.name}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(permission)}
                    className="hover:bg-orange-500/10 hover:text-orange-400"
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
              <div className="text-sm text-neutral-400 space-y-1">
                <p>Used by {permission.rolePermissions?.length || 0} role(s)</p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Created: {new Date(permission.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPermissions.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          {searchTerm ? 'No permissions found matching your search' : 'No permissions yet. Create one to get started!'}
        </div>
      )}
    </div>
  )
}
