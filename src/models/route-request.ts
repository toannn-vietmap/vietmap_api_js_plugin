import { z } from 'zod';
// import { VehicleSchema } from '../models';
const VehicleSchema = z.union([
  z.literal('car'),
  z.literal('bike'),
  z.literal('foot'),
  z.literal('motorcycle'),
]);

const RouteRequestSchema = z.object({
  points_encoded: z.boolean(),
  vehicle: VehicleSchema,
  apikey: z.string(),
  optimize: z.boolean(),
});
export class RouteRequest {
  public points_encoded: boolean;

  public vehicle: 'car' | 'bike' | 'foot' | 'motorcycle';

  public optimize: boolean;

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

  public static constructorValidator() {
    return RouteRequestSchema;
  }
}
