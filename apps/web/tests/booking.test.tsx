import { describe, it } from 'vitest';

// TODO (تسک ۹ — 🔴): این تست‌ها را خودت بنویس.
// راهنما: `renderHook` / `render` از RTL، یک QueryClientProvider wrapper (با retry: false)،
// mock کردن fetch با `vi.stubGlobal('fetch', ...)` یا `vi.spyOn(globalThis, 'fetch')`، `userEvent`، `waitFor`.

describe('BookingForm / useBookAppointment', () => {
  it.todo('دکمهٔ ثبت نوبت تا زمانی که درخواست pending است disabled است');
  it.todo('هنگام pending بودن، کلیک دوباره درخواست دوم نمی‌فرستد');
  it.todo('در پاسخ ۴۰۹ پیام «این نوبت قبلاً رزرو شده» نمایش داده می‌شود');
  it.todo('در پاسخ ۴۰۰ خطاها زیر فیلد مربوطه نمایش داده می‌شوند');
  it.todo('هدر Idempotency-Key در درخواست ارسال می‌شود');
  it.todo('بعد از موفقیت، کوئری slotها invalidate می‌شود');
});
