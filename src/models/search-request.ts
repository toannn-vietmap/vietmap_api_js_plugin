import { Latitude, Longitude } from 'types';
import { z } from 'zod';

/**
 * Zod schema for validating SearchRequest objects
 * @internal
 */
const searchRequestSchema = z.object({
  text: z.string(),
  apikey: z.string(),
  focus: z.string(),
});

/**
 * Request parameters for Vietmap Search API (Geocoding V3)
 * 
 * The Search API is a powerful tool for finding locations, addresses, and Points of Interest (POI) 
 * in Vietnam. It provides intelligent search algorithms with optimized performance to deliver 
 * accurate and speedy search results. The API supports various filtering options including 
 * geographic focus, administrative boundaries, and POI categories.
 * 
 * This API returns up to 10 places matching the search criteria, with detailed information 
 * including reference IDs for further Place API queries, administrative boundaries, and 
 * categorization data.
 * 
 * @see {@link https://maps.vietmap.vn/docs/map-api/geocode-version/geocode-ver3.0/ | Search API V3 Documentation}
 * @see {@link https://tools.vietmap.vn/playground/geocode | VietMap Geocode API Playground}
 * 
 * @example
 * ```typescript
 * // Basic search for a company in Ho Chi Minh City
 * const companySearch = new SearchRequest({
 *   text: "Công Ty Cổ Phần Ứng Dụng Bản Đồ Việt",
 *   apikey: "your-vietmap-api-key",
 *   focus: [10.759540, 106.676601] // Ho Chi Minh City coordinates
 * });
 * 
 * // Search for restaurants without geographic focus
 * const restaurantSearch = new SearchRequest({
 *   text: "nhà hàng sushi",
 *   apikey: "your-vietmap-api-key"
 * });
 * 
 * // Search with specific location focus for better results
 * const focusedSearch = new SearchRequest({
 *   text: "bệnh viện",
 *   apikey: "your-vietmap-api-key",
 *   focus: [21.028511, 105.804817] // Hanoi coordinates
 * });
 * ```
 */
export class SearchRequest {
  /**
   * Search query text for finding locations, addresses, or POIs
   * 
   * Can include business names, addresses, landmarks, or any location-related text.
   * The search algorithm supports Vietnamese language and handles various input formats
   * including partial matches and common misspellings.
   * 
   * @example "Công Ty Cổ Phần Ứng Dụng Bản Đồ Việt", "197 Trần Phú Q5", "bệnh viện"
   */
  public text: string;

  /**
   * API key provided by Vietmap for customer's account
   * Required for authentication with the Search API
   * 
   * @example "your-vietmap-api-key-here"
   */
  public apikey?: string;

  /**
   * GPS coordinates to focus search results around a specific location
   * 
   * When provided, results will be prioritized by proximity to these coordinates.
   * This significantly improves search accuracy for local businesses and addresses.
   * Format is converted internally to "lat,lng" string for the API request.
   * 
   * @example "10.759540,106.676601" (Ho Chi Minh City), "21.028511,105.804817" (Hanoi)
   */
  public focus?: string;

  constructor({
    text,
    apikey,
    focus,
  }: {
    text: string;
    apikey?: string;
    focus?: [Latitude, Longitude];
  }) {
    this.text = text;
    this.apikey = apikey;
    this.focus = focus != null ? `${focus[0]},${focus[1]}` : '';
    SearchRequest.constructorValidator().parse(this);
  }

  /**
   * Returns the Zod schema validator for SearchRequest objects
   * 
   * Used internally to validate that all required properties are present and
   * have the correct types when creating search request instances.
   * 
   * @returns {z.ZodSchema} Zod schema for SearchRequest validation
   * @example
   * ```typescript
   * // Validate a search request object
   * const validator = SearchRequest.constructorValidator();
   * validator.parse(searchRequestObject); // Throws if invalid
   * ```
   */
  public static constructorValidator() {
    return searchRequestSchema;
  }
}
