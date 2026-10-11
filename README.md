# نوبت دکتر (nobat-doctor)

پروژهٔ تمرینی برای آمادگی مصاحبهٔ فرانت‌اند: اپ رزرو نوبت پزشک (فارسی، RTL).
**بک‌اند آماده است؛ فرانت را خودت می‌نویسی.** نقطهٔ شروع: [`TASKS.md`](./TASKS.md)

```
apps/api         Express + ws (REST + WebSocket، store در حافظه)
apps/web         Next.js App Router (اسکلت + TODO)
packages/shared  تایپ‌ها و Zod schemaهای مشترک (@nobat/shared)
```

## نصب و اجرا

```bash
pnpm i
cp apps/web/.env.local.example apps/web/.env.local   # اگر وجود ندارد
pnpm dev        # API روی :4000 و Web روی :3000
```

- API: http://localhost:4000 (`/health`، `/api/doctors`، …)
- WebSocket: `ws://localhost:4000/ws`
- شبیه‌ساز: متغیر `SIMULATE` (پیش‌فرض در dev برابر `true`) هر ۱۵ تا ۲۵ ثانیه یک slot را رزرو یا آزاد می‌کند و برای subscriberها broadcast می‌کند. خاموش کردن: `SIMULATE=false pnpm dev`.

## تست و lint

```bash
pnpm test        # api (Vitest + supertest) و web (Vitest + RTL + jsdom)
pnpm lint
pnpm typecheck
```

تست‌های `apps/web/tests/*` فعلاً `it.todo` هستند؛ تسک ۹ را ببین.

## تست PWA با build پروداکشن

> ⚠️ **قبل از `next build` باید API روشن باشد** (`pnpm --filter @nobat/api dev`). `generateStaticParams` در زمان build از API پزشکان را می‌گیرد.

```bash
pnpm --filter @nobat/api dev          # ترمینال ۱
pnpm --filter web build               # ترمینال ۲
pnpm --filter web start
```

بعد در Chrome: DevTools → **Application** → **Manifest** / **Service Workers** / **Cache Storage**، و تیک **Offline** برای تست حالت بدون اینترنت. SW در dev غیرفعال است، پس فقط روی `build + start` تست می‌شود.

## چرا `next build --webpack`؟

Next 16 به‌صورت پیش‌فرض با **Turbopack** می‌سازد. پکیج `@serwist/next` به‌صورت **plugin برای webpack** نوشته شده (service worker را کامپایل می‌کند و لیست precache را تولید می‌کند)، پس اسکریپت `build` در `apps/web` عمداً `next build --webpack` است. `pnpm dev` همچنان با Turbopack اجرا می‌شود. Serwist راهی جدا برای Turbopack هم دارد؛ مقایسه‌اش بخشی از تسک ۸ است.

## نکات

- **API روی Vercel اجرا نمی‌شود:** WebSocket و حافظهٔ پایدار می‌خواهد و فقط برای اجرای محلی طراحی شده. (فرانت می‌تواند deploy شود.)
- `cacheComponents` در `apps/web/next.config.ts` عمداً خاموش است تا `revalidate` و `generateStaticParams` کلاسیک قابل تمرین باشد.
- `packages/shared` بدون build مستقیم از `src/*.ts` import می‌شود (`transpilePackages` در Next، و tsx در API).
- فایل‌های SW تولیدشده (`apps/web/public/sw.js` و …) در گیت ignore شده‌اند.
