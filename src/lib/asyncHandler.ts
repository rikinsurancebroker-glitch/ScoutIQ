import type { NextFunction, Request, Response } from 'express'

type AsyncRoute = (req: Request, res: Response, next: NextFunction) => Promise<void>

/** Express 4 does not catch rejected promises in async route handlers — this forwards them to errorHandler. */
export function asyncHandler(fn: AsyncRoute) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next)
  }
}
