import { z } from 'zod';
import { TSJSON } from '../types';
import { Boundary, boundaryResponseSchema } from './boundary';

/**
 * Zod schema for validating SearchResponse objects
 * @internal
 */
const searchResponseSchema = z.object({
  ref_id: z.string(),
  address: z.string(),
  name: z.string(),
  display: z.string(),
  boundaries: z.array(boundaryResponseSchema),
  categories: z.array(z.string()),
});

/**
 * Response model for Vietmap Search API (Geocoding V3)
 *
 * Contains detailed information about a location found through the search API.
 * The Search API returns up to 10 places matching the search criteria, each
 * represented by a SearchResponse object with comprehensive location data.
 *
 * Each response includes a reference ID for detailed Place API queries,
 * administrative boundary information following Vietnam's hierarchical system
 * (city/province → district → ward), and POI categorization for filtering.
 *
 * The distance field (when available) shows proximity to the focus coordinates
 * provided in the search request, helping prioritize results by relevance.
 *
 * @see {@link https://maps.vietmap.vn/docs/map-api/geocode-version/geocode-ver3.0/ | Search API V3 Documentation}
 * @see {@link https://maps.vietmap.vn/docs/map-api/place/ | Place API for detailed information}
 *
 * @example
 * ```typescript
 * // Example response from searching "Công Ty Cổ Phần Ứng Dụng Bản Đồ Việt"
 * const response = {
 *   ref_id: "vm:POI:7057AB748BFD685B",
 *   address: "197 Đường Trần Phú,Phường 4,Quận 5,Thành Phố Hồ Chí Minh",
 *   name: "Công Ty Cổ Phần Ứng Dụng Bản Đồ Việt",
 *   display: "Công Ty Cổ Phần Ứng Dụng Bản Đồ Việt 197 Đường Trần Phú,Phường 4,Quận 5,Thành Phố Hồ Chí Minh",
 *   boundaries: [
 *     { type: 2, name: "4", prefix: "Phường", full_name: "Phường 4" },
 *     { type: 1, name: "5", prefix: "Quận", full_name: "Quận 5" },
 *     { type: 0, name: "Hồ Chí Minh", prefix: "Thành Phố", full_name: "Thành Phố Hồ Chí Minh" }
 *   ],
 *   categories: ["6001"]
 * };
 * ```
 */
export class SearchResponse {
  /**
   * Reference ID for the Point of Interest (POI)
   *
   * Unique identifier used for retrieving detailed information from the Vietmap Place API.
   * The format typically follows "vm:POI:{hash}" for points of interest or "vm:ADDRESS:{hash}"
   * for address locations. This ID is essential for getting complete location details.
   *
   * @example "vm:POI:7057AB748BFD685B", "vm:ADDRESS:8D92EB120DDE9996"
   */
  public ref_id: string;

  /**
   * Full address including street, ward, district, and city
   *
   * Contains the complete Vietnamese address following the standard format:
   * Street Number + Street Name + Ward + District + City/Province.
   * Uses proper Vietnamese administrative division terminology.
   *
   * @example "197 Đường Trần Phú,Phường 4,Quận 5,Thành Phố Hồ Chí Minh"
   */
  public address: string;

  /**
   * Name of the Point of Interest (POI) or location
   *
   * The primary name or business name associated with this location.
   * For addresses without specific POI names, this may be empty or contain
   * the street address information.
   *
   * @example "Công Ty Cổ Phần Ứng Dụng Bản Đồ Việt", "Bệnh viện Chợ Rẫy", "Nhà hàng ABC"
   */
  public name: string;

  /**
   * Display name containing detailed information for presentation
   *
   * Combines the POI name with address information in a user-friendly format
   * suitable for display in search results, maps, or user interfaces.
   * Provides the most comprehensive human-readable location identifier.
   *
   * @example "Công Ty Cổ Phần Ứng Dụng Bản Đồ Việt 197 Đường Trần Phú,Phường 4,Quận 5,Thành Phố Hồ Chí Minh"
   */
  public display: string;

  /**
   * Array containing administrative boundary information
   *
   * Represents the hierarchical administrative divisions in Vietnam following the
   * standard structure: Ward (type 2) → District (type 1) → City/Province (type 0).
   * Each boundary includes ID, name, prefix, and full name for precise location context.
   *
   * @example Array with ward, district, and city boundary objects
   */
  public boundaries: Boundary[];

  /**
   * Array of POI category codes associated with this location
   *
   * Contains category identifiers that classify the type of business or location.
   * Categories help filter search results and understand the nature of the POI.
   * Refer to Vietmap POI Categories documentation for complete category list.
   *
   * @see {@link https://maps.vietmap.vn/docs/map-api/geocode-version/geocode-ver3.0/#response-description | POI Categories Documentation}
   * @example ["6001"] (business/office), ["1002-1"] (restaurant), ["3001"] (hospital)
   */
  public categories: string[];

  constructor({
    ref_id,
    address,
    name,
    display,
    boundaries,
    categories,
  }: {
    ref_id: string;
    address: string;
    name: string;
    display: string;
    boundaries: Boundary[];
    categories: string[];
  }) {
    this.ref_id = ref_id;
    this.address = address;
    this.name = name;
    this.display = display;
    this.boundaries = boundaries;
    this.categories = categories;
  }

  /**
   * Returns the Zod schema validator for SearchResponse objects
   *
   * Used internally to validate that search response data matches the expected
   * structure and types before creating SearchResponse instances.
   */
  public static constructorValidator() {
    return searchResponseSchema;
  }

  /**
   * Creates a SearchResponse instance from raw JSON data
   *
   * Validates the JSON response from the Vietmap Search API and creates a properly
   * typed SearchResponse object. Throws validation errors if the response doesn't
   * match the expected schema.
   *
   * @param json - Raw JSON response from the Vietmap Search API V3
   * @returns A validated SearchResponse instance
   *
   * @throws {z.ZodError} When the JSON doesn't match the expected response schema
   */
  public static fromJSON(json: TSJSON): SearchResponse {
    const validJSON = this.constructorValidator().parse(json);
    return new SearchResponse(validJSON);
  }
}
