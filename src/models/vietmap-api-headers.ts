export class VietmapApiHeaders {
  private _apiKey: string;

  private _contentType = 'application/json';

  public constructor(apiKey: string) {
    this._apiKey = apiKey;
  }

  public toJSON(): Record<string, string> {
    return {
      'content-type': this._contentType,
    };
  }
}
