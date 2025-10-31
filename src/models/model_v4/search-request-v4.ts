import { z } from 'zod';
import { layers } from '../../types/layer.type';
import { SearchDisplayType } from '../../types/result-display.type';
import { SearchRequest } from '../search-request';

/**
 * Zod schema for validating SearchRequestV4 objects
 * @internal
 */
const searchRequestV4Schema = z.object({
  text: z.string(),
  apiKey: z.string(),
  focus: z.string().optional(),
  displayType: z.nativeEnum(SearchDisplayType).optional(),
  layers: z.nativeEnum(layers).optional(),
  circleCenter: z.number().optional(),
  circleRadius: z.number().optional(),
  cats: z.string().optional(),
  cityId: z.number().optional(),
  wardId: z.number().optional(),
  distId: z.number().optional(),
});

/**
 * Request parameters for Vietmap Search/Autocomplete API V4
 *
 * This API provides powerful location search functionality with intelligent algorithms
 * for accurate and speedy results. V4 introduces support for different display formats
 * including both old and new Vietnamese administrative division formats.
 *
 * @see {@link https://maps.vietmap.vn/docs/map-api/geocode-version/geocode-v4/ | Search/Autocomplete API V4 Documentation}
 *
 * @example
 * ```typescript
 * // Basic location search
 * const request = new SearchRequestV4({
 *   text: "197 Trần Phú, phường 4, quận 5, thành phố Hồ Chí Minh",
 *   apikey: "your-vietmap-api-key"
 * });
 *
 * // Search with focus coordinates and specific display type
 * const requestWithFocus = new SearchRequestV4({
 *   text: "Công Ty Cổ Phần Ứng Dụng Bản Đồ Việt",
 *   apikey: "your-vietmap-api-key",
 *   focus: [10.759540242, 106.67660114],
 *   displayType: SearchDisplayType.NEW_FORMAT
 * });
 *
 * // Search within a geographic area with filters
 * const areaSearch = new SearchRequestV4({
 *   text: "coffee shop",
 *   apikey: "your-vietmap-api-key",
 *   layers: layers.POI,
 *   circleCenter: 10.758867051669924,
 *   circleRadius: 200,
 *   cats: "1002-1"
 * });
 * ```
 */
export class SearchRequestV4 extends SearchRequest {
  /**
   * Result display type controlling the format and structure of the response
   *
   * Display type options:
   * - NEW_FORMAT (1): New merged administrative format (2 levels: ward, city)
   * - OLD_FORMAT (2): Old administrative format (3 levels: ward, district, city)
   * - INPUT_FORMAT (3): API detects user input and responds in matching format
   * - BOTH_NEW_AND_OLD (5): Returns new-format object with old-format in data_old property
   * - BOTH_OLD_AND_NEW (6): Returns old-format object with new-format in data_new property
   *
   * @default SearchDisplayType.NEW_FORMAT
   * @example SearchDisplayType.NEW_FORMAT, SearchDisplayType.BOTH_NEW_AND_OLD
   */
  public displayType?: SearchDisplayType;

  /**
   * Specify the type of data to search for
   *
   * Available layers: POI, ADDRESS, VILLAGE, WARD, DIST, CITY, STREET
   * Filters results to specific categories of geographic data
   *
   * @example layers.POI, layers.ADDRESS, layers.STREET
   */
  public layers?: layers;

  /**
   * The central coordinate (lat,lng) position of the circular search area
   * Used together with circleRadius to define a geographic search boundary
   *
   * @example 10.758867051669924 (latitude coordinate in Ho Chi Minh City)
   */
  public circleCenter?: number;

  /**
   * The radius of the search area in meters
   * Defines the search boundary around the circleCenter coordinate
   *
   * @example 200 (search within 200 meters radius)
   */
  public circleRadius?: number;

  /**
   * POI category codes to filter search results
   * Provides full list of POI categories for targeted searches
   *
   * @see {@link https://maps.vietmap.vn/docs/map-api/geocode-version/geocode-v4/#parameter | POI Categories Documentation}
   * @example "1002-1" (specific POI category code)
   */
  public cats?: string;

  /**
   * City unique identifier used to filter search results
   * Every city has a unique ID for geographic filtering
   *
   * @example 12 (Ho Chi Minh City ID)
   */
  public cityId?: number;

  /**
   * Ward unique identifier used to filter search results
   * Every ward has a unique ID for precise geographic filtering
   *
   * @example 984332 (specific ward ID)
   */
  public wardId?: number;

  /**
   * District unique identifier used to filter search results
   * Every district has a unique ID for geographic filtering
   *
   * @example 1292 (District 5 ID in Ho Chi Minh City)
   */
  public distId?: number;

  constructor({
    text,
    apikey,
    focus,
    displayType,
    layers,
    circleCenter,
    circleRadius,
    cats,
    cityId,
    wardId,
    distId,
  }: {
    text: string;
    apikey: string;
    focus?: [number, number];
    displayType?: SearchDisplayType;
    layers?: layers;
    circleCenter?: number;
    circleRadius?: number;
    cats?: string;
    cityId?: number;
    wardId?: number;
    distId?: number;
  }) {
    super({ text, apikey, focus });
    this.displayType = displayType;
    this.layers = layers;
    this.circleCenter = circleCenter;
    this.circleRadius = circleRadius;
    this.cats = cats;
    this.cityId = cityId;
    this.wardId = wardId;
    this.distId = distId;
  }

  public static constructorValidatorV4() {
    return searchRequestV4Schema;
  }
}
