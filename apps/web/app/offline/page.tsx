// TODO (تسک ۸ — 🔴): صفحهٔ fallback آفلاین
//
// هدف: وقتی کاربر آفلاین است و صفحه در cache نیست، Service Worker این صفحه را نشان بدهد.
//
// راهنما:
//  - این صفحه باید در زمان نصب SW پیش‌کش (precache) شود؛ در sw.ts دنبال `fallbacks` در Serwist بگرد.
//  - صفحه را ساده نگه دار؛ نباید به API وابسته باشد.
//  - یک دکمهٔ «تلاش دوباره» (نیازمند Client Component کوچک) می‌تواند اضافه شود.

export default function OfflinePage() {
  return <p>TODO: offline fallback</p>;
}
