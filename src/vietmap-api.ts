import Axios, { AxiosHeaders, AxiosInstance, AxiosResponse } from 'axios';
import {
  VietmapApiHeaders as VietmapApiHeaders,
  ReverseRequest,
  ReverseResponse,
  SearchRequest,
  SearchResponse,
} from './models';
import { TSJSON, TSearchResponse } from './types';

export class VietmapApi {
  private _axios: AxiosInstance;

  // private _headers: VietmapApiHeaders;

  public constructor({
    apiKey,
    baseURL = 'https://maps.vietmap.vn',
  }: {
    apiKey: string;
    baseURL?: string;
  }) {
    // this._headers = new VietmapApiHeaders(apiKey);
    this._axios = Axios.create({
      baseURL, 
      headers: new AxiosHeaders({ 
        'content-type': 'application/json',
      }),
    });
  }

  public search(inputs: SearchRequest): Promise<Array<SearchResponse>> {
    return this._axios
      .post<
        TSearchResponse,
        AxiosResponse<TSearchResponse>,
        SearchRequest
      >('/api/search/v3', inputs)
      .then((response: AxiosResponse<TSearchResponse>) => {
        return response.data.value.map((item: TSJSON) =>
          SearchResponse.fromJSON(item),
        );
      });
  }

  public autoCompleteSearch(
    inputs: SearchRequest,
  ): Promise<Array<SearchResponse>> {
    return this._axios
      .post<
        TSearchResponse,
        AxiosResponse<TSearchResponse>,
        SearchRequest
      >('/api/autocomplete/v3', inputs)
      .then((response) =>
        response.data.value.map((item: TSJSON) => SearchResponse.fromJSON(item)),
      );
  }
 

  public reverse(inputs: ReverseRequest): Promise<ReverseResponse> {
    return this._axios
      .get<TSJSON, AxiosResponse<TSJSON>>(`/api/reverse/v3`, {
        params: {
          lat: inputs.latitude,
          lon: inputs.longitude,
          apikey: inputs.apikey
        },
      })
      .then((response: AxiosResponse<TSJSON>) =>
        ReverseResponse.fromJSON(response.data),
      );
  }
}
