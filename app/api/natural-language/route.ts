import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

/**
 * POST /api/natural-language
 * Processes natural language commands to modify RBAC settings
 * Uses pattern matching to parse commands (can be enhanced with AI API)
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
    const { command } = body

    if (!command || typeof command !== 'string') {
      return NextResponse.json(
        { error: 'Command is required' },
        { status: 400 }
      )
    }

    const lowerCommand = command.toLowerCase().trim()
    let result: any = null
    let action = ''

    // Pattern 1: "Give the role 'X' the permission to 'Y'"
    const givePermissionMatch = lowerCommand.match(
      /give\s+(?:the\s+)?role\s+['"]([^'"]+)['"]\s+(?:the\s+)?permission\s+(?:to\s+)?['"]([^'"]+)['"]/i
    )

    if (givePermissionMatch) {
      const roleName = givePermissionMatch[1]
      const permissionName = givePermissionMatch[2]

      // Find role and permission
      const role = await prisma.role.findUnique({ where: { name: roleName } })
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName }
      })

      if (!role) {
        return NextResponse.json(
          { error: `Role '${roleName}' not found` },
          { status: 404 }
        )
      }

      if (!permission) {
        return NextResponse.json(
          { error: `Permission '${permissionName}' not found` },
          { status: 404 }
        )
      }

      // Check if already assigned
      const existing = await prisma.rolePermission.findUnique({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id
          }
        }
      })

      if (!existing) {
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permission.id
          }
        })
      }

      result = { role, permission }
      action = 'assigned_permission'
    }

    // Pattern 2: "Create a new permission called 'X'"
    const createPermissionMatch = lowerCommand.match(
      /create\s+(?:a\s+)?(?:new\s+)?permission\s+(?:called\s+)?['"]([^'"]+)['"]/i
    )

    if (createPermissionMatch) {
      const permissionName = createPermissionMatch[1]

      // Check if exists
      const existing = await prisma.permission.findUnique({
        where: { name: permissionName }
      })

      if (existing) {
        return NextResponse.json(
          { error: `Permission '${permissionName}' already exists` },
          { status: 409 }
        )
      }

      result = await prisma.permission.create({
        data: { name: permissionName }
      })
      action = 'created_permission'
    }

    // Pattern 3: "Create a new role called 'X'"
    const createRoleMatch = lowerCommand.match(
      /create\s+(?:a\s+)?(?:new\s+)?role\s+(?:called\s+)?['"]([^'"]+)['"]/i
    )

    if (createRoleMatch) {
      const roleName = createRoleMatch[1]

      // Check if exists
      const existing = await prisma.role.findUnique({
        where: { name: roleName }
      })

      if (existing) {
        return NextResponse.json(
          { error: `Role '${roleName}' already exists` },
          { status: 409 }
        )
      }

      result = await prisma.role.create({
        data: { name: roleName }
      })
      action = 'created_role'
    }

    // Pattern 4: "Remove permission 'X' from role 'Y'"
    const removePermissionMatch = lowerCommand.match(
      /remove\s+(?:the\s+)?permission\s+['"]([^'"]+)['"]\s+from\s+(?:the\s+)?role\s+['"]([^'"]+)['"]/i
    )

    if (removePermissionMatch) {
      const permissionName = removePermissionMatch[1]
      const roleName = removePermissionMatch[2]

      const role = await prisma.role.findUnique({ where: { name: roleName } })
      const permission = await prisma.permission.findUnique({
        where: { name: permissionName }
      })

      if (!role || !permission) {
        return NextResponse.json(
          { error: 'Role or permission not found' },
          { status: 404 }
        )
      }

      await prisma.rolePermission.deleteMany({
        where: {
          roleId: role.id,
          permissionId: permission.id
        }
      })

      result = { role, permission }
      action = 'removed_permission'
    }

    if (!result) {
      return NextResponse.json(
        {
          error: 'Could not parse command. Supported formats:\n' +
            '- "Give the role \'X\' the permission to \'Y\'"\n' +
            '- "Create a new permission called \'X\'"\n' +
            '- "Create a new role called \'X\'"\n' +
            '- "Remove permission \'X\' from role \'Y\'"'
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      message: `Successfully executed: ${command}`
    })
  } catch (error) {
    console.error('Natural language processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
