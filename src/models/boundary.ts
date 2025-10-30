import { z } from 'zod';
import { TSJSON } from '../types';

/**
 * Zod schema for validating Boundary objects
 * @internal
 */
export const boundaryResponseSchema = z.object({
  type: z.number(),
  id: z.number(),
  name: z.string(),
  prefix: z.string(),
  full_name: z.string(),
});

/**
 * Represents an administrative boundary division in Vietnam's geographic hierarchy
 *
 * Boundaries define the administrative structure of Vietnamese addresses, including
 * cities, districts, and wards. This class provides information about each level
 * of the administrative hierarchy with unique identifiers, names, and prefixes.
 *
 * The boundary system supports both old format (3 levels: ward, district, city)
 * and new format (2 levels: ward, city) administrative divisions.
 *
 * @see {@link https://maps.vietmap.vn/docs/map-api/geocode-version/geocode-v4/#response-description | Boundaries Documentation}
 *
 * @example
 * ```typescript
 * // City boundary (type 0)
 * const cityBoundary = new Boundary({
 *   type: 0,
 *   id: 12,
 *   name: "Hồ Chí Minh",
 *   prefix: "Thành Phố",
 *   full_name: "Thành Phố Hồ Chí Minh"
 * });
 *
 * // District boundary (type 1)
 * const districtBoundary = new Boundary({
 *   type: 1,
 *   id: 1292,
 *   name: "5",
 *   prefix: "Quận",
 *   full_name: "Quận 5"
 * });
 *
 * // Ward boundary (type 2)
 * const wardBoundary = new Boundary({
 *   type: 2,
 *   id: 656652,
 *   name: "4",
 *   prefix: "Phường",
 *   full_name: "Phường 4"
 * });
 * ```
 */
export class Boundary {
  /**
   * Type of administrative boundary indicating the hierarchical level
   *
   * Boundary type values:
   * - 0: City/Province level (Thành phố/Tỉnh)
   * - 1: District level (Quận/Huyện)
   * - 2: Ward level (Phường/Xã)
   *
   * @example 0 (city), 1 (district), 2 (ward)
   */
  public type: number;

  /**
   * Unique identifier for this administrative boundary
   * Each boundary unit has a distinct ID within the Vietnamese administrative system
   *
   * @example 12 (Ho Chi Minh City), 1292 (District 5), 656652 (Ward 4)
   */
  public id: number;

  /**
   * Short name of the administrative boundary unit
   * Contains only the identifying name without administrative prefix
   *
   * @example "Hồ Chí Minh" (city), "5" (district), "4" (ward)
   */
  public name: string;

  /**
   * Administrative prefix indicating the type of boundary unit
   * Vietnamese administrative prefixes that precede the boundary name
   *
   * Common prefixes:
   * - City level: "Thành Phố", "Tỉnh"
   * - District level: "Quận", "Huyện", "Thị xã"
   * - Ward level: "Phường", "Xã", "Thị trấn"
   *
   * @example "Thành Phố", "Quận", "Phường"
   */
  public prefix: string;

  /**
   * Complete name including administrative prefix and boundary name
   * Provides the full official designation of the administrative unit
   *
   * @example "Thành Phố Hồ Chí Minh", "Quận 5", "Phường 4"
   */
  public full_name: string;

  constructor({
    type,
    id,
    name,
    prefix,
    full_name,
  }: {
    type: number;
    id: number;
    name: string;
    prefix: string;
    full_name: string;
  }) {
    this.type = type;
    this.full_name = full_name;
    this.id = id;
    this.name = name;
    this.prefix = prefix;
  }

  public static constructorValidator() {
    return boundaryResponseSchema;
  }

  public static fromJSON(json: TSJSON): Boundary {
    const validJSON = this.constructorValidator().parse(json);
    return new Boundary(validJSON);
  }
}
