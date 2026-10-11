import { z } from 'zod';

export const ApiErrorSchema = z.object({
  code: z.enum(['VALIDATION_ERROR', 'NOT_FOUND', 'SLOT_ALREADY_BOOKED', 'INTERNAL']),
  message: z.string(),
  /** field name -> list of messages (only for VALIDATION_ERROR) */
  fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;
