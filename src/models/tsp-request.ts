import { z } from 'zod';
import { VehicleSchema } from '../models';

const TSPRequestSchema = z.object({
  points_encoded: z.boolean(),
  vehicle: VehicleSchema,
  apikey: z.string(),
  optimize: z.boolean(),
  round_trip: z.boolean(),
});
export class TSPRequest {
  public points_encoded: boolean;

  public vehicle: 'car' | 'bike' | 'foot' | 'motorcycle';

  public optimize: boolean;

  public apikey: string;

  public round_trip: boolean;

  constructor({
    apikey,
    points_encoded = true,
    vehicle = 'car',
    optimize = false,
    round_trip = true,
  }: {
    apikey: string;
    points_encoded: boolean;
    vehicle: 'car' | 'bike' | 'foot' | 'motorcycle';
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

  public static constructorValidator() {
    return TSPRequestSchema;
  }
}
