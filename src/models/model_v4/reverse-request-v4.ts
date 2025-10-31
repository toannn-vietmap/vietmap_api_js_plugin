import { z } from 'zod';
import { latitudeSchema, longitudeSchema } from '../../schema';
import { ReverseDisplayType } from '../../types/result-display.type';
import { ReverseRequest } from '../reverse-request';

/**
 * Zod schema for validating ReverseRequestV4 objects
 * @internal
 */
const reverseRequestV4Schema = z.object({
  lat: latitudeSchema,
  lng: longitudeSchema,
  apikey: z.string(),
  display_type: z.nativeEnum(ReverseDisplayType).optional(),
});

/**
 * Request parameters for Vietmap Reverse Geocoding API V4
 *
 * This API converts geographic coordinates (latitude and longitude) into readable addresses
 * and location information. V4 introduces support for different display formats including
 * both old and new Vietnamese administrative divisions format.
 *
 * @see {@link https://maps.vietmap.vn/docs/map-api/reverse-version/reverse-v4/ | Reverse Geocoding API V4 Documentation}
 *
 * @example
 * ```typescript
 * // With specific display type (old format)
 * const requestOldFormat = new ReverseRequestV4({
 *   lat: 10.759221,
 *   lng: 106.675901,
 *   apikey: "your-vietmap-api-key",
 *   displayType: ReverseDisplayType.OLD_FORMAT
 * });
 * ```
 */
export class ReverseRequestV4 extends ReverseRequest {
  /**
   * Result display type controlling the format and structure of the response
   *
   * Display type options:
   * - NEW_FORMAT (1): New merged administrative format (2 levels: ward, city)
   * - OLD_FORMAT (2): Old administrative format (3 levels: ward, district, city)
   * - TWO_OBJECTS (4): Returns both formats as two items in the response array
   * - BOTH_NEW_AND_OLD (5): Returns new-format object with old-format in data_old property
   * - BOTH_OLD_AND_NEW (6): Returns old-format object with new-format in data_new property
   *
   * @default ReverseDisplayType.NEW_FORMAT
   *
   * @example ReverseDisplayType.NEW_FORMAT, ReverseDisplayType.BOTH_NEW_AND_OLD
   */
  public displayType?: ReverseDisplayType;

  /**
   * Latitude coordinate of the location to reverse geocode
   * Must be a valid latitude value between -90 and 90 degrees
   *
   * @example 10.759221 (coordinate in Ho Chi Minh City, Vietnam)
   */
  public lat?: number;

  /**
   * Longitude coordinate of the location to reverse geocode
   * Must be a valid longitude value between -180 and 180 degrees
   *
   * @example 106.675901 (coordinate in Ho Chi Minh City, Vietnam)
   */
  public lng?: number;

  /**
   * Creates a new ReverseRequestV4 instance
   *
   * @param params - The reverse geocoding request parameters
   * @param params.lat - Latitude coordinate of the desired location
   * @param params.lng - Longitude coordinate of the desired location
   * @param params.apikey - Optional API key provided by Vietmap (inherited from parent)
   * @param params.displayType - Optional result display format type
   *
   * @throws {z.ZodError} When the provided parameters don't match the expected schema
   * @throws {z.ZodError} When latitude is not between -90 and 90 degrees
   * @throws {z.ZodError} When longitude is not between -180 and 180 degrees
   *
   * @example
   * ```typescript
   * // Basic reverse geocoding request
   * const request = new ReverseRequestV4({
   *   lat: 10.759221,
   *   lng: 106.675901,
   *   apikey: "your-api-key"
   * });
   * ```
   */
  constructor({
    lat,
    lng,
    apikey,
    displayType,
  }: {
    lat: number;
    lng: number;
    apikey?: string;
    displayType?: ReverseDisplayType;
  }) {
    super({ latitude: lat, longitude: lng, apikey });
    this.displayType = displayType;
    this.lat = lat;
    this.lng = lng;
    ReverseRequestV4.constructorValidatorV4().parse(this);
  }

  /**
   * Returns the Zod schema validator for ReverseRequestV4
   * Used internally for runtime validation of constructor arguments
   *
   * @returns The Zod schema for validating reverse geocoding request parameters
   * @internal
   */
  public static constructorValidatorV4() {
    return reverseRequestV4Schema;
  }
}
