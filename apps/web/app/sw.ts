// TODO (تسک ۸ — 🔴): Service Worker با Serwist
//
// هدف:
//  - درخواست‌های API (`/api/...` یا `NEXT_PUBLIC_API_URL`) → NetworkOnly (داده نباید کهنه شود)
//  - فایل‌های استاتیک (_next/static، تصاویر، فونت) → CacheFirst
//  - وقتی صفحه‌ای آفلاین بارگذاری نشد → fallback به /offline
//
// راهنما:
//  - کلیدواژه‌ها: `new Serwist({...})`، `precacheEntries: self.__SW_MANIFEST`، `runtimeCaching`،
//    `NetworkOnly`، `CacheFirst`، `ExpirationPlugin`، `fallbacks`، `serwist.addEventListeners()`
//  - تایپ‌ها: `declare const self: ServiceWorkerGlobalScope & {...}` و `/// <reference lib="webworker" />`
//    (ممکن است نیاز باشد tsconfig را برای فایل sw تنظیم کنی)
//  - تفاوت strategyها: CacheFirst / NetworkFirst / StaleWhileRevalidate / NetworkOnly؟
//  - چرا درخواست‌های POST (رزرو) هرگز نباید cache شوند؟
//  - تنظیمات `next.config.ts` (withSerwistInit، swSrc، swDest، disable در dev) هم بخشی از همین تسک است.

export {};
