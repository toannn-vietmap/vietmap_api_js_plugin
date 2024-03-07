import { z } from 'zod';
import { TSJSON } from '../types'; 

const reverseResponseSchema = z.object({
  address: z.string(),
  address_compact: z.string(),
  city: z.string(),
  country: z.string(),
  county: z.string(),
  district: z.string(),
  // geom: GeomResponse.constructorValidator().transform(
  //   (validJSON) => new GeomResponse(validJSON),
  // ),
  last: z.string(),
  name: z.string(),
  neighbourhood: z.string(),
  plaque: z.string(),
  poi: z.string(),
  postal_address: z.string(),
  postal_code: z.string(),
  primary: z.string(),
  province: z.string(),
  region: z.string(),
  rural_district: z.string(),
  village: z.string(),
});

export class ReverseResponse {
  private readonly _address: string;

  private readonly _address_compact: string;

  private readonly _city: string;

  private readonly _country: string;

  private readonly _county: string;

  private readonly _district: string;

  private readonly _last: string;

  private readonly _name: string;

  private readonly _neighbourhood: string;

  private readonly _plaque: string;

  private readonly _poi: string;

  private readonly _postal_address: string;

  private readonly _postal_code: string;

  private readonly _primary: string;

  private readonly _province: string;

  private readonly _region: string;

  private readonly _rural_district: string;

  private readonly _village: string;

  // private readonly _geom: GeomResponse;

  public constructor({
    address,
    address_compact,
    city,
    country,
    county,
    district,
    // geom,
    last,
    name,
    neighbourhood,
    plaque,
    poi,
    postal_address,
    postal_code,
    primary,
    province,
    region,
    rural_district,
    village,
  }: {
    address: string;
    address_compact: string;
    city: string;
    country: string;
    county: string;
    district: string;
    // geom: GeomResponse;
    last: string;
    name: string;
    neighbourhood: string;
    plaque: string;
    poi: string;
    postal_address: string;
    postal_code: string;
    primary: string;
    province: string;
    region: string;
    rural_district: string;
    village: string;
  }) {
    this._address = address;
    this._address_compact = address_compact;
    this._city = city;
    this._country = country;
    this._county = county;
    this._district = district;
    // this._geom = geom;
    this._last = last;
    this._name = name;
    this._neighbourhood = neighbourhood;
    this._plaque = plaque;
    this._poi = poi;
    this._postal_address = postal_address;
    this._postal_code = postal_code;
    this._primary = primary;
    this._province = province;
    this._region = region;
    this._rural_district = rural_district;
    this._village = village;
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

  public get addressCompact(): string {
    return this._address_compact;
  }

  public get city(): string {
    return this._city;
  }

  public get country(): string {
    return this._country;
  }

  public get county(): string {
    return this._county;
  }

  public get district(): string {
    return this._district;
  }

  public get last(): string {
    return this._last;
  }

  public get name(): string {
    return this._name;
  }

  public get neighbourhood(): string {
    return this._neighbourhood;
  }

  public get plaque(): string {
    return this._plaque;
  }

  public get poi(): string {
    return this._poi;
  }

  public get postalAddress(): string {
    return this._postal_address;
  }

  public get postalCode(): string {
    return this._postal_code;
  }

  public get primary(): string {
    return this._primary;
  }

  public get province(): string {
    return this._province;
  }

  public get region(): string {
    return this._region;
  }

  public get ruralDistrict(): string {
    return this._rural_district;
  }

  public get village(): string {
    return this._village;
  }

  // public get geom(): GeomResponse {
  //   return this._geom;
  // }
}
