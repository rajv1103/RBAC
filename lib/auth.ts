import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns Boolean indicating if passwords match
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a JWT token for a user
 * @param userId - User ID
 * @returns JWT token string
 */
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

/**
 * Verify a JWT token
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

/**
 * Get user from token
 * @param token - JWT token string
 * @returns User object or null
 */
export async function getUserFromToken(token: string) {
  const decoded = verifyToken(token)
  if (!decoded) return null

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  })

  return user
}
