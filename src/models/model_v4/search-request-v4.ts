import { SearchDisplayType } from '../../types/result-display.type';
import { SearchRequest } from '../search-request';
import { z } from 'zod';
import { layers } from '../../types/layer.type';

const searchRequestV4Schema = z.object({
  text: z.string(),
  apiKey: z.string(),
  focus: z.string().optional(),
  displayType: z.nativeEnum(SearchDisplayType).optional(),
  layers: z.nativeEnum(layers).optional(),
  circleCenter: z.number().optional(),
  circleRadius: z.number().optional(),
  cats: z.string().optional(),
  cityId: z.number().optional(),
  wardId: z.number().optional(),
  distId: z.number().optional(),
});

export class SearchRequestV4 extends SearchRequest {
  public displayType?: SearchDisplayType;

  public layers?: layers;

  public circleCenter?: number;

  public circleRadius?: number;

  public cats?: string;

  public cityId?: number;

  public wardId?: number;

  public distId?: number;

  constructor({
    text,
    apikey,
    focus,
    displayType,
    layers,
    circleCenter,
    circleRadius,
    cats,
    cityId,
    wardId,
    distId,
  }: {
    text: string;
    apikey: string;
    focus?: [number, number];
    displayType?: SearchDisplayType;
    layers?: layers;
    circleCenter?: number;
    circleRadius?: number;
    cats?: string;
    cityId?: number;
    wardId?: number;
    distId?: number;
  }) {
    super({ text, apikey, focus });
    this.displayType = displayType;
    this.layers = layers;
    this.circleCenter = circleCenter;
    this.circleRadius = circleRadius;
    this.cats = cats;
    this.cityId = cityId;
    this.wardId = wardId;
    this.distId = distId;
  }

  public static constructorValidatorV4() {
    return searchRequestV4Schema;
  }
}
