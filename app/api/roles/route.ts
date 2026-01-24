import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

/**
 * GET /api/roles
 * Retrieves all roles with their permissions
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const roles = await prisma.role.findMany({
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json(roles)
  } catch (error) {
    console.error('Get roles error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/roles
 * Creates a new role
 */
export async function POST(request: NextRequest) {
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

    if (!name) {
      return NextResponse.json(
        { error: 'Role name is required' },
        { status: 400 }
      )
    }

    // Check if role already exists
    const existing = await prisma.role.findUnique({
      where: { name }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Role with this name already exists' },
        { status: 409 }
      )
    }

    // Create role
    const role = await prisma.role.create({
      data: {
        name,
        description: description || null
      }
    })

    return NextResponse.json(role, { status: 201 })
  } catch (error) {
    console.error('Create role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
