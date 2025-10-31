import { z } from 'zod';
import { ZodType } from 'zod/v4';
import { TSJSON } from '../../types';
import { Boundary, boundaryResponseSchema } from '../boundary';
import { SearchResponse } from '../search-response';
import { EntryPoint, entryPointSchema } from './entry-point';

/**
 * Returns the Zod schema validator for SearchResponseV4
 * Used internally for runtime validation of constructor arguments and JSON parsing
 *
 * @returns The Zod schema for validating search response parameters
 * @internal
 */
const searchResponseV4Schema = z.object({
  ref_id: z.string(),
  address: z.string(),
  name: z.string(),
  display: z.string(),
  boundaries: z.array(boundaryResponseSchema),
  categories: z.array(z.string()),
  distance: z.number().optional(),
  entry_points: z.array(entryPointSchema).optional(),
  data_old: z
    .lazy(() => searchResponseV4Schema)
    .nullable()
    .optional(),
  data_new: z
    .lazy(() => searchResponseV4Schema)
    .nullable()
    .optional(),
});

/**
 * Response model for Vietmap Search/Autocomplete API V4
 *
 * Contains location information found by search query, including address details,
 * administrative boundaries, and optional entry points. The API responds with a list
 * containing up to 10 places that match the search criteria.
 *
 * @see {@link https://maps.vietmap.vn/docs/map-api/geocode-version/geocode-v4/#response-description | API Response Documentation}
 *
 * @example
 * ```typescript
 * // Example response with new format (display_type=1)
 * const response = {
 *   ref_id: "geocode:RAkPcicmZ3d-NQhac2kADHYlbFAkBiEeAQAkCV0EXwdFbESDiMNbEzMK9ogWVwJMBRgNBwdRFFZWBlIdAQZcCVcFUB5TDwNbAlYDClJSBQIdVQk2QFhR",
 *   distance: 0.06911172534949989,
 *   address: "Phường 4,Quận 5,Thành Phố Hồ Chí Minh",
 *   name: "197 Trần Phú",
 *   display: "197 Trần Phú Phường 4,Quận 5,Thành Phố Hồ Chí Minh",
 *   boundaries: [...],
 *   categories: [],
 *   entry_points: [],
 *   data_new: { ... } // Contains alternate format data
 * };
 * ```
 */
export class SearchResponseV4 extends SearchResponse {
  /**
   * Distance from the search focus point to this result
   * Measured in kilometers, helps rank results by proximity
   *
   * @example 0.06911172534949989 (approximately 69 meters from focus point)
   */
  public distance?: number;

  /**
   * Array containing entry point information for this location
   *
   * Entry points provide specific access points or entrances for buildings,
   * complexes, or locations with multiple points of interest. Available for
   * special addresses like airports, hotels, shopping malls, etc.
   *
   * @see {@link https://maps.vietmap.vn/docs/map-api/autocomplete-version/autocomplete-v4/#response-description | Autocomplete API V4} for detailed entry point information
   *
   * @example
   * ```typescript
   * [
   *   { ref_id: "entrance_main", name: "Main Entrance" },
   *   { ref_id: "entrance_parking", name: "Parking Entrance" }
   * ]
   * ```
   */
  public entry_points?: EntryPoint[];

  /**
   * Location object in the old administrative format (3 levels: ward, district, city)
   *
   * Available when using hybrid display types (display_type=5) that return the new format
   * at top level and provide the old format as an alternative. Contains the same structure
   * as the main response but with the traditional 3-level administrative divisions.
   *
   * Will be null for non-hybrid display types or when old format is not available.
   */
  public data_old?: SearchResponseV4;

  /**
   * Location object in the new merged administrative format (2 levels: ward, city)
   *
   * Available when using hybrid display types (display_type=6) that return the old format
   * at top level and provide the new format as an alternative. Contains the same structure
   * as the main response but with the modernized 2-level administrative divisions.
   *
   * Will be null for non-hybrid display types or when new format is not available.
   */
  public data_new?: SearchResponseV4;

  constructor({
    ref_id,
    address,
    name,
    display,
    boundaries,
    categories,
    distance,
    entry_points,
    data_old,
    data_new,
  }: {
    ref_id: string;
    address: string;
    name: string;
    display: string;
    boundaries: Boundary[];
    categories: string[];
    distance?: number;
    entry_points?: EntryPoint[];
    data_old?: SearchResponseV4;
    data_new?: SearchResponseV4;
  }) {
    super({ ref_id, address, name, display, boundaries, categories });
    this.distance = distance;
    this.entry_points = entry_points;
    this.data_old = data_old;
    this.data_new = data_new;
    SearchResponseV4.constructorValidatorV4().parse(this);
  }

  public static constructorValidatorV4() {
    return searchResponseV4Schema;
  }

  public static fromJson(json: TSJSON): SearchResponseV4 {
    const validJSON = this.constructorValidatorV4().parse(json);
    return new SearchResponseV4(validJSON);
  }

  override toString(): string {
    return `SearchResponseV4(ref_id=${this.ref_id}, name=${this.name}, address=${this.address})`;
  }
}
