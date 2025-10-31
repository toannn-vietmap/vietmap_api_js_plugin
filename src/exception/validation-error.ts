import { VietmapApiError } from './vietmap-api-error';

/**
 * Thrown when request parameters are invalid (400 Bad Request)
 */
export class ValidationError extends VietmapApiError {
  public readonly field?: string;

  public readonly value?: any;

  constructor(
    message = 'Request validation failed',
    field?: string,
    value?: any,
    originalError?: Error,
  ) {
    super(message, 'VALIDATION_ERROR', 400, originalError);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}
