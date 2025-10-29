import { TSJSON } from '../../types';
import { Boundary, boundaryResponseSchema } from '../boundary';
import { z } from 'zod';

const migrateAddressResponseV4Schema = z.object({
  address: z.string().optional(),
  name: z.string().optional(),
  display: z.string().optional(),
  boundaries: z.array(boundaryResponseSchema).optional(),
});

export class MigrateAddressResponseV4 {
  public address?: string;

  public name?: string;

  public display?: string;

  public boundaries?: Boundary[];

  constructor({
    address,
    name,
    display,
    boundaries,
  }: {
    address?: string;
    name?: string;
    display?: string;
    boundaries?: Boundary[];
  }) {
    this.address = address;
    this.name = name;
    this.display = display;
    this.boundaries = boundaries;
    MigrateAddressResponseV4.constructorValidation().parse(this);
  }

  public static constructorValidation() {
    return migrateAddressResponseV4Schema;
  }

  public static fromJSON(json: TSJSON): MigrateAddressResponseV4 {
    const validJSON = this.constructorValidation().parse(json);
    return new MigrateAddressResponseV4(validJSON);
  }
}
