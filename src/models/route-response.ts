import { ZodError, z } from 'zod';
import { TSJSON } from '../types';

const instructionSchema = z.object({
  distance: z.number(),
  heading: z.number(),
  sign: z.number(),
  interval: z.array(z.number()),
  text: z.string(),
  time: z.number(),
  street_name: z.string(),
  last_heading: z.nullable(z.number()),
});

const pathSchema = z.object({
  distance: z.number(),
  weight: z.number(),
  time: z.number(),
  transfers: z.number(),
  points_encoded: z.boolean(),
  bbox: z.array(z.number()),
  points: z.any(),
  instructions: z.array(instructionSchema),
  snapped_waypoints: z.any(),
});

const responseSchema = z.object({
  license: z.string(),
  code: z.string(),
  messages: z.nullable(z.string()),
  paths: z.array(pathSchema),
});

// const validatedData = responseSchema.parse(responseData);
// console.log(validatedData);

class Instruction {
  distance: number;
  heading: number;
  sign: number;
  interval: number[];
  text: string;
  time: number;
  street_name: string;
  last_heading: number | null;

  constructor({
    distance,
    heading,
    sign,
    interval,
    text,
    time,
    street_name,
    last_heading,
  }: {
    distance: number;
    heading: number;
    sign: number;
    interval: number[];
    text: string;
    time: number;
    street_name: string;
    last_heading: number | null;
  }) {
    this.distance = distance;
    this.heading = heading;
    this.sign = sign;
    this.interval = interval;
    this.text = text;
    this.time = time;
    this.street_name = street_name;
    this.last_heading = last_heading;
  }

  public static fromJSON(json: TSJSON): Instruction {
    const validJSON = instructionSchema.parse(json);
    return new Instruction(validJSON);
  }
}

class Path {
  distance: number;
  weight: number;
  time: number;
  transfers: number;
  points_encoded: boolean;
  bbox: number[];
  points: any;
  instructions: Instruction[];
  snapped_waypoints: any;

  constructor({
    distance,
    weight,
    time,
    transfers,
    points_encoded,
    bbox,
    points,
    instructions,
    snapped_waypoints,
  }: {
    distance: number;
    weight: number;
    time: number;
    transfers: number;
    points_encoded: boolean;
    bbox: number[];
    points: any;
    instructions: Instruction[];
    snapped_waypoints: any;
  }) {
    this.distance = distance;
    this.weight = weight;
    this.time = time;
    this.transfers = transfers;
    this.points_encoded = points_encoded;
    this.bbox = bbox;
    this.points = points;
    this.instructions = instructions;
    this.snapped_waypoints = snapped_waypoints;
  }

  public static fromJSON(json: TSJSON): Path {
    const validJSON = pathSchema.parse(json);
    return new Path(validJSON);
  }
}

export class RouteResponse {
  license: string;
  code: string;
  messages: null | string;
  paths: Path[];
  constructor({
    license,
    code,
    messages,
    paths,
  }: {
    license: string;
    code: string;
    messages: null | string;
    paths: Path[];
  }) {
    this.license = license;
    this.code = code;
    this.messages = messages;
    this.paths = paths;
  }

  static fromJSON(json: TSJSON): RouteResponse {
    try {
      const validatedData = responseSchema.parse(json);
      return new RouteResponse(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Validation error:', error.errors);
      } else {
        console.error('Error parsing data:', error);
      }
      console.error(error);
      throw error;
    }
  }
}
