import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * Seed script to populate database with initial data
 * Run with: npx ts-node prisma/seed.ts
 */
async function main() {
  console.log('🌱 Seeding database...')

  // Create test user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
    },
  })
  console.log('✅ Created user:', user.email)

  // Create permissions
  const permissions = [
    { name: 'can_view_dashboard', description: 'Can view the dashboard' },
    { name: 'can_edit_articles', description: 'Can edit articles' },
    { name: 'can_delete_articles', description: 'Can delete articles' },
    { name: 'can_publish_content', description: 'Can publish content' },
    { name: 'can_delete_users', description: 'Can delete users' },
    { name: 'can_manage_roles', description: 'Can manage roles and permissions' },
    { name: 'can_view_reports', description: 'Can view reports' },
    { name: 'can_export_data', description: 'Can export data' },
  ]

  const createdPermissions = []
  for (const perm of permissions) {
    const permission = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    })
    createdPermissions.push(permission)
  }
  console.log(`✅ Created ${createdPermissions.length} permissions`)

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {},
    create: {
      name: 'Administrator',
      description: 'Full system access',
    },
  })

  const editorRole = await prisma.role.upsert({
    where: { name: 'Content Editor' },
    update: {},
    create: {
      name: 'Content Editor',
      description: 'Can edit and publish content',
    },
  })

  const viewerRole = await prisma.role.upsert({
    where: { name: 'Viewer' },
    update: {},
    create: {
      name: 'Viewer',
      description: 'Can only view content',
    },
  })

  console.log('✅ Created roles: Administrator, Content Editor, Viewer')

  // Assign all permissions to Administrator
  for (const permission of createdPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    })
  }
  console.log('✅ Assigned all permissions to Administrator')

  // Assign specific permissions to Content Editor
  const editorPermissions = createdPermissions.filter(
    (p) =>
      p.name === 'can_view_dashboard' ||
      p.name === 'can_edit_articles' ||
      p.name === 'can_publish_content' ||
      p.name === 'can_view_reports'
  )

  for (const permission of editorPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: editorRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: editorRole.id,
        permissionId: permission.id,
      },
    })
  }
  console.log('✅ Assigned permissions to Content Editor')

  // Assign view permissions to Viewer
  const viewerPermissions = createdPermissions.filter(
    (p) => p.name === 'can_view_dashboard' || p.name === 'can_view_reports'
  )

  for (const permission of viewerPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: viewerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: viewerRole.id,
        permissionId: permission.id,
      },
    })
  }
  console.log('✅ Assigned permissions to Viewer')

  // Assign Administrator role to test user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: adminRole.id,
    },
  })
  console.log('✅ Assigned Administrator role to test user')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
