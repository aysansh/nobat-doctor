// TODO (تسک ۷ — 🟢): هوک وضعیت آنلاین/آفلاین مرورگر
//
// هدف: `useOnlineStatus()` که boolean برمی‌گرداند و با تغییر شبکه به‌روز می‌شود.
//
// راهنما:
//  - کلیدواژه: `navigator.onLine`، رویدادهای `online` / `offline` روی window
//  - بهترین الگو برای subscribe به یک منبع بیرونی در React: `useSyncExternalStore`
//    (آرگومان سوم `getServerSnapshot` برای SSR چه می‌شود؟ چرا لازم است؟)
//  - محدودیت `navigator.onLine`: true بودن یعنی «به شبکه وصل است» نه «اینترنت دارد».

export {};
