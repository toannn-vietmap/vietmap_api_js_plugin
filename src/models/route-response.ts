import { z, ZodError } from 'zod';
import { TSJSON } from '../types';

/**
 * Zod schema for validating navigation instruction objects
 * @internal
 */
const instructionSchema = z.object({
  distance: z.number(),
  heading: z.number(),
  sign: z.number(),
  interval: z.array(z.number()),
  text: z.string(),
  time: z.number(),
  street_name: z.string(),
  last_heading: z.nullable(z.number()),
});

/**
 * Zod schema for validating route path objects
 * @internal
 */
const pathSchema = z.object({
  distance: z.number(),
  weight: z.number(),
  time: z.number(),
  transfers: z.number(),
  points_encoded: z.boolean(),
  bbox: z.array(z.number()),
  points: z.string(),
  instructions: z.array(instructionSchema),
  snapped_waypoints: z.string(),
});

/**
 * Zod schema for validating route response objects
 * @internal
 */
const responseSchema = z.object({
  license: z.string(),
  code: z.string(),
  messages: z.nullable(z.string()),
  paths: z.array(pathSchema),
});

/**
 * Represents a single navigation instruction in a route
 *
 * Contains turn-by-turn navigation guidance including distance, direction,
 * timing information, and descriptive text for route following.
 *
 * @example
 * ```typescript
 * // Example instruction from Vietnam route
 * const instruction = {
 *   distance: 403.4,
 *   heading: 0,
 *   sign: 0,
 *   interval: [0, 11],
 *   text: "Tiếp tục theo Nguyễn Cửu Vân",
 *   time: 54800,
 *   street_name: "Nguyễn Cửu Vân",
 *   last_heading: null
 * };
 * ```
 */
class Instruction {
  /**
   * Distance until the next instruction in meters
   * @example 403.4 (approximately 403 meters to next turn)
   */
  distance: number;

  /**
   * Heading direction of the instruction in degrees
   * @example 0 (north), 90 (east), 180 (south), 270 (west)
   */
  heading: number;

  /**
   * Direction sign of the instruction
   * @see {@link https://maps.vietmap.vn/docs/map-api/route/#response-description | Sign descriptions in API docs}
   * @example 0 (continue straight), 1 (turn right), -1 (turn left), 4 (destination reached)
   */
  sign: number;

  /**
   * Two indices into points array, referring to the beginning and end of the route segment
   * @example [0, 11] (segment spans from point 0 to point 11)
   */
  interval: number[];

  /**
   * Human-readable description of what the user should do
   * Typically in Vietnamese for Vietnam routes
   * @example "Tiếp tục theo Nguyễn Cửu Vân", "Rẽ phải vào Lê Lợi", "Đích đến"
   */
  text: string;

  /**
   * Duration for this instruction in milliseconds
   * @example 54800 (approximately 55 seconds)
   */
  time: number;

  /**
   * Name of the street to turn onto or continue on
   * @example "Nguyễn Cửu Vân", "Đường Không Tên" (unnamed road)
   */
  street_name: string;

  /**
   * Last heading direction of the instruction (if available)
   * Usually null for most instructions
   * @example null
   */
  last_heading: number | null;

  constructor({
    distance,
    heading,
    sign,
    interval,
    text,
    time,
    street_name,
    last_heading,
  }: {
    distance: number;
    heading: number;
    sign: number;
    interval: number[];
    text: string;
    time: number;
    street_name: string;
    last_heading: number | null;
  }) {
    this.distance = distance;
    this.heading = heading;
    this.sign = sign;
    this.interval = interval;
    this.text = text;
    this.time = time;
    this.street_name = street_name;
    this.last_heading = last_heading;
  }

  /**
   * Creates an Instruction instance from JSON data
   *
   * @param json - Raw JSON instruction data from route API response
   * @returns A validated Instruction instance
   * @throws {z.ZodError} When JSON doesn't match expected instruction schema
   */
  public static fromJSON(json: TSJSON): Instruction {
    const validJSON = instructionSchema.parse(json);
    return new Instruction(validJSON);
  }
}

/**
 * Represents a complete route path with geometry and navigation instructions
 *
 * Contains all routing information including total distance, time, encoded route points,
 * turn-by-turn instructions, and bounding box information.
 *
 * @example
 * ```typescript
 * // Example path from Ho Chi Minh City route
 * const path = {
 *   distance: 2194.4,           // 2.19 km route
 *   weight: 351.4,              // Route weight/cost
 *   time: 351400,               // ~5.8 minutes in milliseconds
 *   transfers: 0,               // No transfers needed
 *   points_encoded: true,       // Using polyline encoding
 *   bbox: [106.70594, 10.79479, 106.71154, 10.80325], // Bounding box
 *   points: "}s{`Ac_hjSjAkC...", // Encoded route geometry
 *   instructions: [...],        // Turn-by-turn navigation
 *   snapped_waypoints: "c_hjS}s{`AeDab@" // Snapped waypoints
 * };
 * ```
 */
class Path {
  /**
   * Total distance of the route in meters
   * @example 2194.4 (approximately 2.19 kilometers)
   */
  distance: number;

  /**
   * Weight assigned to the route for optimization calculations
   * @example 351.4
   */
  weight: number;

  /**
   * Total time required for the route in milliseconds
   * @example 351400 (approximately 5 minutes 51 seconds)
   */
  time: number;

  /**
   * Number of transfers required for the route
   * Usually 0 for direct routes
   * @example 0
   */
  transfers: number;

  /**
   * Whether the points and snapped_waypoints fields are polyline-encoded
   * @example true (polyline encoded), false (coordinate array format)
   */
  points_encoded: boolean;

  /**
   * Bounding box of the route geometry
   * Format: [minLongitude, minLatitude, maxLongitude, maxLatitude]
   * @example [106.70594, 10.79479, 106.71154, 10.80325]
   */
  bbox: number[];

  /**
   * Encoded route geometry using Google Polyline Algorithm Format 5
   * If points_encoded is false, this contains coordinate pairs array
   * @example "}s{`Ac_hjSjAkCFQRu@Lu@F_@D]Ng@ZaALa@JY..."
   */
  points: string;

  /**
   * Array of turn-by-turn navigation instructions
   * @example Array of Instruction objects with Vietnamese text guidance
   */
  instructions: Instruction[];

  /**
   * Snapped waypoints representing the exact route start/end points
   * Encoded in the same format as points field
   * @example "c_hjS}s{`AeDab@"
   */
  snapped_waypoints: string;

  constructor({
    distance,
    weight,
    time,
    transfers,
    points_encoded,
    bbox,
    points,
    instructions,
    snapped_waypoints,
  }: {
    distance: number;
    weight: number;
    time: number;
    transfers: number;
    points_encoded: boolean;
    bbox: number[];
    points: string;
    instructions: Instruction[];
    snapped_waypoints: string;
  }) {
    this.distance = distance;
    this.weight = weight;
    this.time = time;
    this.transfers = transfers;
    this.points_encoded = points_encoded;
    this.bbox = bbox;
    this.points = points;
    this.instructions = instructions;
    this.snapped_waypoints = snapped_waypoints;
  }

  /**
   * Creates a Path instance from JSON data
   *
   * @param json - Raw JSON path data from route API response
   * @returns A validated Path instance with parsed instructions
   * @throws {z.ZodError} When JSON doesn't match expected path schema
   */
  public static fromJSON(json: TSJSON): Path {
    const validJSON = pathSchema.parse(json);
    return new Path(validJSON);
  }
}

/**
 * Response model for Vietmap Route API
 *
 * Contains routing results including multiple possible paths, status information,
 * and licensing details. Each path includes complete route geometry, navigation
 * instructions, and performance metrics for optimal route planning.
 *
 * @see {@link https://maps.vietmap.vn/docs/map-api/route/#response-description | Route API Response Documentation}
 *
 * @example
 * ```typescript
 * // Example route response for motorcycle route in Ho Chi Minh City
 * const response = {
 *   license: "vietmap",
 *   code: "OK",
 *   messages: null,
 *   paths: [{
 *     distance: 2194.4,
 *     weight: 351.4,
 *     time: 351400,
 *     transfers: 0,
 *     points_encoded: true,
 *     bbox: [106.70594, 10.79479, 106.71154, 10.80325],
 *     points: "}s{`Ac_hjSjAkCFQRu@...",
 *     instructions: [...],
 *     snapped_waypoints: "c_hjS}s{`AeDab@"
 *   }]
 * };
 * ```
 */
export class RouteResponse {
  /**
   * License type associated with the routing data
   * @example "vietmap"
   */
  license: string;

  /**
   * Status code indicating success or failure of the request
   * @example "OK" (success), "InvalidInput" (error), "NoRoute" (no route found)
   */
  code: string;

  /**
   * Additional messages related to the request
   * Usually null for successful requests, contains error details for failures
   * @example null (success), "Point not found" (error message)
   */
  messages: null | string;

  /**
   * Array containing route information
   * Multiple paths may be returned for different routing options
   * @example Array with one or more Path objects containing route details
   */
  paths: Path[];

  constructor({
    license,
    code,
    messages,
    paths,
  }: {
    license: string;
    code: string;
    messages: null | string;
    paths: Path[];
  }) {
    this.license = license;
    this.code = code;
    this.messages = messages;
    this.paths = paths;
  }

  /**
   * Creates a RouteResponse instance from JSON data
   *
   * Validates the incoming JSON against the expected schema and creates a properly
   * typed response object with parsed paths and navigation instructions.
   *
   * @param json - Raw JSON response from the Vietmap Route API
   * @returns A validated RouteResponse instance
   *
   * @throws {z.ZodError} When the JSON doesn't match the expected response schema
   * @throws {Error} When there are parsing errors
   */
  static fromJSON(json: TSJSON): RouteResponse {
    try {
      const validatedData = responseSchema.parse(json);
      return new RouteResponse(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Validation error:', error.errors);
      } else {
        console.error('Error parsing data:', error);
      }
      console.error(error);
      throw error;
    }
  }
}
