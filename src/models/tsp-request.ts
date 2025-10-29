import { z } from 'zod';
import { VehicleType } from '../types/vehicle.type';

const TSPRequestSchema = z.object({
  apikey: z.string(),
  points_encoded: z.boolean(),
  vehicle: z.nativeEnum(VehicleType),
  optimize: z.boolean(),
  round_trip: z.boolean(),
});
export class TSPRequest {
  public points_encoded: boolean;

  public vehicle: VehicleType;

  public optimize: boolean;

  public apikey: string;

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

  public static constructorValidator() {
    return TSPRequestSchema;
  }
}
