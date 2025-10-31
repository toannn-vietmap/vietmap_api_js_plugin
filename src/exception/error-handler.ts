import { AxiosError } from 'axios';
import { ZodError } from 'zod';
import { VietmapApiError } from './vietmap-api-error';
import { AuthenticationError } from './authentication-error';
import { NetworkError } from './network-error';
import { ValidationError } from './validation-error';
import { RateLimitError } from './rate-limit-error';
import { ServerError } from './server-error';
import { ParseError } from './parse-error';

/**
 * Handles Axios errors and converts them to appropriate VietmapApi errors
 */
export function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    const { response, message } = error;

    // Handle network errors (no response received)
    if (!response) {
      throw new NetworkError(`Network error: ${message}`, undefined, error);
    }

    const { status, data } = response;

    // Handle different HTTP status codes
    switch (status) {
      case 400:
        const badRequestMessage =
          data?.message || 'Bad request - invalid parameters';
        throw new ValidationError(
          badRequestMessage,
          undefined,
          undefined,
          error,
        );

      case 401:
        const authMessage =
          data?.message || 'Unauthorized - invalid or missing API key';
        throw new AuthenticationError(authMessage, error);

      case 403:
        const forbiddenMessage = data?.message || 'Forbidden - access denied';
        throw new AuthenticationError(forbiddenMessage, error);

      case 429:
        const rateLimitMessage = data?.message || 'Rate limit exceeded';
        const retryAfter = response.headers['retry-after']
          ? parseInt(response.headers['retry-after'])
          : undefined;
        throw new RateLimitError(rateLimitMessage, retryAfter, error);

      case 500:
      case 502:
      case 503:
      case 504:
        const serverMessage = data?.message || `Server error (${status})`;
        throw new ServerError(serverMessage, status, error);

      default:
        const defaultMessage =
          data?.message || `HTTP error ${status}: ${message}`;
        throw new VietmapApiError(defaultMessage, 'HTTP_ERROR', status, error);
    }
  }

  // Handle Zod validation errors (response parsing errors)
  if (error instanceof ZodError) {
    const validationMessage = `Response validation failed: ${error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ')}`;
    throw new ParseError(validationMessage, error.issues, error);
  }

  // Handle generic errors
  if (error instanceof Error) {
    throw new VietmapApiError(error.message, 'UNKNOWN_ERROR', undefined, error);
  }

  // Handle unknown error types
  throw new VietmapApiError('An unknown error occurred', 'UNKNOWN_ERROR');
}
