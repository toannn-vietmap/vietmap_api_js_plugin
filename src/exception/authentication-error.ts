import { VietmapApiError } from './vietmap-api-error';

/**
 * Thrown when authentication fails (401 Unauthorized)
 */
export class AuthenticationError extends VietmapApiError {
  constructor(
    message: string = 'Authentication failed. Please check your API key.',
    originalError?: Error,
  ) {
    super(message, 'AUTHENTICATION_ERROR', 401, originalError);
    this.name = 'AuthenticationError';
  }
}
