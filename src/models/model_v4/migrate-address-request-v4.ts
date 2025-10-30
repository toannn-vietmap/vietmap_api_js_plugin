import { Latitude, Longitude } from 'types';
import { MigrateType } from '../../types/result-display.type';
import { z } from 'zod';

/**
 * Zod schema for validating MigrateAddressRequestV4 objects
 * @internal
 */
const migrateAddressRequestV4Schema = z.object({
  apikey: z.string(),
  text: z.string(),
  migrate_type: z.nativeEnum(MigrateType).optional(),
  focus: z.string().optional(),
});

/**
 * Request parameters for Vietmap Address Migration API V4
 * 
 * This API allows conversion between old and new Vietnamese address formats.
 * It can migrate from old format (e.g., "197 tran phu p4 q5") to new standardized format
 * (e.g., "197 Trần Phú, Phường 4, Quận 5, Thành phố Hồ Chí Minh") and vice versa.
 * 
 * @see {@link https://maps.vietmap.vn/docs/migrate-address/migrate-address-docs/ | Migrate Address API Documentation}
 * 
 * @example
 * ```typescript
 * // Migrate from old to new format (default)
 * const request = new MigrateAddressRequestV4({
 *   apikey: "your-vietmap-api-key",
 *   text: "197 tran phu p4 q5"
 * });
 * 
 * // Migrate from new to old format (requires focus coordinate)
 * const request2 = new MigrateAddressRequestV4({
 *   apikey: "your-vietmap-api-key",
 *   text: "197 Trần Phú, Phường Chợ Quán, Thành phố Hồ Chí Minh",
 *   focus: [10.758867, 106.675566],
 *   migrate_type: MigrateType.NEW_TO_OLD
 * });
 * ```
 */
export class MigrateAddressRequestV4 {
  /**
   * API key provided by Vietmap for customer's account
   * Required for authentication with the Migrate Address API
   * 
   * @example "your-vietmap-api-key-here"
   */
  public apikey: string;

  /**
   * Specify the center of the search context as lat,lng coordinates
   * Required when migrate_type = 2 (NEW_TO_OLD conversion)
   * This helps provide geographic context for address disambiguation
   * 
   * @example "10.758867,106.675566" (coordinates for Ho Chi Minh City center)
   */
  public focus?: string;

  /**
   * Address input text in either old or new format
   * The address format to be migrated
   * 
   * @example 
   * - Old format: "197 tran phu p4 q5"
   * - New format: "197 Trần Phú, Phường 4, Quận 5, Thành phố Hồ Chí Minh"
   */
  public text: string;

  /**
   * Migration type specifying the direction of conversion
   * - OLD_TO_NEW (1): Convert from old format to new standardized format (default)
   * - NEW_TO_OLD (2): Convert from new format to old format (requires focus parameter)
   * 
   * @default MigrateType.OLD_TO_NEW
   * @example MigrateType.OLD_TO_NEW or MigrateType.NEW_TO_OLD
   */
  public migrate_type?: MigrateType;

  constructor({
    apikey,
    text,
    focus,
    migrate_type,
  }: {
    apikey: string;
    text: string;
    focus?: [Latitude, Longitude];
    migrate_type?: MigrateType;
  }) {
    this.apikey = apikey;
    this.text = text;
    this.focus = focus ? `${focus[0]},${focus[1]}` : undefined;
    this.migrate_type = migrate_type;
    this.constructorValidatorV4().parse(this);
  }

  constructorValidatorV4() {
    if (
      this.migrate_type !== undefined &&
      this.migrate_type !== null &&
      this.migrate_type === 2
    ) {
      return z.object({
        apikey: z.string(),
        text: z.string(),
        migrate_type: z.literal(MigrateType.NEW_TO_OLD),
        focus: z.string(),
      });
    }
    return migrateAddressRequestV4Schema;
  }
}
