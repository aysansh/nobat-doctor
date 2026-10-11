// TODO (تسک ۴ — 🔴): هوک دریافت slotهای یک پزشک با React Query
//
// هدف: `useSlots(doctorId)` که slotها را از API می‌گیرد و loading/error/data را برمی‌گرداند.
//
// راهنما:
//  - کلیدواژه: `useQuery`، `queryKey` (آرایه، شامل doctorId)، `queryFn`، `staleTime`، `gcTime`
//  - `staleTime` را چه عددی می‌گذاری وقتی WebSocket هم داده را به‌روز می‌کند؟ چرا؟
//  - queryKey را یک‌جا تعریف کن (مثلاً یک query-key factory) چون در useBookAppointment و
//    useSlotsSocket هم لازم است.
//  - `initialData` / `placeholderData` برای slotها لازم است یا نه؟
//  - `refetchOnWindowFocus` و `refetchOnReconnect` چه می‌کنند و اینجا چه مقداری مناسب است؟

export {};
