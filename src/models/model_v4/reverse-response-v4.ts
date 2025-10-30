import { ReverseResponse } from '../reverse-response';
import { EntryPoint, entryPointSchema } from './entry-point';
import { Boundary } from '../boundary';
import { z } from 'zod';
import { boundaryResponseSchema } from '../boundary';
import { TSJSON } from 'types';

/**
 * Zod schema validator for ReverseResponseV4
 * Used internally for runtime validation of constructor arguments and JSON parsing
 *
 * @returns The Zod schema for validating reverse geocoding response parameters
 * @internal
 */
const reverseResponseV4Schema = z.object({
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  ref_id: z.string().optional(),
  distance: z.number().optional(),
  name: z.string().optional(),
  display: z.string().optional(),
  boundaries: z.array(boundaryResponseSchema).optional(),
  categories: z.array(z.string()).optional(),
  entry_points: z.array(entryPointSchema).optional(),
  data_old: z
    .lazy(() => reverseResponseV4Schema)
    .nullable()
    .optional(),
  data_new: z
    .lazy(() => reverseResponseV4Schema)
    .nullable()
    .optional(),
});

/**
 * Response model for Vietmap Reverse Geocoding API V4
 *
 * Contains location information converted from geographic coordinates, including address details,
 * administrative boundaries, and optional entry points. V4 supports multiple display formats
 * and can include both old and new Vietnamese administrative division formats.
 *
 * @see {@link https://maps.vietmap.vn/docs/map-api/reverse-version/reverse-v4/#response-description | API Response Documentation}
 *
 * @example
 * ```typescript
 * // Example response with new format (display_type=1)
 * const response = {
 *   lat: 10.759221,
 *   lng: 106.675901,
 *   ref_id: "vm:ADDRESS:MM03541B04565B07001C5D035204030202005A1D535A075B1A116417D3DC9208103550F5D80930474606",
 *   distance: 2.5788156956946213E-06,
 *   address: "Phường 4,Quận 5,Thành Phố Hồ Chí Minh",
 *   name: "197 Trần Phú",
 *   display: "197 Trần Phú Phường 4,Quận 5,Thành Phố Hồ Chí Minh",
 *   boundaries: [...],
 *   categories: [],
 *   entry_points: [],
 *   data_old: null,
 *   data_new: { ... } // Contains alternate format data
 * };
 * ```
 */
export class ReverseResponseV4 extends ReverseResponse {
  /**
   * Array containing entry point information for the location
   *
   * Entry points provide specific access points or entrances for buildings,
   * complexes, or locations with multiple points of interest. Each entry point
   * contains a reference ID and descriptive name.
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
  public data_old?: ReverseResponseV4;

  /**
   * Location object in the new merged administrative format (2 levels: ward, city)
   *
   * Available when using hybrid display types (display_type=6) that return the old format
   * at top level and provide the new format as an alternative. Contains the same structure
   * as the main response but with the modernized 2-level administrative divisions.
   *
   * Will be null for non-hybrid display types or when new format is not available.
   */
  public data_new?: ReverseResponseV4;

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
    entry_points,
    data_old,
    data_new,
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
    entry_points?: EntryPoint[];
    data_old?: ReverseResponseV4;
    data_new?: ReverseResponseV4;
  }) {
    super({
      address,
      lat,
      lng,
      ref_id,
      distance,
      name,
      display,
      boundaries,
      categories,
    });
    this.entry_points = entry_points;
    this.data_old = data_old;
    this.data_new = data_new;
  }

  public static constructorValidatorV4() {
    return reverseResponseV4Schema;
  }

  public static fromJSON(json: TSJSON): ReverseResponseV4 {
    const validJSON = this.constructorValidatorV4().parse(json);
    return new ReverseResponseV4(validJSON);
  }
}
