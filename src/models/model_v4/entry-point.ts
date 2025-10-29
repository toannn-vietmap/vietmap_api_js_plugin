import { z } from 'zod';

export const entryPointSchema = z.object({
  refId: z.string(),
  name: z.string(),
});

export class EntryPoint {
  public refId: string;
  public name: string;
  public constructor({ refId, name }: { refId: string; name: string }) {
    this.refId = refId;
    this.name = name;
    EntryPoint.constructorValidator().parse(this);
  }

  public static constructorValidator() {
    return entryPointSchema;
  }
}
