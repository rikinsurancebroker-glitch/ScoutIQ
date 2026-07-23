import { Prisma } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message })
    return
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && (err.code === 'P2024' || err.code === 'P1001')) {
    res.status(503).json({
      error:
        err.code === 'P1001'
          ? 'Database temporarily unreachable — Supabase may be under load. Retry in a few seconds.'
          : 'Database is busy — too many concurrent requests. Retry in a few seconds.',
    })
    return
  }

  if (err instanceof Error) {
    console.error('[ErrorHandler]', err.message, err.stack)
  } else {
    console.error('[ErrorHandler] Unknown error:', err)
  }

  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' })
  } else {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Internal server error',
      stack: err instanceof Error ? err.stack : undefined,
    })
  }
}
