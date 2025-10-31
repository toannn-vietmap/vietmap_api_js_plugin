import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { handleApiError } from './exception';
import {
  MigrateAddressRequestV4,
  MigrateAddressResponseV4,
  PlaceRequest,
  PlaceResponse,
  ReverseRequest,
  ReverseRequestV4,
  ReverseResponse,
  ReverseResponseV4,
  RouteRequest,
  RouteResponse,
  SearchRequest,
  SearchRequestV4,
  SearchResponse,
  SearchResponseV4,
  TSPRequest,
} from './models';
import {
  Latitude,
  Longitude,
  TileMapType,
  TPlaceResponse,
  TSearchResponse,
  TSJSON,
} from './types';

export class VietmapApi {
  private _axios: AxiosInstance;

  constructor({ baseURL = 'https://maps.vietmap.vn' }: { baseURL?: string }) {
    this._axios = Axios.create({
      baseURL,
    });
  }

  public search(inputs: SearchRequest): Promise<SearchResponse[]> {
    return this._axios
      .get<TSJSON, AxiosResponse<TSJSON[]>, SearchRequest>('/api/search/v3', {
        params: inputs,
      })
      .then((response: AxiosResponse<TSJSON[]>) => {
        try {
          return response.data.map((item: TSJSON) =>
            SearchResponse.fromJSON(item),
          );
        } catch (error) {
          handleApiError(error);
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  public searchV4(inputs: SearchRequestV4): Promise<SearchResponseV4[]> {
    return this._axios
      .get<TSJSON, AxiosResponse<TSJSON[]>, SearchRequestV4>('/api/search/v4', {
        params: inputs,
      })
      .then((response: AxiosResponse<TSJSON[]>) => {
        try {
          return response.data.map((item: TSJSON) => {
            return SearchResponseV4.fromJson(item);
          });
        } catch (error) {
          handleApiError(error);
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  public place(inputs: PlaceRequest): Promise<PlaceResponse> {
    return this._axios
      .get<TPlaceResponse, AxiosResponse<TSJSON>, PlaceRequest>(
        '/api/place/v3',
        { params: inputs },
      )
      .then((response: AxiosResponse<TSJSON>) => {
        try {
          return PlaceResponse.fromJSON(response.data);
        } catch (error) {
          handleApiError(error);
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  public placeV4(inputs: PlaceRequest): Promise<PlaceResponse> {
    return this._axios
      .get<TPlaceResponse, AxiosResponse<TSJSON>, PlaceRequest>(
        '/api/place/v4',
        { params: inputs },
      )
      .then((response: AxiosResponse<TSJSON>) => {
        try {
          return PlaceResponse.fromJSON(response.data);
        } catch (error) {
          handleApiError(error);
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  public autoCompleteSearch(inputs: SearchRequest): Promise<SearchResponse[]> {
    return this._axios
      .get<TSearchResponse, AxiosResponse<TSJSON[]>, SearchRequest>(
        '/api/autocomplete/v3',
        { params: inputs },
      )
      .then((response: AxiosResponse<TSJSON[]>) => {
        try {
          return response.data.map((item: TSJSON) =>
            SearchResponse.fromJSON(item),
          );
        } catch (error) {
          handleApiError(error);
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  public autoCompleteSearchV4(
    inputs: SearchRequestV4,
  ): Promise<SearchResponseV4[]> {
    return this._axios
      .get<TSJSON, AxiosResponse<TSJSON[]>, SearchRequestV4>(
        '/api/autocomplete/v4',
        { params: inputs },
      )
      .then((response: AxiosResponse<TSJSON[]>) => {
        try {
          return response.data.map((item: TSJSON) =>
            SearchResponseV4.fromJson(item),
          );
        } catch (error) {
          handleApiError(error);
        }
      })
      .catch((error) => {
        handleApiError(error);
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
      .then((response: AxiosResponse<TSJSON[]>) => {
        try {
          return ReverseResponse.fromJSON(response.data[0]);
        } catch (error) {
          handleApiError(error);
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  public reverseV4(inputs: ReverseRequestV4): Promise<ReverseResponseV4> {
    return this._axios
      .get<TSJSON, AxiosResponse<TSJSON[]>, ReverseRequestV4>(
        `/api/reverse/v4`,
        { params: inputs },
      )
      .then((response: AxiosResponse<TSJSON[]>) => {
        try {
          return ReverseResponseV4.fromJSON(response.data[0]);
        } catch (error) {
          handleApiError(error);
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
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
    const pointReq = this.convertPointsToUrlParams(points);
    return this._axios
      .get<TSJSON, AxiosResponse<TSJSON>>(
        `/api/route?api-version=1.1${pointReq}`,
        { params: inputs },
      )
      .then((response: AxiosResponse<TSJSON>) => {
        try {
          return RouteResponse.fromJSON(response.data);
        } catch (error) {
          handleApiError(error);
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  public tsp(
    points: [Latitude, Longitude][],
    inputs?: TSPRequest,
  ): Promise<RouteResponse> {
    const pointReq = this.convertPointsToUrlParams(points);
    return this._axios
      .get<TSJSON, AxiosResponse<TSJSON>>(
        `/api/tsp?api-version=1.1${pointReq}`,
        { params: inputs },
      )
      .then((response: AxiosResponse<TSJSON>) => {
        try {
          return RouteResponse.fromJSON(response.data);
        } catch (error) {
          handleApiError(error);
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  public migrateAddress(
    inputs: MigrateAddressRequestV4,
  ): Promise<MigrateAddressResponseV4> {
    return this._axios
      .get<TSJSON, AxiosResponse<TSJSON>, MigrateAddressRequestV4>(
        '/api/migrate-address/v3',
        { params: inputs },
      )
      .then((response: AxiosResponse<TSJSON>) => {
        try {
          return MigrateAddressResponseV4.fromJSON(response.data);
        } catch (error) {
          handleApiError(error);
        }
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  public vietmapStyleUrl(apiKey: string): string {
    const apikey = apiKey;
    return `https://maps.vietmap.vn/api/maps/light/styles.json?apikey=${apikey}`;
  }

  public getVietmapTile(apikey: string, typeMap: TileMapType): string {
    switch (typeMap) {
      case TileMapType.VECTOR_DEFAULT:
        return `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${apikey}`;
      case TileMapType.VECTOR_LIGHT:
        return `https://maps.vietmap.vn/maps/styles/lm/style.json?apikey=${apikey}`;
      case TileMapType.VECTOR_DARK:
        return `https://maps.vietmap.vn/maps/styles/dm/style.json?apikey=${apikey}`;
      case TileMapType.RASTER_DEFAULT:
        return `https://maps.vietmap.vn/maps/styles/tm/tiles.json?apikey=${apikey}`;
      case TileMapType.RASTER_LIGHT:
        return `https://maps.vietmap.vn/maps/styles/lm/tiles.json?apikey=${apikey}`;
      case TileMapType.RASTER_DARK:
        return `https://maps.vietmap.vn/maps/styles/dm/tiles.json?apikey=${apikey}`;
      default:
        return `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${apikey}`;
    }
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
