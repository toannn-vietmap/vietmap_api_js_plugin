import * as dotenv from 'dotenv';
import { beforeAll, describe, expect, test } from 'vitest';
import { number, z } from 'zod';
import { VietmapApi } from './vietmap-api';
import {
  PlaceRequest,
  PlaceResponse,
  ReverseResponse,
  RouteRequest,
  RouteResponse,
  SearchRequest,
  SearchResponse,
} from './models';
import { Polyline } from './helper';
dotenv.config();

const envVariables = z
  .object({
    VIETMAP_API_KEY: z.string(),
  })
  .parse(process.env);

describe('Vietmap Api Module', () => {
  let vietmapApi: VietmapApi;
  const util = require('util');

  beforeAll(() => {
    vietmapApi = new VietmapApi({});
  });

  test('Reverse api', async () => {
    const latitude = 35.71619;
    const longitude = 51.36247;
    const apikey = envVariables.VIETMAP_API_KEY;
    const res = await vietmapApi.reverse({
      latitude,
      longitude,
      apikey,
    });
    expect(res).toBeInstanceOf(ReverseResponse);
  });

  test('Search api', async () => {
    const res = await vietmapApi.search(
      new SearchRequest({
        text: 'Vietmap',
        apikey: envVariables.VIETMAP_API_KEY,
      }),
    );
    expect(res[0]).toBeInstanceOf(SearchResponse);
  });

  test('Route api', async () => {
    const res = await vietmapApi.route(
      [
        [10.79628438955497, 106.70592293472612],
        [10.801891047584164, 106.70660958023404],
      ],
      new RouteRequest({
        vehicle: 'car',
        apikey: envVariables.VIETMAP_API_KEY,
        points_encoded: true,
        optimize: true,
      }),
    );
    expect(res).toBeInstanceOf(RouteResponse);
  });

  test('Autocomplete Search api', async () => {
    const res = await vietmapApi.autoCompleteSearch(
      new SearchRequest({
        text: 'Vietmap',
        apikey: envVariables.VIETMAP_API_KEY,
        focus: [10, 106],
      }),
    );
    expect(res[0]).toBeInstanceOf(SearchResponse);
  });

  test('Place api', async () => {
    const apikey = envVariables.VIETMAP_API_KEY;
    const res = await vietmapApi.place(
      new PlaceRequest({
        refId: 'vm:ADDRESS:8D92EB120DDE9996',
        apikey
      }),
    );
    expect(res).toBeInstanceOf(PlaceResponse);
  });
});
