import { ZodType } from 'zod/v4';
import { Boundary, boundaryResponseSchema } from '../boundary';
import { SearchResponse } from '../search-response';
import { EntryPoint, entryPointSchema } from './entry-point';
import { z } from 'zod';
import { TSJSON } from '../../types';

const searchResponseV4Schema = z.object({
  ref_id: z.string(),
  address: z.string(),
  name: z.string(),
  display: z.string(),
  boundaries: z.array(boundaryResponseSchema),
  categories: z.array(z.string()),
  distance: z.number().optional(),
  entry_points: z.array(entryPointSchema).optional(),
  data_old: z
    .lazy(() => searchResponseV4Schema)
    .nullable()
    .optional(),
  data_new: z
    .lazy(() => searchResponseV4Schema)
    .nullable()
    .optional(),
});

export class SearchResponseV4 extends SearchResponse {
  public distance?: number;

  public entry_points?: EntryPoint[];

  public data_old?: SearchResponseV4;

  public data_new?: SearchResponseV4;

  constructor({
    ref_id,
    address,
    name,
    display,
    boundaries,
    categories,
    distance,
    entry_points,
    data_old,
    data_new,
  }: {
    ref_id: string;
    address: string;
    name: string;
    display: string;
    boundaries: Boundary[];
    categories: string[];
    distance?: number;
    entry_points?: EntryPoint[];
    data_old?: SearchResponseV4;
    data_new?: SearchResponseV4;
  }) {
    super({ ref_id, address, name, display, boundaries, categories });
    this.distance = distance;
    this.entry_points = entry_points;
    this.data_old = data_old;
    this.data_new = data_new;
    SearchResponseV4.constructorValidatorV4().parse(this);
  }

  public static constructorValidatorV4() {
    return searchResponseV4Schema;
  }

  public static fromJson(json: TSJSON): SearchResponseV4 {
    const validJSON = this.constructorValidatorV4().parse(json);
    return new SearchResponseV4(validJSON);
  }

  override toString(): string {
    return `SearchResponseV4(ref_id=${this.ref_id}, name=${this.name}, address=${this.address})`;
  }
}
