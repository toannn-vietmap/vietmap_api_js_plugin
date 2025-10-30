import { z } from 'zod';

/**
 * Zod schema for validating vehicle types in Vietmap API requests
 * 
 * Defines the allowed vehicle profiles for routing calculations. Each vehicle type
 * has different routing rules, road access permissions, and optimization algorithms:
 * 
 * - **car**: Standard passenger vehicle with highway access and car-specific routing
 * - **bike**: Bicycle routing with preference for bike lanes, paths, and low-traffic roads
 * - **foot**: Pedestrian routing using sidewalks, crosswalks, and pedestrian-only areas
 * - **motorcycle**: Two-wheeled motor vehicle with specific urban routing rules
 */
export const VehicleSchema = z.union([
  z.literal('car'),
  z.literal('bike'),
  z.literal('foot'),
  z.literal('motorcycle'),
]);
