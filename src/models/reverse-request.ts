import { z } from 'zod';
import { latitudeSchema, longitudeSchema } from '../schema';

/**
 * Zod schema for validating ReverseRequest objects
 * @internal
 */
const ReverseRequestSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  apikey: z.string(),
});

/**
 * Request parameters for Vietmap Reverse Geocoding API V3
 *
 * This API converts geographic coordinates (latitude and longitude) into readable addresses
 * and location information. This is the base class for reverse geocoding requests that
 * provides standard functionality for coordinate-to-address conversion.
 *
 * @see {@link https://maps.vietmap.vn/docs/map-api/reverse-version/reverse-ver3.0/ | Reverse Geocoding API V3 Documentation}
 * @see {@link ReverseRequestV4} for the enhanced V4 version with display type support
 *
 * @example
 * ```typescript
 * // Basic reverse geocoding request
 * const request = new ReverseRequest({
 *   latitude: 10.759221,
 *   longitude: 106.675901,
 *   apikey: "your-vietmap-api-key"
 * });
 * ```
 */
export class ReverseRequest {
  /**
   * Latitude coordinate of the location to reverse geocode
   * Must be a valid latitude value between -90 and 90 degrees
   *
   * @example 10.759221 (coordinate in Ho Chi Minh City, Vietnam)
   */
  public latitude: number;

  /**
   * Longitude coordinate of the location to reverse geocode
   * Must be a valid longitude value between -180 and 180 degrees
   *
   * @example 106.675901 (coordinate in Ho Chi Minh City, Vietnam)
   */
  public longitude: number;

  /**
   * API key provided by Vietmap for customer's account
   * Optional in constructor but required for API authentication
   *
   * @example "your-vietmap-api-key-here"
   */
  public apikey?: string;

  constructor({
    latitude,
    longitude,
    apikey,
  }: {
    latitude: number;
    longitude: number;
    apikey?: string;
  }) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.apikey = apikey;
    ReverseRequest.constructorValidator().parse(this);
  }

  public static constructorValidator() {
    return ReverseRequestSchema;
  }
}
