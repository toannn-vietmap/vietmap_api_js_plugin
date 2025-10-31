export class Polyline {
  private py2_round(value: number): number {
    // Google's polyline algorithm uses the same rounding strategy as Python 2, which is different from JS for negative values
    return Math.floor(Math.abs(value) + 0.5) * (value >= 0 ? 1 : -1);
  }

  private _encode(current: number, previous: number, factor: number): string {
    current = this.py2_round(current * factor);
    previous = this.py2_round(previous * factor);
    let coordinate = (current - previous) * 2;
    if (coordinate < 0) {
      coordinate = -coordinate - 1;
    }
    let output = '';
    while (coordinate >= 0x20) {
      output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
      coordinate /= 32;
    }
    output += String.fromCharCode((coordinate | 0) + 63);
    return output;
  }

  /**
   * Decodes to a [latitude, longitude] coordinates array.
   */
  public decode(str: string, precision: number): [number, number][] {
    let index = 0,
      lat = 0,
      lng = 0,
      coordinates: [number, number][] = [],
      shift = 0,
      result = 0,
      byte: number | null = null,
      latitude_change: number,
      longitude_change: number,
      factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {
      // Reset shift, result, and byte
      byte = null;
      shift = 1;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result += (byte & 0x1f) * shift;
        shift *= 32;
      } while (byte >= 0x20);

      latitude_change = result & 1 ? (-result - 1) / 2 : result / 2;

      shift = 1;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result += (byte & 0x1f) * shift;
        shift *= 32;
      } while (byte >= 0x20);

      longitude_change = result & 1 ? (-result - 1) / 2 : result / 2;

      lat += latitude_change;
      lng += longitude_change;

      coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
  }

  /**
   * Decodes to a [longitude, latitude] coordinates array.
   */
  public decodeLongLat(str: string, precision: number): [number, number][] {
    let index = 0,
      lat = 0,
      lng = 0,
      coordinates: [number, number][] = [],
      shift = 0,
      result = 0,
      byte: number | null = null,
      latitude_change: number,
      longitude_change: number,
      factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {
      // Reset shift, result, and byte
      byte = null;
      shift = 1;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result += (byte & 0x1f) * shift;
        shift *= 32;
      } while (byte >= 0x20);

      latitude_change = result & 1 ? (-result - 1) / 2 : result / 2;

      shift = 1;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result += (byte & 0x1f) * shift;
        shift *= 32;
      } while (byte >= 0x20);

      longitude_change = result & 1 ? (-result - 1) / 2 : result / 2;

      lat += latitude_change;
      lng += longitude_change;

      coordinates.push([lng / factor, lat / factor]);
    }

    return coordinates;
  }

  /**
   * Encodes the given [latitude, longitude] coordinates array.
   *
   * @param {Array.<Array.<Number>>} coordinates
   * @param {Number} precision
   * @returns {String}
   */
  public encode(coordinates: [number, number][], precision: number): string {
    if (!coordinates.length) {
      return '';
    }

    const factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);
    let output =
      this._encode(coordinates[0][0], 0, factor) +
      this._encode(coordinates[0][1], 0, factor);

    for (let i = 1; i < coordinates.length; i++) {
      const a = coordinates[i],
        b = coordinates[i - 1];
      output += this._encode(a[0], b[0], factor);
      output += this._encode(a[1], b[1], factor);
    }

    return output;
  }

  private flipped(coords: [number, number][]): [number, number][] {
    const flipped: [number, number][] = [];
    for (const coord of coords) {
      const item = coord.slice();
      flipped.push([item[1], item[0]]);
    }
    return flipped;
  }

  /**
   * Encodes a GeoJSON LineString feature/geometry.
   *
   * @param {Object} geojson
   * @param {Number} precision
   * @returns {String}
   */
  // export function fromGeoJSON(geojson: { type: string coordinates: [number, number][] }, precision: number): string {
  //   if (geojson && geojson.type === 'Feature') {
  //     geojson = geojson.geometry
  //   }
  //   if (!geojson || geojson.type !== 'LineString') {
  //     throw new Error('Input must be a GeoJSON LineString')
  //   }
  //   return encode(flipped(geojson.coordinates), precision)
  // }

  /**
   * Decodes to a GeoJSON LineString geometry.
   *
   * @param {String} str
   * @param {Number} precision
   * @returns {Object}
   */
  public toGeoJSON(
    str: string,
    precision: number,
  ): { type: string; coordinates: [number, number][] } {
    const coords = this.decode(str, precision);
    return {
      type: 'LineString',
      coordinates: this.flipped(coords),
    };
  }
}
