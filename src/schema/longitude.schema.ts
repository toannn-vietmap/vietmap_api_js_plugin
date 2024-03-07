import { z } from 'zod';

export const longitudeSchema = z.number().min(-180).max(180);
