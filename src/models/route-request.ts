import { z } from 'zod';

/**
 * Zod schema for validating vehicle types
 * @internal
 */
const VehicleSchema = z.union([
  z.literal('car'),
  z.literal('bike'),
  z.literal('foot'),
  z.literal('motorcycle'),
]);

/**
 * Zod schema for validating RouteRequest objects
 * @internal
 */
const RouteRequestSchema = z.object({
  points_encoded: z.boolean(),
  vehicle: VehicleSchema,
  apikey: z.string(),
  optimize: z.boolean(),
});

/**
 * Request parameters for Vietmap Route API
 * 
 * This API calculates and displays the optimal route between two or more locations,
 * providing detailed routing information including distance, travel time, and
 * turn-by-turn navigation instructions. Supports multiple vehicle types and
 * optimization options for efficient route planning.
 * 
 * @see {@link https://maps.vietmap.vn/docs/map-api/route/ | Route API Documentation}
 * @see {@link https://tools.vietmap.vn/playground/route | Route API Playground}
 * 
 * @example
 * ```typescript
 * // Basic car route request
 * const request = new RouteRequest({
 *   apikey: "your-vietmap-api-key",
 *   points_encoded: true,
 *   vehicle: "car",
 *   optimize: false
 * });
 * 
 * // Motorcycle route with optimization (TSP)
 * const motorcycleRequest = new RouteRequest({
 *   apikey: "your-vietmap-api-key", 
 *   points_encoded: true,
 *   vehicle: "motorcycle",
 *   optimize: true
 * });
 * 
 * // Walking route with coordinate pairs response
 * const walkingRequest = new RouteRequest({
 *   apikey: "your-vietmap-api-key",
 *   points_encoded: false, // Get simple coordinate pairs
 *   vehicle: "foot",
 *   optimize: false
 * });
 * ```
 */
export class RouteRequest {
  /**
   * Controls the encoding of location data in the response
   * 
   * When true (default), uses polyline encoding which is compact but requires
   * special client code to unpack. When false, returns simple coordinate pairs
   * like [lng, lat] which are easier to use but result in larger response size.
   * 
   * @default true
   * @example true (polyline encoded), false (coordinate pairs)
   */
  public points_encoded: boolean;

  /**
   * Vehicle profile for route calculation
   * 
   * Determines the routing algorithm and road access rules:
   * - car: Standard car routing with highway access
   * - bike: Bicycle routing preferring bike lanes and paths
   * - foot: Walking routing using pedestrian paths
   * - motorcycle: Motorcycle routing with specific road access rules
   * 
   * @default "car"
   * @example "car", "bike", "foot", "motorcycle"
   */
  public vehicle: 'car' | 'bike' | 'foot' | 'motorcycle';

  /**
   * Enable Traveling Salesman Problem (TSP) optimization
   * 
   * When true, optimizes the route order for multiple waypoints to minimize
   * total travel time/distance. Should normally be false for standard routing.
   * Use with caution as it increases computation time.
   * 
   * @default false
   * @example false (normal routing), true (TSP optimization)
   */
  public optimize: boolean;

  /**
   * API key provided by Vietmap for customer's account
   * Required for authentication with the Route API
   * 
   * @example "your-vietmap-api-key-here"
   */
  public apikey: string;

  constructor({
    apikey,
    points_encoded = true,
    vehicle = 'car',
    optimize = false,
  }: {
    apikey: string;
    points_encoded: boolean;
    vehicle: 'car' | 'bike' | 'foot' | 'motorcycle';
    optimize: boolean;
  }) {
    this.apikey = apikey;
    this.optimize = optimize;
    this.vehicle = vehicle;
    this.points_encoded = points_encoded;
    RouteRequest.constructorValidator().parse(this);
  }

  /**
   * Returns the Zod schema validator for RouteRequest
   * Used internally for runtime validation of constructor arguments
   * 
   * @returns The Zod schema for validating route request parameters
   * @internal
   */
  public static constructorValidator() {
    return RouteRequestSchema;
  }
}
