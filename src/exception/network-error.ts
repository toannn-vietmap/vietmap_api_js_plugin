import { VietmapApiError } from './vietmap-api-error';

/**
 * Thrown when network requests fail or timeout
 */
export class NetworkError extends VietmapApiError {
  constructor(
    message = 'Network request failed',
    statusCode?: number,
    originalError?: Error,
  ) {
    super(message, 'NETWORK_ERROR', statusCode, originalError);
    this.name = 'NetworkError';
  }
}
