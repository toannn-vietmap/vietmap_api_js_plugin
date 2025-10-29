import { z } from 'zod';
import { ReverseRequest } from '../reverse-request';
import { ReverseDisplayType } from '../../types/result-display.type';
import { latitudeSchema, longitudeSchema } from '../../schema';

const reverseRequestV4Schema = z.object({
  lat: latitudeSchema,
  lng: longitudeSchema,
  apikey: z.string(),
  display_type: z.nativeEnum(ReverseDisplayType).optional(),
});

export class ReverseRequestV4 extends ReverseRequest {
  public displayType?: ReverseDisplayType;

  public lat?: number;

  public lng?: number;

  constructor({
    lat,
    lng,
    apikey,
    displayType,
  }: {
    lat: number;
    lng: number;
    apikey?: string;
    displayType?: ReverseDisplayType;
  }) {
    super({ latitude: lat, longitude: lng, apikey });
    this.displayType = displayType;
    this.lat = lat;
    this.lng = lng;
    ReverseRequestV4.constructorValidatorV4().parse(this);
  }

  public static constructorValidatorV4() {
    return reverseRequestV4Schema;
  }
}
