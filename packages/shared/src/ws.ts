import { z } from 'zod';

export const ClientMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('subscribe'), doctorId: z.string().min(1) }),
  z.object({ type: z.literal('unsubscribe'), doctorId: z.string().min(1) }),
]);
export type ClientMessage = z.infer<typeof ClientMessageSchema>;

export const ServerMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('slot:booked'), doctorId: z.string(), slotId: z.string() }),
  z.object({ type: z.literal('slot:released'), doctorId: z.string(), slotId: z.string() }),
  z.object({ type: z.literal('error'), message: z.string() }),
]);
export type ServerMessage = z.infer<typeof ServerMessageSchema>;
