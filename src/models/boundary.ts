import { z } from 'zod';
import { TSJSON } from '../types';
export const boundaryResponseSchema = z.object({
  type: z.number(),
  id: z.number(),
  name: z.string(),
  prefix: z.string(),
  full_name: z.string(),
});
export class Boundary {
  public type: number;

  public id: number;

  public name: string;

  public prefix: string;

  public full_name: string;

  constructor({
    type,
    id,
    name,
    prefix,
    full_name,
  }: {
    type: number;
    id: number;
    name: string;
    prefix: string;
    full_name: string;
  }) {
    this.type = type;
    this.full_name = full_name;
    this.id = id;
    this.name = name;
    this.prefix = prefix;
  }

  public static constructorValidator() {
    return boundaryResponseSchema;
  }

  public static fromJSON(json: TSJSON): Boundary {
    const validJSON = this.constructorValidator().parse(json);
    return new Boundary(validJSON);
  }
}
