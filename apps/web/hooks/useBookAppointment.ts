// TODO (تسک ۵ — 🔴): هوک رزرو نوبت با React Query mutation
//
// هدف: `useBookAppointment()` که POST /api/appointments را انجام می‌دهد.
//
// راهنما:
//  - کلیدواژه: `useMutation`، `isPending`، `onSuccess`، `onError`، `queryClient.invalidateQueries`
//  - هدر `Idempotency-Key` با `crypto.randomUUID()`:
//    کلید را کی بسازی؟ هر بار کلیک؟ یا یک‌بار برای هر «تلاش منطقی»؟ اگر کاربر دوبار کلیک کند چه؟
//    (به رفتار سرور در آزمایش با curl نگاه کن)
//  - خطا را تایپ‌دار کن: یک کلاس `ApiRequestError` با `status` و `fieldErrors` (تایپ `ApiError` از shared).
//  - بعد از ۴۰۹ چه چیزی را invalidate می‌کنی تا کاربر slotهای به‌روز را ببیند؟
//  - Optimistic update لازم است یا نه؟ مزیت و ریسکش؟

export {};
