import { z } from 'zod';

export const latitudeSchema = z.number().min(-90).max(90);
