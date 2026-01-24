import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

/**
 * GET /api/roles/[id]
 * Retrieves a specific role by ID with its permissions
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

    const role = await prisma.role.findUnique({
      where: { id: params.id },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        },
        userRoles: {
          include: {
            user: true
          }
        }
      }
    })

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(role)
  } catch (error) {
    console.error('Get role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/roles/[id]
 * Updates a role
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

    // Check if role exists
    const existing = await prisma.role.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    // Check if name is being changed and if new name already exists
    if (name && name !== existing.name) {
      const nameExists = await prisma.role.findUnique({
        where: { name }
      })
      if (nameExists) {
        return NextResponse.json(
          { error: 'Role with this name already exists' },
          { status: 409 }
        )
      }
    }

    // Update role
    const role = await prisma.role.update({
      where: { id: params.id },
      data: {
        name: name || existing.name,
        description: description !== undefined ? description : existing.description
      }
    })

    return NextResponse.json(role)
  } catch (error) {
    console.error('Update role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/roles/[id]
 * Deletes a role
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

    // Check if role exists
    const existing = await prisma.role.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    // Delete role (cascade will handle role_permissions and user_roles)
    await prisma.role.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Role deleted successfully' })
  } catch (error) {
    console.error('Delete role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
