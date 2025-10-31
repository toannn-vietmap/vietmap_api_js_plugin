import { z } from 'zod';

/**
 * Zod schema for validating PlaceRequest objects
 * @internal
 */
const placeRequestSchema = z.object({
  refId: z.string(),
  apikey: z.string(),
});

/**
 * Request parameters for Vietmap Place API V4
 *
 * The Place API provides detailed information about a specific location using its
 * unique reference identifier (refid). This API retrieves comprehensive address
 * details, coordinates, and administrative information for places found through
 * search or geocoding operations.
 *
 * @see {@link https://maps.vietmap.vn/docs/map-api/place-v4/ | Place API V4 Documentation}
 *
 * @example
 * ```typescript
 * // Basic place details request
 * const request = new PlaceRequest({
 *   refId: "auto:RAkPcicmZ3d-NQhac2kADHYlbFAkBiEeAQAkCV0EXwdF_KakgoWOrg0FFWZfh4jFXA1kXfbZFlNRGFUYCAJXAF8BUQBVCAZUC18EA1VMAwUYXwJQBBQFBQVTHVFacANBQlU",
 *   apikey: "your-vietmap-api-key"
 * });
 *
 * // Using ref_id from search/geocode response
 * const searchResponse = await searchAPI.search(...);
 * const placeRequest = new PlaceRequest({
 *   refId: searchResponse[0].ref_id,
 *   apikey: "your-vietmap-api-key"
 * });
 * ```
 */
export class PlaceRequest {
  /**
   * Unique reference identifier for the place
   *
   * This identifier is typically obtained from search, geocoding, or reverse geocoding
   * API responses. The refid format varies depending on the source API and display type
   * used to generate it.
   *
   * @example
   * - "auto:RAkPcicmZ3d-NQhac2kADHYlbFAkBiEeAQAkCV0EXwdF_KakgoWOrg0FFWZfh4jFXA1kXfbZFlNRGFUYCAJXAF8BUQBVCAZUC18EA1VMAwUYXwJQBBQFBQVTHVFacANBQlU"
   * - "geocode:RAkPcicmZ3d-NQhac2kADHYlbFAkBiEeAQAkCV0EXwdFbESDiMNbEzMK9ogWVwJMBRgNBwdRFFZWBlIdAQZcCVcFUB5TDwNbAlYDClJSBQIdVQk2QFhR"
   */
  public refId: string;

  /**
   * API key provided by Vietmap for customer's account
   * Required for authentication with the Place API V4
   *
   * @example "your-vietmap-api-key-here"
   */
  public apikey?: string;

  constructor({ refId, apikey }: { refId: string; apikey?: string }) {
    this.refId = refId;
    this.apikey = apikey;

    PlaceRequest.constructorValidator().parse(this);
  }

  public static constructorValidator() {
    return placeRequestSchema;
  }
}
