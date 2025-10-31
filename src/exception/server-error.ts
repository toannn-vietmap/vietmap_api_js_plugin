import { VietmapApiError } from './vietmap-api-error';

/**
 * Thrown when server errors occur (5xx status codes)
 */
export class ServerError extends VietmapApiError {
  constructor(
    message = 'Server error occurred',
    statusCode?: number,
    originalError?: Error,
  ) {
    super(message, 'SERVER_ERROR', statusCode || 500, originalError);
    this.name = 'ServerError';
  }
}
