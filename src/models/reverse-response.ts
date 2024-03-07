import { z } from 'zod';
import { TSJSON } from '../types';
import { Boundary, boundaryResponseSchema } from './boundary';
const reverseResponseSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  ref_id: z.string(),
  distance: z.number(),
  address: z.string(),
  name: z.string(),
  display: z.string(),
  boundaries: z.array(boundaryResponseSchema),
  categories: z.array(z.string()),
});

export class ReverseResponse {
  private readonly _address: string;

  private readonly _lat: number;

  private readonly _lng: number;

  private readonly _ref_id: string;

  private readonly _distance: number;

  private readonly _name: string;

  private readonly _display: string;

  private readonly _boundaries: Boundary[];

  private readonly _categories: string[];

  public constructor({
    address,
    lat,
    lng,
    ref_id,
    distance,
    name,
    display,
    boundaries,
    categories
  }: {
    address: string;
    lat: number;
    lng: number;
    ref_id: string;
    distance: number;
    name: string;
    display: string;
    boundaries: Boundary[];
    categories: string[]
  }) {
    this._address = address;
    this._lat = lat;
    this._lng = lng;
    this._ref_id = ref_id;
    this._distance = distance;
    this._name = name;
    this._display = display;
    this._boundaries = boundaries;
    this._categories = categories
  }

  public static constructorValidator() {
    return reverseResponseSchema;
  }

  public static fromJSON(json: TSJSON) { 
    const validJSON = this.constructorValidator().parse(json);
    return new ReverseResponse(validJSON);
  }

  public get address(): string {
    return this._address;
  }

  public get display(): string {
    return this._display;
  }

  public get ref_id(): string {
    return this._ref_id;
  }

  public get boundaries(): Array<Boundary> {
    return this._boundaries;
  }

  public get name(): string {
    return this._name;
  }

  public get lat(): number {
    return this._lat;
  }

  public get lng(): number {
    return this._lng;
  }

  public get distance(): number {
    return this._distance;
  }
  public get categories(): string[]{
    return this._categories
  }
}
