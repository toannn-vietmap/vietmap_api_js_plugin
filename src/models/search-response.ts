import { z } from 'zod';
import { TSJSON } from '../types';
import { Boundary, boundaryResponseSchema } from './boundary';
const searchResponseSchema = z.object({
  ref_id: z.string(),
  address: z.string(),
  name: z.string(),
  display: z.string(),
  boundaries: z.array(boundaryResponseSchema),

  categories: z.array(z.string()),
});
export class SearchResponse {
  public ref_id: string;

  public address: string;

  public name: string;

  public display: string;

  public boundaries: Boundary[];

  public categories: string[];
  public constructor({
    ref_id,
    address,
    name,
    display,
    boundaries,
    categories,
  }: {
    ref_id: string;
    address: string;
    name: string;
    display: string;
    boundaries: Boundary[];
    categories: string[];
  }) {
    this.ref_id = ref_id;
    this.address = address;
    this.name = name;
    this.display = display;
    this.boundaries = boundaries;
    this.categories = categories;
  }

  public static constructorValidator() {
    return searchResponseSchema;
  }

  public static fromJSON(json: TSJSON): SearchResponse {
    const validJSON = this.constructorValidator().parse(json);
    return new SearchResponse(validJSON);
  }
}
