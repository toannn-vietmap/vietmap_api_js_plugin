/**
 * Base class for all VietmapApi errors
 */
export class VietmapApiError extends Error {
  public readonly code: string;

  public readonly statusCode?: number;

  public readonly originalError?: Error;

  constructor(
    message: string,
    code = 'VIETMAP_API_ERROR',
    statusCode?: number,
    originalError?: Error,
  ) {
    super(message);
    this.name = 'VietmapApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.originalError = originalError;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VietmapApiError);
    }
  }
}
