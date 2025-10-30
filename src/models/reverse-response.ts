import { z } from 'zod';
import { TSJSON } from '../types';
import { Boundary, boundaryResponseSchema } from './boundary';

/**
 * Zod schema for validating ReverseResponse objects
 * @internal
 */
const reverseResponseSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  ref_id: z.string(),
  distance: z.number(),
  address: z.string(),
  name: z.string(),
  display: z.string(),
  boundaries: z.array(boundaryResponseSchema),
  categories: z.array(z.string()),
});

/**
 * Response model for Vietmap Reverse Geocoding API V3
 *
 * Contains location information converted from geographic coordinates, including address details,
 * administrative boundaries, and location categories. This is the base response class for
 * reverse geocoding operations that provides standard address and boundary information.
 *
 * @see {@link https://maps.vietmap.vn/docs/map-api/reverse-version/reverse-ver3.0/ | Reverse Geocoding API V3 Documentation}
 * @see {@link ReverseResponseV4} for the enhanced V4 version with additional features
 *
 * @example
 * ```typescript
 * // Example response from reverse geocoding
 * const response = {
 *   lat: 10.759221,
 *   lng: 106.675901,
 *   ref_id: "reverse:123456789",
 *   distance: 0.0000025788,
 *   address: "Phường 4, Quận 5, Thành Phố Hồ Chí Minh",
 *   name: "197 Trần Phú",
 *   display: "197 Trần Phú, Phường 4, Quận 5, Thành Phố Hồ Chí Minh",
 *   boundaries: [...],
 *   categories: ["residential"]
 * };
 * ```
 */
export class ReverseResponse {
  /**
   * Full address including administrative divisions
   * @private
   */
  private readonly _address: string;

  /**
   * Latitude coordinate of the location
   * @private
   */
  private readonly _lat: number;

  /**
   * Longitude coordinate of the location
   * @private
   */
  private readonly _lng: number;

  /**
   * Reference identifier for the location
   * @private
   */
  private readonly _ref_id: string;

  /**
   * Distance from the queried point (in kilometers)
   * @private
   */
  private readonly _distance: number;

  /**
   * Name of the specific location or street address
   * @private
   */
  private readonly _name: string;

  /**
   * Complete display address information
   * @private
   */
  private readonly _display: string;

  /**
   * Array of administrative boundary information
   * @private
   */
  private readonly _boundaries: Boundary[];

  /**
   * Array of categories associated with the location
   * @private
   */
  private readonly _categories: string[];

  constructor({
    address,
    lat,
    lng,
    ref_id,
    distance,
    name,
    display,
    boundaries,
    categories,
  }: {
    address: string;
    lat: number;
    lng: number;
    ref_id: string;
    distance: number;
    name: string;
    display: string;
    boundaries: Boundary[];
    categories: string[];
  }) {
    this._address = address;
    this._lat = lat;
    this._lng = lng;
    this._ref_id = ref_id;
    this._distance = distance;
    this._name = name;
    this._display = display;
    this._boundaries = boundaries;
    this._categories = categories;
  }

  /**
   * Returns the Zod schema validator for ReverseResponse
   * Used internally for runtime validation of constructor arguments
   *
   * @returns The Zod schema for validating reverse geocoding response parameters
   * @internal
   */
  public static constructorValidator() {
    return reverseResponseSchema;
  }

  /**
   * Creates a ReverseResponse instance from JSON data
   *
   * Validates the incoming JSON against the expected schema and creates a properly
   * typed response object with immutable properties accessed via getters.
   *
   * @param json - Raw JSON response from the Vietmap Reverse Geocoding API V3
   * @returns A validated ReverseResponse instance
   *
   * @throws {z.ZodError} When the JSON doesn't match the expected response schema
   */
  public static fromJSON(json: TSJSON) {
    const validJSON = this.constructorValidator().parse(json);
    return new ReverseResponse(validJSON);
  }

  /**
   * Gets the full address including administrative divisions
   * Contains ward, district, and city information formatted for Vietnam
   *
   * @returns The complete address string
   * @example "Phường 4, Quận 5, Thành Phố Hồ Chí Minh"
   */
  public get address(): string {
    return this._address;
  }

  /**
   * Gets the complete display address information
   * Combines location name with full address for user presentation
   *
   * @returns The formatted display address
   * @example "197 Trần Phú, Phường 4, Quận 5, Thành Phố Hồ Chí Minh"
   */
  public get display(): string {
    return this._display;
  }

  /**
   * Gets the reference identifier for the location
   * Unique ID that can be used with other Vietmap APIs (e.g., Place API)
   *
   * @returns The location reference ID
   * @example "reverse:123456789"
   */
  public get ref_id(): string {
    return this._ref_id;
  }

  /**
   * Gets the array of administrative boundary information
   * Contains hierarchical geographic divisions (ward, district, city) with IDs and names
   *
   * @returns Array of Boundary objects representing administrative divisions
   * @example
   * ```typescript
   * [
   *   { type: 2, id: 656652, name: "4", prefix: "Phường", full_name: "Phường 4" },
   *   { type: 1, id: 1292, name: "5", prefix: "Quận", full_name: "Quận 5" },
   *   { type: 0, id: 12, name: "Hồ Chí Minh", prefix: "Thành Phố", full_name: "Thành Phố Hồ Chí Minh" }
   * ]
   * ```
   */
  public get boundaries(): Boundary[] {
    return this._boundaries;
  }

  /**
   * Gets the name of the specific location or street address
   * Usually contains the street number and street name
   *
   * @returns The location or street name
   * @example "197 Trần Phú"
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Gets the latitude coordinate of the location
   * Geographic coordinate in decimal degrees
   *
   * @returns The latitude value
   * @example 10.759221
   */
  public get lat(): number {
    return this._lat;
  }

  /**
   * Gets the longitude coordinate of the location
   * Geographic coordinate in decimal degrees
   *
   * @returns The longitude value
   * @example 106.675901
   */
  public get lng(): number {
    return this._lng;
  }

  /**
   * Gets the distance from the queried point
   * Measured in kilometers, indicates precision of the reverse geocoding result
   *
   * @returns The distance in kilometers
   * @example 0.0000025788 (approximately 2.6 meters)
   */
  public get distance(): number {
    return this._distance;
  }

  /**
   * Gets the array of categories associated with the location
   * Provides classification information about the location type
   *
   * @returns Array of category strings
   * @example ["residential"], ["commercial", "retail"], ["transportation"]
   */
  public get categories(): string[] {
    return this._categories;
  }
}
