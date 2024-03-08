import Axios, {
  AxiosInstance,
  AxiosResponse
} from 'axios';

import {
  ReverseRequest,
  ReverseResponse,
  SearchRequest,
  RouteRequest,
  SearchResponse,
  RouteResponse,
} from './models';
import { TSJSON, TSearchResponse, Latitude, Longitude } from './types'; 

export class VietmapApi {
  private _axios: AxiosInstance;

  public constructor({
    baseURL = 'https://maps.vietmap.vn',
  }: {
    baseURL?: string;
  }) {
    this._axios = Axios.create({
      baseURL,
    });
  }

  public search(inputs: SearchRequest): Promise<SearchResponse[]> {
    return this._axios
      .get<
        TSJSON,
        AxiosResponse<TSJSON[]>,
        SearchRequest
      >('/api/search/v3', { params: inputs })
      .then((response: AxiosResponse<TSJSON[]>) => {
        return response.data.map((item: TSJSON) =>
          SearchResponse.fromJSON(item),
        );
      });
  }

  public autoCompleteSearch(inputs: SearchRequest): Promise<SearchResponse[]> {
    return this._axios
      .get<
        TSearchResponse,
        AxiosResponse<TSJSON[]>,
        SearchRequest
      >('/api/autocomplete/v3', { params: inputs })
      .then((response: AxiosResponse<TSJSON[]>) => {
        return response.data.map((item: TSJSON) =>
          SearchResponse.fromJSON(item),
        );
      });
  }

  public reverse(inputs: ReverseRequest): Promise<ReverseResponse> {
    return this._axios
      .get<TSJSON, AxiosResponse<TSJSON[]>>(`/api/reverse/v3`, {
        params: {
          lat: inputs.latitude,
          lng: inputs.longitude,
          apikey: inputs.apikey,
        },
      })
      .then((response: AxiosResponse<TSJSON[]>) =>
        ReverseResponse.fromJSON(response.data[0]),
      );
  }

  private convertPointsToUrlParams(points: [Latitude, Longitude][]): string {
    if (!points || points.length === 0) {
      return '';
    }

    const paramsString = points
      .map(([lat, long]) => `&point=${lat},${long}`)
      .join('');
    return paramsString;
  }

  public route(
    points: [Latitude, Longitude][],
    inputs?: RouteRequest,
  ): Promise<RouteResponse> {
    var pointReq = this.convertPointsToUrlParams(points);
    return this._axios
      .get<
        TSJSON,
        AxiosResponse<TSJSON>
      >(`/api/route?api-version=1.1${pointReq}`, { params: inputs })
      .then((response: AxiosResponse<TSJSON>) => {
        return  RouteResponse.fromJSON(response.data)
        
      });
  }
  public vietmapStyleUrl(apiKey: string): string {
    const apikey = apiKey;
    return `https://maps.vietmap.vn/api/maps/light/styles.json?apikey=${apikey}`;
  }
  public vietmapRasterTile(
    apikey: string,
    mode?: 'default' | 'light' | 'dark',
  ): string {
    if (mode == 'dark')
      return `https://maps.vietmap.vn/api/dm/{z}/{x}/{y}@2x.png?apikey=${apikey}`;
    if (mode == 'light')
      return `https://maps.vietmap.vn/api/lm/{z}/{x}/{y}@2x.png?apikey=${apikey}`;
    return `https://maps.vietmap.vn/api/tm/{z}/{x}/{y}@2x.png?apikey=${apikey}`;
  }
}
