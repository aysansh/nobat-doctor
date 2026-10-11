import { describe, it } from 'vitest';

// TODO (تسک ۹ — 🔴): این تست‌ها را خودت بنویس.
// راهنما: یک کلاس FakeWebSocket بساز (readyState، send، close، و متدهایی برای شبیه‌سازی open/message/close)
// و با `vi.stubGlobal('WebSocket', FakeWebSocket)` جایگزین کن. برای backoff از `vi.useFakeTimers()` استفاده کن.
// کش را با `queryClient.getQueryData` بررسی کن.

describe('useSlotsSocket', () => {
  it.todo('بعد از open پیام subscribe با doctorId درست ارسال می‌شود');
  it.todo('با دریافت slot:booked، isBooked همان slot در کش true می‌شود');
  it.todo('با دریافت slot:released، isBooked همان slot در کش false می‌شود');
  it.todo('پیام نامعتبر یا مربوط به پزشک دیگر کش را تغییر نمی‌دهد');
  it.todo('بعد از close غیرمنتظره، با تأخیرِ افزایشی دوباره وصل می‌شود');
  it.todo('هنگام unmount پیام unsubscribe ارسال و socket بسته می‌شود و reconnect انجام نمی‌شود');
});
