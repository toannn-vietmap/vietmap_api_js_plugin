import { VietmapApiError } from './vietmap-api-error';

/**
 * Thrown when response data parsing fails
 */
export class ParseError extends VietmapApiError {
  public readonly responseData?: any;

  constructor(
    message = 'Failed to parse response data',
    responseData?: any,
    originalError?: Error,
  ) {
    super(message, 'PARSE_ERROR', undefined, originalError);
    this.name = 'ParseError';
    this.responseData = responseData;
  }
}
