import { z } from 'zod';
export const VehicleSchema = z.union([
  z.literal('car'),
  z.literal('bike'),
  z.literal('foot'),
  z.literal('motorcycle'),
]);
