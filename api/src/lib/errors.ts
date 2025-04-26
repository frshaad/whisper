import type { Response } from 'express'
import { ZodError } from 'zod'

type ErrorStatusCode = 400 | 401 | 403 | 404

export class AppError extends Error {
  constructor(
    public statusCode: ErrorStatusCode,
    public message: string,
    public errors?: { field: string; message: string }[],
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      status: 'failed',
      message: 'Invalid input',
      errors: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    })
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'failed',
      message: error.message,
      ...(error.errors && { errors: error.errors }),
    })
  }

  return res.status(500).json({
    status: 'failed',
    message: 'Something went wrong. Please try again later.',
  })
}
