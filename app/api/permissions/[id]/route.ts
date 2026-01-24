import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

/**
 * GET /api/permissions/[id]
 * Retrieves a specific permission by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const permission = await prisma.permission.findUnique({
      where: { id: params.id },
      include: {
        rolePermissions: {
          include: {
            role: true
          }
        }
      }
    })

    if (!permission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(permission)
  } catch (error) {
    console.error('Get permission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/permissions/[id]
 * Updates a permission
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    // Check if permission exists
    const existing = await prisma.permission.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    // Check if name is being changed and if new name already exists
    if (name && name !== existing.name) {
      const nameExists = await prisma.permission.findUnique({
        where: { name }
      })
      if (nameExists) {
        return NextResponse.json(
          { error: 'Permission with this name already exists' },
          { status: 409 }
        )
      }
    }

    // Update permission
    const permission = await prisma.permission.update({
      where: { id: params.id },
      data: {
        name: name || existing.name,
        description: description !== undefined ? description : existing.description
      }
    })

    return NextResponse.json(permission)
  } catch (error) {
    console.error('Update permission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/permissions/[id]
 * Deletes a permission
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if permission exists
    const existing = await prisma.permission.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    // Delete permission (cascade will handle role_permissions)
    await prisma.permission.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Permission deleted successfully' })
  } catch (error) {
    console.error('Delete permission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
