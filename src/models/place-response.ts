import { z } from 'zod';
import { TSJSON } from '../types';
const placeResponseSchema = z.object({
  display: z.string(),
  name: z.string(),
  hs_num: z.string(),
  street: z.string(),
  address: z.string(),
  city_id: z.number(),
  city: z.string(),
  district_id: z.number(),
  district: z.string(),
  ward_id: z.number(),
  ward: z.string(),
  lat: z.number(),
  lng: z.number(),
});
export class PlaceResponse {
  public display: string;
  public name: string;
  public hs_num: string;
  public street: string;
  public address: string;
  public city_id: number;
  public city: string;
  public district_id: number;
  public district: string;
  public ward_id: number;
  public ward: string;
  public lat: number;
  public lng: number;
  public constructor({
    display,
    name,
    hs_num,
    street,
    address,
    city_id,
    city,
    district_id,
    district,
    ward_id,
    ward,
    lat,
    lng,
  }: {
    display: string;
    name: string;
    hs_num: string;
    street: string;
    address: string;
    city_id: number;
    city: string;
    district_id: number;
    district: string;
    ward_id: number;
    ward: string;
    lat: number;
    lng: number;
  }) {
    this.display = display;
    this.name = name;
    this.hs_num = hs_num;
    this.street = street;
    this.address = address;
    this.city_id = city_id;
    this.city = city;
    this.district_id = district_id;
    this.district = district;
    this.ward_id = ward_id;
    this.ward = ward;
    this.lat = lat;
    this.lng = lng;
  }

  public static constructorValidator() {
    return placeResponseSchema;
  }

  public static fromJSON(json: TSJSON): PlaceResponse {
    const validJSON = this.constructorValidator().parse(json);
    return new PlaceResponse(validJSON);
  }
}
