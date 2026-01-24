import { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromToken } from './auth'

/**
 * Extract JWT token from request headers
 */
export function getTokenFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

/**
 * Middleware to protect API routes - requires authentication
 */
export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ userId: string } | null> {
  const token = getTokenFromRequest(req)
  
  if (!token) {
    res.status(401).json({ error: 'Unauthorized - No token provided' })
    return null
  }

  const user = await getUserFromToken(token)
  
  if (!user) {
    res.status(401).json({ error: 'Unauthorized - Invalid token' })
    return null
  }

  return { userId: user.id }
}

/**
 * Handle API errors consistently
 */
export function handleApiError(res: NextApiResponse, error: unknown, statusCode = 500) {
  console.error('API Error:', error)
  const message = error instanceof Error ? error.message : 'An unknown error occurred'
  res.status(statusCode).json({ error: message })
}
