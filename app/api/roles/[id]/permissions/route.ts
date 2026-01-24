import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

/**
 * GET /api/roles/[id]/permissions
 * Gets all permissions for a specific role
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
        }
      }
    })

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(role.rolePermissions.map((rp: { permission: any }) => rp.permission))
  } catch (error) {
    console.error('Get role permissions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/roles/[id]/permissions
 * Assigns permissions to a role
 */
export async function POST(
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
    const { permissionIds } = body

    if (!Array.isArray(permissionIds)) {
      return NextResponse.json(
        { error: 'permissionIds must be an array' },
        { status: 400 }
      )
    }

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: params.id }
    })

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    // Verify all permissions exist
    const permissions = await prisma.permission.findMany({
      where: { id: { in: permissionIds } }
    })

    if (permissions.length !== permissionIds.length) {
      return NextResponse.json(
        { error: 'One or more permissions not found' },
        { status: 404 }
      )
    }

    // Delete existing role permissions
    await prisma.rolePermission.deleteMany({
      where: { roleId: params.id }
    })

    // Create new role permissions
    const rolePermissions = await prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId: string) => ({
        roleId: params.id,
        permissionId
      }))
    })

    // Fetch updated role with permissions
    const updatedRole = await prisma.role.findUnique({
      where: { id: params.id },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    })

    return NextResponse.json(updatedRole)
  } catch (error) {
    console.error('Assign permissions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
