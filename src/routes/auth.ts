import { Router, Request, Response } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20'
import { prisma } from '../lib/prisma'
import { signToken, requireAuth } from '../middleware/auth'

const router = Router()

function authCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production'
  const frontendUrl = process.env.FRONTEND_URL ?? ''
  const apiUrl = process.env.API_URL ?? ''
  let crossOrigin = false

  try {
    crossOrigin =
      isProduction &&
      Boolean(frontendUrl && apiUrl) &&
      new URL(frontendUrl).origin !== new URL(apiUrl).origin
  } catch {
    crossOrigin = isProduction
  }

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (crossOrigin ? 'none' : 'lax') as 'none' | 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: (err: unknown, user?: Express.User | false) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value
        if (!email) {
          return done(new Error('No email from Google profile'))
        }

        const user = await prisma.user.upsert({
          where: { providerId: profile.id },
          create: {
            email,
            name: profile.displayName,
            avatarUrl: profile.photos?.[0]?.value ?? null,
            provider: 'google',
            providerId: profile.id,
          },
          update: {
            email,
            name: profile.displayName,
            avatarUrl: profile.photos?.[0]?.value ?? null,
          },
        })

        done(null, {
          userId: user.id,
          email: user.email,
          name: user.name,
        })
      } catch (err) {
        done(err)
      }
    }
  )
)

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/failed' }),
  (req: Request, res: Response) => {
    const user = req.user

    if (!user) {
      res.redirect(`${process.env.FRONTEND_URL}/auth/error`)
      return
    }

    const token = signToken({
      userId: user.userId,
      email: user.email,
      name: user.name,
    })

    res.cookie('token', token, authCookieOptions())

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`)
  }
)

router.get('/failed', (_req: Request, res: Response) => {
  res.status(401).json({ error: 'Google authentication failed' })
})

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token', authCookieOptions())
  res.json({ message: 'Logged out successfully' })
})

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      provider: true,
      createdAt: true,
    },
  })

  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  res.json(user)
})

export default router
