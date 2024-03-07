import { Latitude, Longitude } from 'types';
import { z } from 'zod';

const searchRequestSchema = z.object({
  text: z.string(),
  apikey: z.string(),
  focus: z.string(),
});

export class SearchRequest {
  public text: string;

  public apikey: string;

  public focus?: string;

  public constructor({
    text,
    apikey,
    focus,
  }: {
    text: string;
    apikey: string;
    focus?: [Latitude, Longitude];
  }) {
    this.text = text;
    this.apikey = apikey;
    this.focus = focus != null ? `${focus[0]},${focus[1]}` : '';
    SearchRequest.constructorValidator().parse(this);
  }

  public static constructorValidator() {
    return searchRequestSchema;
  }
}
