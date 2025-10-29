import { ReverseResponse } from '../reverse-response';
import { EntryPoint, entryPointSchema } from './entry-point';
import { Boundary } from '../boundary';
import { z } from 'zod';
import { boundaryResponseSchema } from '../boundary';
import { TSJSON } from 'types';

const reverseResponseV4Schema = z.object({
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  ref_id: z.string().optional(),
  distance: z.number().optional(),
  name: z.string().optional(),
  display: z.string().optional(),
  boundaries: z.array(boundaryResponseSchema).optional(),
  categories: z.array(z.string()).optional(),
  entry_points: z.array(entryPointSchema).optional(),
  data_old: z
    .lazy(() => reverseResponseV4Schema)
    .nullable()
    .optional(),
  data_new: z
    .lazy(() => reverseResponseV4Schema)
    .nullable()
    .optional(),
});

export class ReverseResponseV4 extends ReverseResponse {
  public entry_points?: EntryPoint[];

  public data_old?: ReverseResponseV4;

  public data_new?: ReverseResponseV4;

  public constructor({
    address,
    lat,
    lng,
    ref_id,
    distance,
    name,
    display,
    boundaries,
    categories,
    entry_points,
    data_old,
    data_new,
  }: {
    address: string;
    lat: number;
    lng: number;
    ref_id: string;
    distance: number;
    name: string;
    display: string;
    boundaries: Boundary[];
    categories: string[];
    entry_points?: EntryPoint[];
    data_old?: ReverseResponseV4;
    data_new?: ReverseResponseV4;
  }) {
    super({
      address,
      lat,
      lng,
      ref_id,
      distance,
      name,
      display,
      boundaries,
      categories,
    });
    this.entry_points = entry_points;
    this.data_old = data_old;
    this.data_new = data_new;
  }

  public static constructorValidatorV4() {
    return reverseResponseV4Schema;
  }

  public static fromJSON(json: TSJSON): ReverseResponseV4 {
    const validJSON = this.constructorValidatorV4().parse(json);
    return new ReverseResponseV4(validJSON);
  }
}
