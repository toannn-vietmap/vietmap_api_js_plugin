export type LatLng = [number, number];

export enum Unit {
  meters,
  millimeters,
  centimeters,
  kilometers,
  acres,
  miles,
  nauticalmiles,
  inches,
  yards,
  feet,
  radians,
  degrees,
}

const earthRadius = 6371008.8;

export const factors: Record<Unit, number> = {
  [Unit.centimeters]: earthRadius * 100,
  [Unit.degrees]: earthRadius / 111325,
  [Unit.feet]: earthRadius * 3.28084,
  [Unit.inches]: earthRadius * 39.37,
  [Unit.kilometers]: earthRadius / 1000,
  [Unit.meters]: earthRadius,
  [Unit.miles]: earthRadius / 1609.344,
  [Unit.millimeters]: earthRadius * 1000,
  [Unit.nauticalmiles]: earthRadius / 1852,
  [Unit.radians]: 1,
  [Unit.yards]: earthRadius / 1.0936,
  [Unit.acres]: 40468564.224,
};

export class NearestLatLngResult {
  point: LatLng;

  distance: number;

  index: number;

  location: number;

  constructor(
    point: LatLng,
    distance: number,
    index: number,
    location: number,
  ) {
    this.point = point;
    this.distance = distance;
    this.index = index;
    this.location = location;
  }

  toJson() {
    return {
      point: this.point,
      distance: this.distance,
      index: this.index,
      location: this.location,
    };
  }
}

export class VietmapPolyline {
  private static _nearestLatLngOnLine(
    line: LatLng[],
    point: LatLng,
    unit: Unit = Unit.kilometers,
    isGetStop = false,
  ): NearestLatLngResult | null {
    let nearest: NearestLatLngResult | null = null;

    let length = 0;
    let stopP: NearestLatLngResult | null = null;
    for (let i = 0; i < line.length - 1; ++i) {
      const startCoordinates = line[i];
      const stopCoordinates = line[i + 1];

      const startLatLng = startCoordinates;
      const stopLatLng = stopCoordinates;

      const sectionLength = VietmapPolyline._distance(
        startLatLng,
        stopLatLng,
        unit,
      );

      const start = new NearestLatLngResult(
        startLatLng,
        VietmapPolyline._distance(point, startLatLng, unit),
        i,
        length,
      );

      const stop = new NearestLatLngResult(
        stopLatLng,
        VietmapPolyline._distance(point, stopLatLng, unit),
        i + 1,
        length + sectionLength,
      );

      const heightDistance = Math.max(start.distance, stop.distance);
      const direction = VietmapPolyline._bearing(startLatLng, stopLatLng);

      const perpendicular1 = VietmapPolyline._destination(
        point,
        heightDistance,
        direction + 90,
        unit,
      );

      const perpendicular2 = VietmapPolyline._destination(
        point,
        heightDistance,
        direction - 90,
        unit,
      );

      const intersectionLatLng = VietmapPolyline._intersects(
        [perpendicular1, perpendicular2],
        [startLatLng, stopLatLng],
      );

      let intersection: NearestLatLngResult | null = null;

      if (intersectionLatLng != null) {
        intersection = new NearestLatLngResult(
          intersectionLatLng,
          VietmapPolyline._distance(point, intersectionLatLng, unit),
          i,
          length +
            VietmapPolyline._distance(startLatLng, intersectionLatLng, unit),
        );
      }

      if (nearest === null || start.distance < nearest.distance) {
        nearest = start;
      }

      if (stop.distance < nearest.distance) {
        nearest = stop;
        stopP = stop;
      }

      if (intersection !== null && intersection.distance < nearest.distance) {
        nearest = intersection;
      }

      length += sectionLength;
    }

    return isGetStop ? stopP : nearest;
  }

  static nearestLatLngOnLine(
    line: LatLng[],
    point: LatLng,
    unit: Unit = Unit.kilometers,
  ): NearestLatLngResult | null {
    return VietmapPolyline._nearestLatLngOnLine(line, point, unit);
  }

  static splitRouteByLatLng(
    line: LatLng[],
    point: LatLng,
    {
      unit = Unit.kilometers,
      snapInputLatLngToResult = true,
    }: { unit?: Unit; snapInputLatLngToResult?: boolean } = {},
  ): [LatLng[], LatLng[]] {
    const res = VietmapPolyline._nearestLatLngOnLine(line, point, unit, true);
    const line1 = line.slice(0, res?.index ?? -1 + 1);
    if (snapInputLatLngToResult) {
      line1.push(point);
    }
    const line2 = line.slice(res?.index ?? -1 + 1, line.length);
    if (snapInputLatLngToResult) {
      line2.unshift(point);
    }
    return [line1, line2];
  }

  private static _distance(
    from: LatLng,
    to: LatLng,
    unit: Unit = Unit.kilometers,
  ): number {
    return VietmapPolyline._distanceRaw(from, to, unit);
  }

  private static _distanceRaw(
    from: LatLng,
    to: LatLng,
    unit: Unit = Unit.kilometers,
  ): number {
    const dLat = VietmapPolyline._degreesToRadians(to[0] - from[0]);
    const dLon = VietmapPolyline._degreesToRadians(to[1] - from[1]);
    const lat1 = VietmapPolyline._degreesToRadians(from[0]);
    const lat2 = VietmapPolyline._degreesToRadians(to[0]);

    const a =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);

    return VietmapPolyline._radiansToLength(
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
      unit,
    );
  }

  private static _degreesToRadians(degrees: number): number {
    const radians = degrees % 360;
    return (radians * Math.PI) / 180;
  }

  private static _radiansToLength(
    radians: number,
    unit: Unit = Unit.kilometers,
  ): number {
    const factor = factors[unit];
    if (factor === undefined) {
      throw new Error(`${unit} units is invalid`);
    }
    return radians * factor;
  }

  private static _bearingRaw(
    start: LatLng,
    end: LatLng,
    calcFinal = false,
  ): number {
    if (calcFinal) {
      return VietmapPolyline._calculateFinalBearingRaw(start, end);
    }

    const lng1 = VietmapPolyline._degreesToRadians(start[1]);
    const lng2 = VietmapPolyline._degreesToRadians(end[1]);
    const lat1 = VietmapPolyline._degreesToRadians(start[0]);
    const lat2 = VietmapPolyline._degreesToRadians(end[0]);
    const a = Math.sin(lng2 - lng1) * Math.cos(lat2);
    const b =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);

    return VietmapPolyline._radiansToDegrees(Math.atan2(a, b));
  }

  private static _bearing(
    start: LatLng,
    end: LatLng,
    calcFinal = false,
  ): number {
    return VietmapPolyline._bearingRaw(start, end, calcFinal);
  }

  private static _calculateFinalBearingRaw(start: LatLng, end: LatLng): number {
    const reverseBearing = VietmapPolyline._bearingRaw(end, start) + 180;
    return reverseBearing % 360;
  }

  private static _radiansToDegrees(radians: number): number {
    const degrees = radians % (2 * Math.PI);
    return (degrees * 180) / Math.PI;
  }

  private static _destinationRaw(
    origin: LatLng,
    distance: number,
    bearing: number,
    unit: Unit = Unit.kilometers,
  ): LatLng {
    const longitude1 = VietmapPolyline._degreesToRadians(origin[1]);
    const latitude1 = VietmapPolyline._degreesToRadians(origin[0]);
    const bearingRad = VietmapPolyline._degreesToRadians(bearing);
    const radians = VietmapPolyline._lengthToRadians(distance, unit);

    const latitude2 = Math.asin(
      Math.sin(latitude1) * Math.cos(radians) +
        Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearingRad),
    );
    const longitude2 =
      longitude1 +
      Math.atan2(
        Math.sin(bearingRad) * Math.sin(radians) * Math.cos(latitude1),
        Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2),
      );

    return [
      VietmapPolyline._radiansToDegrees(latitude2),
      VietmapPolyline._radiansToDegrees(longitude2),
    ];
  }

  private static _destination(
    origin: LatLng,
    distance: number,
    bearing: number,
    unit: Unit = Unit.kilometers,
  ): LatLng {
    return VietmapPolyline._destinationRaw(origin, distance, bearing, unit);
  }

  private static _lengthToRadians(
    distance: number,
    unit: Unit = Unit.kilometers,
  ): number {
    const factor = factors[unit];
    if (factor === undefined) {
      throw new Error(`${unit} units is invalid`);
    }
    return distance / factor;
  }

  private static _intersects(line1: LatLng[], line2: LatLng[]): LatLng | null {
    if (line1.length !== 2) {
      throw new Error('line1 must only contain 2 coordinates');
    }

    if (line2.length !== 2) {
      throw new Error('line2 must only contain 2 coordinates');
    }

    const x1 = line1[0][1];
    const y1 = line1[0][0];
    const x2 = line1[1][1];
    const y2 = line1[1][0];
    const x3 = line2[0][1];
    const y3 = line2[0][0];
    const x4 = line2[1][1];
    const y4 = line2[1][0];

    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    if (denom === 0) {
      return null;
    }

    const numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
    const numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

    const uA = numeA / denom;
    const uB = numeB / denom;

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      const x = x1 + uA * (x2 - x1);
      const y = y1 + uA * (y2 - y1);

      return [y, x];
    }

    return null;
  }
}
