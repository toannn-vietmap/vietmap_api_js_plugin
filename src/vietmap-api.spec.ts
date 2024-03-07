import * as dotenv from 'dotenv';
import { beforeAll, describe, expect, test } from 'vitest';
import { z } from 'zod';
import { VietmapApi } from './vietmap-api';
import { ReverseResponse, SearchRequest, SearchResponse } from './models';

dotenv.config();

const envVariables = z
  .object({
    VIETMAP_API_KEY: z.string(),
  })
  .parse(process.env);

describe('Vietmap Api Module', () => {
  let vietmapApi: VietmapApi;
  beforeAll(() => {
    vietmapApi = new VietmapApi({
      apiKey: envVariables.VIETMAP_API_KEY,
    });
  });

  // test('Reverse api', async () => {
  //   const latitude = 35.71619;
  //   const longitude = 51.36247;
  //   const res = await vietmapApi.reverse({
  //     latitude,
  //     longitude,
  //     '6411732992b3c4def7a117893215b9163a15e69065c0874d'
  //   });
  //   expect(res).toBeInstanceOf(ReverseResponse);
  // });
 

  test('Search api', async () => {
    const searchResponseList = await vietmapApi.search(
      new SearchRequest({ text: 'VIetmap', apikey: '6411732992b3c4def7a117893215b9163a15e69065c0874d', focus:[10, 106] }),
    );
    expect(searchResponseList[0]).toBeInstanceOf(SearchResponse);
  });

  test('Autocomplete Search api', async () => {
    const autoCompleteSearchResponseList = await vietmapApi.autoCompleteSearch(
      new  SearchRequest({ text: 'VIetmap', apikey: '6411732992b3c4def7a117893215b9163a15e69065c0874d', focus:[10, 106] }),
    );
    expect(autoCompleteSearchResponseList[0]).toBeInstanceOf(SearchResponse);
  });
});
