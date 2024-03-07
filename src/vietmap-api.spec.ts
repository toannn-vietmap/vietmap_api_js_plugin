import * as dotenv from 'dotenv';
import { beforeAll, describe, expect, test } from 'vitest';
import { z } from 'zod';
import { VietmapApi } from './vietmap-api';
import { ReverseResponse, SearchRequest, SearchResponse } from './models';

dotenv.config();

const envVariables = z
  .object({
    VIETMAP_API_KEY: z.string()
  })
  .parse(process.env)

describe('Vietmap Api Module', () => {
  let vietmapApi: VietmapApi;
  const util = require('util')


  beforeAll(() => {
    vietmapApi = new VietmapApi({
      apiKey: envVariables.VIETMAP_API_KEY,
    })
  })

  test('Reverse api', async () => {
    const latitude = 35.71619;
    const longitude = 51.36247; 
    
   const res = await vietmapApi.reverse({
      latitude,
      longitude
    }) 
    expect(res).toBeInstanceOf(ReverseResponse)
  })

  test('Search api', async () => { 
    const res = await vietmapApi.search(
      new SearchRequest({ text: 'Vietmap',apikey: envVariables.VIETMAP_API_KEY,}),
    ) 
    expect(res[0]).toBeInstanceOf(SearchResponse)
  })

  test('Autocomplete Search api', async () => {
    const res = await vietmapApi.autoCompleteSearch(
      new  SearchRequest({ text: 'Vietmap', apikey: envVariables.VIETMAP_API_KEY, focus:[10, 106] }),

    )
    expect(res[0]).toBeInstanceOf(SearchResponse);
  })
})
