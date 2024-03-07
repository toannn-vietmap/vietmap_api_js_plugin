import Axios, {  AxiosInstance, AxiosResponse } from 'axios';
import { 
  ReverseRequest,
  ReverseResponse,
  SearchRequest,
  SearchResponse,
} from './models';
import { TSJSON, TSearchResponse } from './types';

export class VietmapApi {
  private _axios: AxiosInstance;
  private _apiKey: string

  public constructor({
    apiKey,
    baseURL = 'https://maps.vietmap.vn',
  }: {
    apiKey: string;
    baseURL?: string;
  }) {
    this._apiKey = apiKey
    this._axios = Axios.create({
      baseURL,
    });
  }

  public search(inputs: SearchRequest): Promise<SearchResponse[]> {
    inputs.apikey ??= this._apiKey 

    return this._axios
      .get<
      TSJSON,
        AxiosResponse<TSJSON[]>,
        SearchRequest
      >('/api/search/v3',   {params: inputs})
      .then((response: AxiosResponse<TSJSON[]>) => {
        return response.data.map((item: TSJSON) =>
          SearchResponse.fromJSON(item),
        );
      });
  }

  public autoCompleteSearch(
    inputs: SearchRequest
  ): Promise<SearchResponse[]> {
  
    return this._axios
      .get<
        TSearchResponse,
        AxiosResponse<TSJSON[]>,
        SearchRequest
      >('/api/autocomplete/v3',  {params: inputs})
      .then((response: AxiosResponse<TSJSON[]>) => {
        return response.data.map((item: TSJSON) => 
           SearchResponse.fromJSON(item)
        );
      });
  }

  public reverse(inputs: ReverseRequest): Promise<ReverseResponse> {

    const req = new ReverseRequest(
      {
        latitude: inputs.latitude,
        longitude: inputs.longitude,
        apikey: inputs.apikey??this._apiKey
      }
    )
    return this._axios
      .get<TSJSON, AxiosResponse<TSJSON[]>>(`/api/reverse/v3`, {
        params: {
          lat: req.latitude,
          lng: req.longitude,
          apikey: req.apikey
        }
      })
      .then((response: AxiosResponse<TSJSON[]>) =>
        ReverseResponse.fromJSON(response.data[0])
      );
  }
  public vietmapStyleUrl(apiKey?: string): string {
    const apikey = apiKey??this._apiKey
    return `https://maps.vietmap.vn/api/maps/light/styles.json?apikey=${apikey}`;
  }
  public vietmapRasterTile(
    apiKey?: string,
    mode?: 'default' | 'light' | 'dark',
  ): string {
    const apikey = apiKey??this._apiKey
    if (mode == 'dark')
      return `https://maps.vietmap.vn/api/dm/{z}/{x}/{y}@2x.png?apikey=${apikey}`;
    if (mode == 'light')
      return `https://maps.vietmap.vn/api/lm/{z}/{x}/{y}@2x.png?apikey=${apikey}`;
    return `https://maps.vietmap.vn/api/tm/{z}/{x}/{y}@2x.png?apikey=${apikey}`;
  }

}
