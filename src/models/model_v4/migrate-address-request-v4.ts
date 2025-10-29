import { Latitude, Longitude } from 'types';
import { MigrateType } from '../../types/result-display.type';
import { z } from 'zod';

const migrateAddressRequestV4Schema = z.object({
  apikey: z.string(),
  text: z.string(),
  migrate_type: z.nativeEnum(MigrateType).optional(),
  focus: z.string().optional(),
});

export class MigrateAddressRequestV4 {
  public apikey: string;

  public focus?: string;

  public text: string;

  public migrate_type?: MigrateType;

  constructor({
    apikey,
    text,
    focus,
    migrate_type,
  }: {
    apikey: string;
    text: string;
    focus?: [Latitude, Longitude];
    migrate_type?: MigrateType;
  }) {
    this.apikey = apikey;
    this.text = text;
    this.focus = focus ? `${focus[0]},${focus[1]}` : undefined;
    this.migrate_type = migrate_type;
    this.constructorValidatorV4().parse(this);
  }

  public constructorValidatorV4() {
    if (
      this.migrate_type !== undefined &&
      this.migrate_type !== null &&
      this.migrate_type === 2
    ) {
      return z.object({
        apikey: z.string(),
        text: z.string(),
        migrate_type: z.literal(MigrateType.NEW_TO_OLD),
        focus: z.string(),
      });
    }
    return migrateAddressRequestV4Schema;
  }
}
