import { z } from 'zod';
import { TSJSON } from '../types';

/**
 * Zod schema for validating PlaceResponse objects
 * @internal
 */
const placeResponseSchema = z.object({
  display: z.string(),
  name: z.string(),
  hs_num: z.string(),
  street: z.string(),
  address: z.string(),
  city_id: z.number(),
  city: z.string(),
  district_id: z.number(),
  district: z.string(),
  ward_id: z.number(),
  ward: z.string(),
  lat: z.number(),
  lng: z.number(),
});

/**
 * Response model for Vietmap Place API
 *
 * Contains detailed information about a specific place including complete address
 * breakdown, administrative divisions, and geographic coordinates. The response
 * format automatically adapts based on the input refid format (old or new display format).
 *
 * @see {@link https://maps.vietmap.vn/docs/map-api/place-v4/#response-description | Place API V4 Response Documentation}
 *
 * @example
 * ```typescript
 * // Example response for new format
 * const response = {
 *   display: "197 Đường Trân Phú,Phường Chợ Quán,Thành Phố Hồ Chí Minh",
 *   name: "",
 *   hs_num: "197",
 *   street: "Đường Trân Phú",
 *   address: "197 Đường Trân Phú",
 *   city_id: 12,
 *   city: "Thành Phố Hồ Chí Minh",
 *   district_id: 0, // Always 0 for new format
 *   district: "", // Empty string for new format
 *   ward_id: 18700,
 *   ward: "Phường Chợ Quán",
 *   lat: 10.759222947000069,
 *   lng: 106.67590269100003
 * };
 * ```
 */
export class PlaceResponse {
  /**
   * Complete display address with detailed location information
   * Contains the full formatted address suitable for user display
   *
   * @example "197 Đường Trần Phú,Phường Chợ Quán,Thành Phố Hồ Chí Minh"
   */
  public display: string;

  /**
   * Name of the street or specific location
   * May be empty for address-only locations
   *
   * @example "" (empty for address locations), "Landmark Tower" (for named locations)
   */
  public name: string;

  /**
   * House number or building number
   * The specific street address number
   *
   * @example "197", "123A", "45/2"
   */
  public hs_num: string;

  /**
   * Name of the street including prefix
   * Contains the complete street designation
   *
   * @example "Đường Trần Phú", "Phố Nguyễn Du", "Quốc lộ 1A"
   */
  public street: string;

  /**
   * Combined house number and street address
   * Basic address information without administrative divisions
   *
   * @example "197 Đường Trần Phú", "123A Phố Nguyễn Du"
   */
  public address: string;

  /**
   * Unique identifier for the city/province
   * Used to reference the specific city in the administrative hierarchy
   *
   * @example 12 (Ho Chi Minh City), 24 (Hanoi), 48 (Da Nang)
   */
  public city_id: number;

  /**
   * Name of the city/province with administrative prefix
   * Complete official designation of the city
   *
   * @example "Thành Phố Hồ Chí Minh", "Thành Phố Hà Nội", "Tỉnh An Giang"
   */
  public city: string;

  /**
   * Unique identifier for the district
   *
   * **Important**: Always 0 for new display format responses.
   * For old display format, contains the actual district ID.
   *
   * @example 0 (new format), 1292 (old format - District 5)
   */
  public district_id: number;

  /**
   * Name of the district with administrative prefix
   *
   * **Important**: Always empty string for new display format responses.
   * For old display format, contains the district name.
   *
   * @example "" (new format), "Quận 5" (old format)
   */
  public district: string;

  /**
   * Unique identifier for the ward/commune
   * Used to reference the specific ward in the administrative hierarchy
   *
   * @example 18700 (Phường Chợ Quán), 656652 (Phường 4)
   */
  public ward_id: number;

  /**
   * Name of the ward/commune with administrative prefix
   * Complete official designation of the ward
   *
   * @example "Phường Chợ Quán", "Phường 4", "Xã Tân Thành"
   */
  public ward: string;

  /**
   * Latitude coordinate of the place location
   * Geographic coordinate in decimal degrees
   *
   * @example 10.759222947000069
   */
  public lat: number;

  /**
   * Longitude coordinate of the place location
   * Geographic coordinate in decimal degrees
   *
   * @example 106.67590269100003
   */
  public lng: number;

  constructor({
    display,
    name,
    hs_num,
    street,
    address,
    city_id,
    city,
    district_id,
    district,
    ward_id,
    ward,
    lat,
    lng,
  }: {
    display: string;
    name: string;
    hs_num: string;
    street: string;
    address: string;
    city_id: number;
    city: string;
    district_id: number;
    district: string;
    ward_id: number;
    ward: string;
    lat: number;
    lng: number;
  }) {
    this.display = display;
    this.name = name;
    this.hs_num = hs_num;
    this.street = street;
    this.address = address;
    this.city_id = city_id;
    this.city = city;
    this.district_id = district_id;
    this.district = district;
    this.ward_id = ward_id;
    this.ward = ward;
    this.lat = lat;
    this.lng = lng;
  }

  public static constructorValidator() {
    return placeResponseSchema;
  }

  public static fromJSON(json: TSJSON): PlaceResponse {
    const validJSON = this.constructorValidator().parse(json);
    return new PlaceResponse(validJSON);
  }
}
