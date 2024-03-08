import { z } from 'zod';
import { latitudeSchema, longitudeSchema } from '../schema';

const ReverseRequestSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  apikey: z.string()
});

export class ReverseRequest {
  public latitude: number;

  public longitude: number;

  public apikey?: string;

  public constructor({
    latitude,
    longitude,
    apikey,
  }: {
    latitude: number;
    longitude: number;
    apikey?: string;
  }) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.apikey = apikey;
    ReverseRequest.constructorValidator().parse(this);
  }
 

  public static constructorValidator() {
    return ReverseRequestSchema;
  }
}
