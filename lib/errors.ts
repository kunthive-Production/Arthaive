export class NotFoundError extends Error {
  readonly statusCode = 404
  constructor(resource: string) { super(`${resource} not found`) }
}

export class ValidationError extends Error {
  readonly statusCode = 400
  readonly details: unknown
  constructor(message: string, details?: unknown) {
    super(message)
    this.details = details
  }
}

export class DatabaseError extends Error {
  readonly statusCode = 500
  constructor(message: string) { super(`Database error: ${message}`) }
}

export function handleApiError(err: unknown): { error: string; status: number } {
  if (err instanceof NotFoundError) return { error: err.message, status: 404 }
  if (err instanceof ValidationError) return { error: err.message, status: 400 }
  if (err instanceof DatabaseError) return { error: err.message, status: 500 }
  return { error: "Internal server error", status: 500 }
}
