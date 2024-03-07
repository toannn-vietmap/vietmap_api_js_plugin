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

  test('Reverse api', async () => {
    const latitude = 35.71619;
    const longitude = 51.36247;
    const apikey = envVariables.VIETMAP_API_KEY
    
    const res = await vietmapApi.reverse({
      latitude,
      longitude, 
      apikey
    })
    .then((value)=>{
      expect(value).toBeInstanceOf(ReverseResponse)
    })
    // expect(res).toBeInstanceOf(ReverseResponse)
  });
 

  test('Search api', async () => { 
     vietmapApi.search(
      new SearchRequest({ text: 'VIetmap', apikey: envVariables.VIETMAP_API_KEY}),
    ).then((searchResponseList)=>{ 
      expect(searchResponseList[0]).toBeInstanceOf(SearchResponse);
    })
    
  });

  test('Autocomplete Search api', async () => { vietmapApi.autoCompleteSearch(
      new  SearchRequest({ text: 'VIetmap', apikey: envVariables.VIETMAP_API_KEY, focus:[10, 106] }),
    ).then((autoCompleteSearchResponseList)=>{ 
      expect(autoCompleteSearchResponseList[0]).toBeInstanceOf(SearchResponse);
    })
  });
});
