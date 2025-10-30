import { TSJSON } from '../../types';
import { Boundary, boundaryResponseSchema } from '../boundary';
import { z } from 'zod';

/**
 * Zod schema for validating MigrateAddressResponseV4 objects
 * @internal
 */
const migrateAddressResponseV4Schema = z.object({
  address: z.string().optional(),
  name: z.string().optional(),
  display: z.string().optional(),
  boundaries: z.array(boundaryResponseSchema).optional(),
});

/**
 * Response model for Vietmap Address Migration API V4
 *
 * Contains the migrated address information along with administrative boundary details.
 * The response provides both the converted address format and structured boundary data
 * that can be used for further geographic processing.
 *
 * @see {@link https://maps.vietmap.vn/docs/migrate-address/migrate-address-docs/#response-description | API Response Documentation}
 *
 * @example
 * ```typescript
 * // Example response for old-to-new migration
 * const response = {
 *   address: "Phường 4,Quận 5,Thành Phố Hồ Chí Minh",
 *   name: "197 Trần Phú",
 *   display: "197 Trần Phú Phường 4,Quận 5,Thành Phố Hồ Chí Minh",
 *   boundaries: [
 *     { type: 2, id: 656652, name: "4", prefix: "Phường", full_name: "Phường 4" },
 *     { type: 1, id: 1292, name: "5", prefix: "Quận", full_name: "Quận 5" },
 *     { type: 0, id: 12, name: "Hồ Chí Minh", prefix: "Thành Phố", full_name: "Thành Phố Hồ Chí Minh" }
 *   ]
 * };
 * ```
 */
export class MigrateAddressResponseV4 {
  /**
   * Full address including street, ward, district, and city information
   * Contains the administrative divisions in the migrated format
   *
   * @example
   * - "Phường 4,Quận 5,Thành Phố Hồ Chí Minh" (new format)
   * - "Phường Chợ Quán,Thành Phố Hồ Chí Minh" (old format)
   */
  public address?: string;

  /**
   * Name or number of the specific Point of Interest (POI) or address
   * Usually contains the street number and street name
   *
   * @example
   * - "197 Trần Phú" (standardized format)
   * - "197 tran phu" (non-standardized format)
   */
  public name?: string;

  /**
   * Complete display address combining name and address parts
   * Provides the full formatted address suitable for display to users
   *
   * @example "197 Trần Phú Phường 4,Quận 5,Thành Phố Hồ Chí Minh"
   */
  public display?: string;

  /**
   * Array containing administrative boundary information
   * Includes hierarchical geographic divisions (ward, district, city)
   * with their IDs, names, and administrative prefixes
   *
   * Each boundary object contains:
   * - type: 0 (city), 1 (district), 2 (ward)
   * - id: unique identifier
   * - name: administrative unit name
   * - prefix: administrative prefix (e.g., "Phường", "Quận", "Thành Phố")
   * - full_name: complete name with prefix
   *
   * @example
   * ```typescript
   * [
   *   { type: 2, id: 656652, name: "4", prefix: "Phường", full_name: "Phường 4" },
   *   { type: 1, id: 1292, name: "5", prefix: "Quận", full_name: "Quận 5" }
   * ]
   * ```
   */
  public boundaries?: Boundary[];

  /**
   * Creates a new MigrateAddressResponseV4 instance
   *
   * @param params - The migration response parameters
   * @param params.address - Optional full address with administrative divisions
   * @param params.name - Optional POI/address name
   * @param params.display - Optional complete display address
   * @param params.boundaries - Optional array of administrative boundary information
   *
   * @throws {z.ZodError} When the provided parameters don't match the expected schema
   *
   * @example
   * ```typescript
   * const response = new MigrateAddressResponseV4({
   *   address: "Phường 4,Quận 5,Thành Phố Hồ Chí Minh",
   *   name: "197 Trần Phú",
   *   display: "197 Trần Phú Phường 4,Quận 5,Thành Phố Hồ Chí Minh",
   *   boundaries: [
   *     new Boundary({ type: 2, id: 656652, name: "4", prefix: "Phường", full_name: "Phường 4" })
   *   ]
   * });
   * ```
   */
  constructor({
    address,
    name,
    display,
    boundaries,
  }: {
    address?: string;
    name?: string;
    display?: string;
    boundaries?: Boundary[];
  }) {
    this.address = address;
    this.name = name;
    this.display = display;
    this.boundaries = boundaries;
    MigrateAddressResponseV4.constructorValidation().parse(this);
  }

  /**
   * Returns the Zod schema validator for MigrateAddressResponseV4
   * Used internally for runtime validation of constructor arguments
   *
   * @returns The Zod schema for validating response parameters
   * @internal
   */
  public static constructorValidation() {
    return migrateAddressResponseV4Schema;
  }

  public static fromJSON(json: TSJSON): MigrateAddressResponseV4 {
    const validJSON = this.constructorValidation().parse(json);
    return new MigrateAddressResponseV4(validJSON);
  }
}
