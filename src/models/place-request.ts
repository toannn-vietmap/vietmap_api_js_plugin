import { z } from 'zod';

const placeRequestSchema = z.object({
  refId: z.string(),
  apikey: z.string(),
});

export class PlaceRequest {
  public refId: string;

  public apikey?: string;

  constructor({ refId, apikey }: { refId: string; apikey?: string }) {
    this.refId = refId;
    this.apikey = apikey;

    PlaceRequest.constructorValidator().parse(this);
  }

  public static constructorValidator() {
    return placeRequestSchema;
  }
}
