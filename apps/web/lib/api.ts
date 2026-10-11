import type { Doctor, Slot, Specialty, AppointmentRequest, AppointmentResponse } from '@nobat/shared';

// TODO (تسک ۳ تا ۵): پیاده‌سازی توابع زیر با fetch
//
// راهنما:
//  - خطاها: اگر `!res.ok` بود، بدنهٔ `ApiError` را بخوان و یک Error تایپ‌دار پرتاب کن
//    تا لایهٔ UI بتواند status (۴۰۰/۴۰۹/۴۰۴) و fieldErrors را تشخیص دهد.
//  - این توابع هم از Server Component و هم از Client استفاده می‌شوند؛ پس به API مخصوص مرورگر وابسته نباش.
//  - برای Server Component درباره گزینه‌های cache در fetch فکر کن (`next: { revalidate }`).
//  - هدر `Content-Type: application/json` و `Idempotency-Key` برای POST.

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function getDoctors(_specialty?: Specialty): Promise<Doctor[]> {
  throw new Error('TODO');
}

export function getDoctor(_id: string): Promise<Doctor> {
  throw new Error('TODO');
}

export function getSlots(_doctorId: string): Promise<Slot[]> {
  throw new Error('TODO');
}

export function bookAppointment(
  _body: AppointmentRequest,
  _idempotencyKey: string,
): Promise<AppointmentResponse> {
  throw new Error('TODO');
}

export function cancelAppointment(_appointmentId: string): Promise<void> {
  throw new Error('TODO');
}
