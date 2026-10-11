import { z } from 'zod';

/** Iranian mobile: 09xxxxxxxxx (also accepts +98 / 0098 / 98 prefixes). */
export const IRAN_MOBILE_REGEX = /^(?:\+98|0098|98|0)?9\d{9}$/;

export const AppointmentRequestSchema = z.object({
  doctorId: z.string().min(1, 'پزشک انتخاب نشده است'),
  slotId: z.string().min(1, 'زمان نوبت انتخاب نشده است'),
  patientName: z
    .string()
    .trim()
    .min(3, 'نام بیمار باید حداقل ۳ حرف باشد')
    .max(80, 'نام بیمار خیلی طولانی است'),
  phone: z.string().regex(IRAN_MOBILE_REGEX, 'شماره موبایل معتبر نیست'),
});
export type AppointmentRequest = z.infer<typeof AppointmentRequestSchema>;

export const AppointmentResponseSchema = z.object({
  id: z.string(),
  doctorId: z.string(),
  slotId: z.string(),
  patientName: z.string(),
  phone: z.string(),
  startsAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});
export type AppointmentResponse = z.infer<typeof AppointmentResponseSchema>;
