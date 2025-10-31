import { VietmapApiError } from './vietmap-api-error';

/**
 * Thrown when network requests fail or timeout
 */
export class NetworkError extends VietmapApiError {
  constructor(
    message: string = 'Network request failed',
    statusCode?: number,
    originalError?: Error,
  ) {
    super(message, 'NETWORK_ERROR', statusCode, originalError);
    this.name = 'NetworkError';
  }
}
