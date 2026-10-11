// TODO (تسک ۶ — 🔴): هوک WebSocket برای به‌روزرسانی لحظه‌ای slotها
//
// هدف: `useSlotsSocket(doctorId)`:
//  - با `new WebSocket(WS_URL)` وصل شود (WebSocket بومی مرورگر، بدون کتابخانه)
//  - بعد از open پیام subscribe بفرستد؛ هنگام unmount/تغییر doctorId پیام unsubscribe و close
//  - روی `slot:booked` / `slot:released` کش React Query را به‌روز کند
//  - در قطع اتصال با exponential backoff (+ jitter) دوباره وصل شود
//  - هیچ نشتی (timer، listener، socket) بعد از unmount نماند
//
// راهنما:
//  - کلیدواژه: `useEffect` cleanup، `ws.onopen/onmessage/onclose/onerror`، `readyState`،
//    `setTimeout` برای backoff، `queryClient.setQueryData` در برابر `invalidateQueries`
//  - پیام‌های ورودی را با `ServerMessageSchema.safeParse` از @nobat/shared اعتبارسنجی کن.
//  - در React StrictMode (dev) effect دوبار اجرا می‌شود؛ cleanup تو باید با این سازگار باشد.
//  - بعد از reconnect ممکن است پیام‌هایی را از دست داده باشی. چه کار می‌کنی؟
//  - `setQueryData` در برابر `invalidateQueries`: سرعت، ترافیک شبکه، ریسک ناهماهنگی؟
//  - وضعیت اتصال را برای ConnectionStatus برگردان.

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4000/ws';
