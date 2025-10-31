import { VietmapApiError } from './vietmap-api-error';

/**
 * Thrown when rate limits are exceeded (429 Too Many Requests)
 */
export class RateLimitError extends VietmapApiError {
  public readonly retryAfter?: number;

  constructor(
    message = 'Rate limit exceeded',
    retryAfter?: number,
    originalError?: Error,
  ) {
    super(message, 'RATE_LIMIT_ERROR', 429, originalError);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}
