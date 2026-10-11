// TODO (تسک ۴ — 🔴): انتخاب زمان نوبت
//
// هدف: لیست slotها را بر اساس روز گروه‌بندی کن؛ هر روز با تاریخ شمسی و هر slot به‌صورت دکمهٔ ساعت.
// slotهای رزروشده غیرفعال باشند. یک slot را می‌شود انتخاب کرد و انتخاب به والد اطلاع داده می‌شود.
//
// راهنما:
//  - کلیدواژه: `Intl.DateTimeFormat('fa-IR', { calendar: 'persian', ... })`
//  - مشکل Hydration Mismatch: سرور و مرورگر timezone متفاوت دارند. راه‌حل‌ها:
//    مشخص‌کردن `timeZone: 'Asia/Tehran'` در همهٔ فرمت‌ها، یا رندر تاریخ بعد از mount (`useEffect`)
//  - `startsAt` به‌صورت ISO UTC می‌آید؛ گروه‌بندی روز باید بر اساس تاریخ تهران باشد نه UTC.
//  - تایپ Slot از `@nobat/shared`.
//  - دسترس‌پذیری: `aria-pressed` / `role="radio"`، `disabled`، ناوبری با کیبورد.
//  - props پیشنهادی: slots، selectedSlotId، onSelect (طراحی‌اش با خودت).

export function SlotPicker() {
  return null;
}
