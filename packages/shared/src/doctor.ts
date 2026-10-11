import { z } from 'zod';

export const SPECIALTIES = ['قلب', 'پوست', 'اطفال', 'عمومی'] as const;

export const SpecialtySchema = z.enum(SPECIALTIES);
export type Specialty = z.infer<typeof SpecialtySchema>;

export const DoctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: SpecialtySchema,
  city: z.string(),
  bio: z.string(),
  rating: z.number().min(0).max(5),
  avatarUrl: z.string().url(),
});
export type Doctor = z.infer<typeof DoctorSchema>;

export const DoctorListQuerySchema = z.object({
  specialty: SpecialtySchema.optional(),
});
