import { z } from 'zod';
import { PropertyType } from '@prisma/client';

export const createPropertySchema = z.object({
  name: z.string().min(2, 'Property name is required').max(100),
  description: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  country: z.string().default('Kenya'),
  zipCode: z.string().optional(),
  type: z.nativeEnum(PropertyType).default(PropertyType.APARTMENT),
});

export const updatePropertySchema = createPropertySchema.partial();

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;