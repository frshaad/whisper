type ErrorStatusCode = 400 | 401

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
