import { z } from 'zod';

export const SlotSchema = z.object({
  id: z.string(),
  doctorId: z.string(),
  /** ISO 8601 in UTC, e.g. 2025-01-01T05:30:00.000Z */
  startsAt: z.string().datetime(),
  isBooked: z.boolean(),
});
export type Slot = z.infer<typeof SlotSchema>;
