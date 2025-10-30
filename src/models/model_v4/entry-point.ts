import { z } from 'zod';

/**
 * Zod schema for validating EntryPoint objects
 * @internal
 */
export const entryPointSchema = z.object({
  ref_id: z.string(),
  name: z.string(),
});

/**
 * Represents an entry point for a location, typically used for buildings or complexes
 * with multiple access points. This is commonly found in geocoding responses for
 * places like shopping malls, office buildings, or residential complexes.
 *
 * @example
 * ```typescript
 * const entryPoint = new EntryPoint({
 *   ref_id: "geocode:123456...",
 *   name: "197 Tran Phu, Ward 4, District 5, Ho Chi Minh City, Vietnam"
 * });
 * ```
 */
export class EntryPoint {
  /**
   * Unique reference identifier for the entry point
   * This ID can be used to reference the specific entrance or access point
   *
   * @example "entrance_001", "gate_A", "lobby_main"
   */
  public ref_id: string;

  /**
   * Human-readable name of the entry point
   * Describes the entrance or access point in a user-friendly format
   *
   * @example "Main Entrance", "Side Gate", "Parking Entrance", "Emergency Exit"
   */
  public name: string;

  /**
   * Creates a new EntryPoint instance
   *
   * @param params - The entry point parameters
   * @param params.ref_id - Unique reference identifier for the entry point
   * @param params.name - Human-readable name of the entry point
   *
   * @throws {z.ZodError} When the provided parameters don't match the expected schema
   *
   * @example
   * ```typescript
   * const entryPoint = new EntryPoint({
   *   ref_id: "geocode:123456...",
   *   name: "197 Tran Phu, Ward 4, District 5, Ho Chi Minh City, Vietnam"
   * });
   * ```
   */
  constructor({ ref_id, name }: { ref_id: string; name: string }) {
    this.ref_id = ref_id;
    this.name = name;
    EntryPoint.constructorValidator().parse(this);
  }

  /**
   * Returns the Zod schema validator for EntryPoint constructor parameters.
   * Used internally for runtime validation of the constructor arguments
   *
   * @returns The Zod schema for validating EntryPoint objects
   * @internal
   */
  public static constructorValidator() {
    return entryPointSchema;
  }
}
