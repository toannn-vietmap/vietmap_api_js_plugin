import { z } from 'zod';
import { VehicleType } from '../types/vehicle.type';

/**
 * Zod schema for validating TSPRequest objects
 * @internal
 */
const TSPRequestSchema = z.object({
  apikey: z.string(),
  points_encoded: z.boolean(),
  vehicle: z.nativeEnum(VehicleType),
  optimize: z.boolean(),
  round_trip: z.boolean(),
});

/**
 * Request parameters for Vietmap Traveling Salesman Problem (TSP) API
 *
 * The TSP API solves the classic optimization problem of finding the shortest possible
 * route that visits each location exactly once. This is particularly useful for delivery
 * optimization, logistics management, and route planning where you need to visit multiple
 * points efficiently.
 *
 * Given a set of locations and distances between them, the TSP API provides algorithms
 * and heuristics to find approximate solutions with optimized route ordering and
 * visualization capabilities.
 *
 * @see {@link https://maps.vietmap.vn/docs/map-api/tsp/ | TSP API Documentation}
 *
 * @example
 * ```typescript
 * // Basic TSP request for delivery route optimization
 * const deliveryTSP = new TSPRequest({
 *   apikey: "your-vietmap-api-key",
 *   points_encoded: true,
 *   vehicle: VehicleType.CAR,
 *   optimize: true,
 *   round_trip: true
 * });
 * ```
 */
export class TSPRequest {
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
   * Vehicle profile for TSP route calculation
   *
   * Determines the routing algorithm and road access rules for optimization:
   * - CAR: Standard car routing with highway access
   * - BIKE: Bicycle routing preferring bike lanes and paths
   * - FOOT: Walking routing using pedestrian paths
   * - MOTORCYCLE: Motorcycle routing with specific road access rules
   *
   * @default VehicleType.CAR
   * @example VehicleType.CAR, VehicleType.MOTORCYCLE, VehicleType.FOOT, VehicleType.BIKE
   */
  public vehicle: VehicleType;

  /**
   * Enable TSP optimization algorithms
   *
   * When true, applies Traveling Salesman Problem algorithms to find the optimal
   * order of visiting all points to minimize total travel time/distance. Should
   * typically be true for TSP requests as this is the core functionality.
   *
   * @default false
   * @example true (enable TSP optimization), false (use point order as given)
   */
  public optimize: boolean;

  /**
   * API key provided by Vietmap for customer's account
   * Required for authentication with the TSP API
   *
   * @example "your-vietmap-api-key-here"
   */
  public apikey: string;

  /**
   * Whether the route should return to the starting location
   *
   * When true (default), creates a roundtrip route that returns to the first point.
   * When false, the route ends at the last optimized point without returning to start.
   * Useful for delivery routes vs. touring scenarios.
   *
   * @default true
   * @example true (roundtrip - return to start), false (one-way - end at last point)
   */
  public round_trip: boolean;

  constructor({
    apikey,
    points_encoded = true,
    vehicle = VehicleType.CAR,
    optimize = false,
    round_trip = true,
  }: {
    apikey: string;
    points_encoded: boolean;
    vehicle: VehicleType;
    optimize: boolean;
    round_trip: boolean;
  }) {
    this.round_trip = round_trip;
    this.apikey = apikey;
    this.optimize = optimize;
    this.vehicle = vehicle;
    this.points_encoded = points_encoded;
    TSPRequest.constructorValidator().parse(this);
  }

  /**
   * Returns the Zod schema validator for TSPRequest objects
   *
   * Used internally to validate that all required properties are present and
   * have the correct types when creating TSP request instances.
   *
   * @returns {z.ZodSchema} Zod schema for TSPRequest validation
   */
  public static constructorValidator() {
    return TSPRequestSchema;
  }
}
