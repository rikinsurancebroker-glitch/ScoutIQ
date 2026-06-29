import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  userId: string
  email: string
  name: string
}

declare global {
  namespace Express {
    interface User extends AuthPayload {}
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token =
    req.cookies?.token ??
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : undefined)

  if (!token) {
    res.status(401).json({ error: 'Authentication required' })
    return
  }

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET not configured')
    }
    const payload = jwt.verify(token, secret) as AuthPayload
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function signToken(payload: AuthPayload): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET not configured')
  }
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}
