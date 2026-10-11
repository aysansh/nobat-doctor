# TASKS — نوبت دکتر 🩺

> هدف: تا مصاحبه‌ات (سه‌شنبه ۱۰ صبح) هم **کد بزنی** و هم **بتوانی بفهمی و توضیح بدهی** که چرا هر چیزی همان‌طور کار می‌کند.
> بک‌اند آماده است. تمام فیچرهای فرانت را خودت می‌نویسی. جواب آماده در این ریپو نیست.
> اگر گیر کردی، از Claude **اول hint** بخواه، نه کد کامل.

راهنمای علامت‌ها: 🔴 حتماً (مصاحبه در ۲ روز دیگر) · 🟢 اگر وقت ماند · 🧪 آزمایش (قبل یا کنار کد زدن، برای فهم عمیق)

---

## برنامهٔ پیشنهادی ۲ روزه

| زمان | تسک‌ها | جمع |
|---|---|---|
| **روز ۱ — صبح** | 0 (مونوریپو) → 1 (لندینگ) → 3 (پروفایل پزشک) | ~۳ ساعت |
| **روز ۱ — عصر** | 4 (useSlots + SlotPicker) → 5 (mutation رزرو) | ~۳ ساعت |
| **روز ۲ — صبح** | 6 (WebSocket) → 9a (تست‌های رزرو و سوکت) | ~۳.۵ ساعت |
| **روز ۲ — عصر** | 8 (PWA + webpack + Service Worker) → 11 (معماری و cache) | ~۴ ساعت |
| **شب قبل از مصاحبه** | مرور «سؤال‌های خودسنجی» + 10 (DECISIONS.md) | ~۱ ساعت |
| اگر وقت ماند | 2، 7 | ~۱.۵ ساعت |

اگر وقتت کم شد این‌ها را **حذف نکن**: 3، 5، 6، 8 و بخش 🧪 هر تسک. این‌ها بیشتر از همه در مصاحبه پرسیده می‌شوند.
یک نکته: من متن آگهی jobvision را نخوانده‌ام. اگر متن آگهی را اینجا paste کنی، سؤال‌ها و اولویت‌ها را دقیق‌تر با آن تنظیم می‌کنم.

---

## تسک 0 — 🔴🧪 تور مونوریپو (pnpm workspaces)

⏱ **۳۰ تا ۴۵ دقیقه**

**هدف:** بفهمی این ریپو چطور از چند پکیج ساخته شده و چطور `apps/web` و `apps/api` هر دو از `@nobat/shared` استفاده می‌کنند. پکیج shared هیچ مرحلهٔ build ندارد.

**مفاهیم:** pnpm workspace، پروتکل `workspace:*`، symlink در `node_modules`، `exports`/`main` در package.json، `transpilePackages`، فرق monorepo با polyrepo، single source of truth برای تایپ و اعتبارسنجی.

**آزمایش‌ها** (کد نمی‌نویسی؛ فقط اجرا و مشاهده می‌کنی):
- [ ] `pnpm ls -r --depth 0` و `pnpm --filter @nobat/web why zod` را اجرا کن. zod چند بار و از کجا نصب شده؟
- [ ] داخل `apps/web/node_modules/@nobat/` نگاه کن. آن چیست؟ (`ls -la`)
- [ ] در `packages/shared/src/appointment.ts` موقتاً regex موبایل را خراب کن. حالا `pnpm test` و `pnpm typecheck` از ریشه را اجرا کن. کدام اپ‌ها تحت تأثیر قرار می‌گیرند؟ بعد تغییر را برگردان (`git checkout`).
- [ ] در `apps/web/next.config.ts` خط `transpilePackages` را موقتاً حذف کن و `pnpm --filter web build` بزن. چه خطایی می‌گیری؟ چرا؟
- [ ] اسکریپت `dev` در package.json ریشه را بخوان. تفاوت `--parallel` و اجرای ترتیبی چیست؟ `-r` و `--filter` چه می‌کنند؟

**معیار قبولی:**
- [ ] می‌توانی در ۳۰ ثانیه توضیح بدهی `workspace:*` یعنی چه و پکیج shared چطور بدون build در دو اپ resolve می‌شود.
- [ ] می‌دانی چرا `apps/api` (با tsx) و `apps/web` (با Next) هر دو می‌توانند فایل `.ts` از shared را مستقیم import کنند.

**Hint:** `pnpm-workspace.yaml`، `"exports"` در `packages/shared/package.json`، کلیدواژهٔ «internal packages» در مستندات Turborepo/Next.

**❓ سؤال‌های خودسنجی**
1. مزیت اشتراک Zod schema بین فرانت و بک‌اند چیست؟ عیب یا ریسکش چیست (coupling)؟
2. اگر shared را به‌جای `src/index.ts` منتشر شده (compiled، با `dist`) استفاده می‌کردیم چه چیزی عوض می‌شد؟ چه زمانی این کار لازم می‌شود؟
3. فرق pnpm با npm در ساختار `node_modules` چیست (phantom dependencies)؟

---

## تسک 1 — 🔴 لندینگ پیج: استاتیک (SSG)

⏱ **۲۰ دقیقه** · فایل: `app/page.tsx`

**هدف:** یک صفحهٔ خوش‌ظاهر و کاملاً استاتیک با معرفی سرویس و دکمهٔ «مشاهدهٔ پزشکان».

**مفاهیم:** Static Rendering، Server Component پیش‌فرض، `next/link`، RTL و کلاس‌های logical در Tailwind.

**معیار قبولی:**
- [ ] هیچ `'use client'` و هیچ fetch ندارد.
- [ ] بعد از `pnpm --filter web build` در جدول routeها با ○ (Static) نشان داده می‌شود.
- [ ] جهت چینش درست RTL است (`ms-`/`me-` به‌جای `ml-`/`mr-` استفاده شده).
- [ ] heading ها ساختار درست دارند (یک `h1`).

**Hint:** خروجی build را بخوان؛ ○ و ƒ یعنی چه؟ ببین اگر `cookies()` یا `searchParams` اضافه کنی چه تغییری می‌کند.

**❓ سؤال‌های خودسنجی**
1. SSG و SSR و ISR و CSR را با یک مثال از همین پروژه توضیح بده.
2. چرا Server Component بودن به bundle جاوااسکریپت کمتر منجر می‌شود؟
3. چه چیزی یک صفحه را از Static به Dynamic تبدیل می‌کند؟

---

## تسک 2 — 🟢 لیست پزشکان با فیلتر تخصص

⏱ **۴۰ دقیقه** · فایل: `app/doctors/page.tsx` · `lib/api.ts`

**هدف:** لیست پزشکان در Server Component، فیلتر با `?specialty=قلب` از طریق لینک (بدون state کلاینتی).

**مفاهیم:** `searchParams` (Promise)، Dynamic Rendering، state در URL به‌جای useState، `fetch` caching.

**معیار قبولی:**
- [ ] فیلتر با لینک کار می‌کند و دکمهٔ Back مرورگر درست رفتار می‌کند.
- [ ] مقدار نامعتبر `specialty` بدون کرش مدیریت می‌شود.
- [ ] حالت خالی (هیچ پزشکی نیست) دارد.
- [ ] لینک فعال از نظر دسترس‌پذیری مشخص است (`aria-current`).

**Hint:** `SPECIALTIES` در shared، `Promise` بودن `searchParams`، تابع `getDoctors` در `lib/api.ts`.

**❓ سؤال‌های خودسنجی**
1. چرا filter state در URL بهتر از useState است (share، back button، SSR)؟
2. استفاده از `searchParams` چه اثری روی cache دارد؟
3. اگر لیست ۱۰ هزار پزشک بود چه تغییری می‌دادی؟

---

## تسک 3 — 🔴 پروفایل پزشک: Server Component + SSG/ISR + متادیتا

⏱ **۹۰ دقیقه** · فایل‌ها: `app/doctors/[id]/page.tsx` · `loading.tsx` · `lib/api.ts`

**هدف:** صفحهٔ هر پزشک از قبل ساخته شود، هر چند دقیقه یک‌بار تازه شود، `<title>` اختصاصی داشته باشد و در حال لودینگ اسکلت نشان دهد.

**مفاهیم:** `generateStaticParams`، `revalidate` (ISR)، `generateMetadata`، `notFound()`، `loading.tsx` و Suspense، مرز Server/Client، dedupe شدن fetchهای مشابه.

**معیار قبولی:**
- [ ] `getDoctor` در `lib/api.ts` پیاده شده و خطای ۴۰۴ را به `notFound()` تبدیل می‌کنی.
- [ ] `generateStaticParams` همهٔ پزشکان را از API می‌گیرد (**API باید هنگام build روشن باشد**).
- [ ] `revalidate` تنظیم شده و می‌توانی توضیح بدهی دقیقاً چه زمانی صفحه دوباره ساخته می‌شود.
- [ ] `generateMetadata` عنوان و توضیحات هر پزشک را می‌سازد.
- [ ] `loading.tsx` اسکلتی هم‌شکل صفحهٔ واقعی دارد (بدون layout shift).
- [ ] id ناموجود صفحهٔ ۴۰۴ می‌دهد.
- [ ] بخش «زمان‌های آزاد» در این مرحله فقط یک placeholder است. Client Component می‌شود در تسک ۴.

**آزمایش 🧪:** `pnpm --filter web build && pnpm --filter web start` را اجرا کن.
- در جدول build، `/doctors/[id]` چطور نشان داده می‌شود؟ (●  SSG)
- API را خاموش کن و صفحهٔ یک پزشک را باز کن. چه اتفاقی می‌افتد؟ چرا؟
- در `next.config.ts` اگر `cacheComponents` را `true` کنی چه می‌شود؟ (توضیح در کامنت همان فایل و در مستندات نصب‌شده در `node_modules/next/dist/docs`)

**Hint:** `params` یک Promise است. `export const revalidate`، `dynamicParams`، تابع `notFound` از `next/navigation`.

**❓ سؤال‌های خودسنجی**
1. تفاوت `generateStaticParams` با `getStaticPaths` قدیمی؟ و با `dynamicParams = false`؟
2. ISR دقیقاً چطور کار می‌کند؟ stale-while-revalidate در سطح سرور چیست؟
3. چرا بهتر است ایدی پزشکانِ پرترافیک از قبل ساخته شوند و بقیه on-demand؟

---

## تسک 4 — 🔴 `useSlots` با React Query + `SlotPicker` + تاریخ شمسی

⏱ **۹۰ دقیقه** · فایل‌ها: `hooks/useSlots.ts` · `components/SlotPicker.tsx` · `lib/api.ts`

**هدف:** slotها را در کلاینت بگیر و بر اساس روز (تاریخ شمسی) گروه‌بندی و نمایش بده.

**مفاهیم:** `useQuery`، `queryKey`، `staleTime` در برابر `gcTime`، SSR + hydration، `Intl.DateTimeFormat('fa-IR', { calendar: 'persian' })`، **hydration mismatch** و timezone.

**معیار قبولی:**
- [ ] `useSlots(doctorId)` وضعیت‌های loading / error / success را برمی‌گرداند و `staleTime` عمدی تنظیم شده.
- [ ] queryKey در یک جا تعریف شده تا تسک ۵ و ۶ هم از آن استفاده کنند.
- [ ] slotها بر اساس روز **به وقت تهران** گروه‌بندی شده‌اند.
- [ ] تاریخ شمسی و ساعت با `Intl` نمایش داده می‌شود و کنسول خطای hydration ندارد.
- [ ] slotهای رزروشده disabled هستند؛ انتخاب با کیبورد و `aria-pressed` یا `radio` قابل استفاده است.
- [ ] وضعیت‌های loading، error (با دکمهٔ تلاش دوباره) و خالی دارد.

**آزمایش 🧪:** عمداً `timeZone` را حذف کن. با تغییر timezone سیستم (`TZ=America/New_York pnpm --filter web dev`) آیا mismatch می‌بینی؟ چرا؟ سپس با دو راه‌حل مختلف درستش کن و مقایسه کن.

**Hint:** `startsAt` ISO UTC است. گزینهٔ `timeZone: 'Asia/Tehran'`. React Query DevTools برای دیدن stale/fresh (اختیاری).

**❓ سؤال‌های خودسنجی**
1. فرق `staleTime` و `gcTime` چیست؟ چه عددی برای slotها می‌گذاری و چرا؟
2. hydration mismatch چیست و چرا تاریخ و `Math.random` سراغش می‌روند؟
3. چرا slotها را در کلاینت fetch کردیم نه در Server Component؟ (هدر `no-store` و real-time)

---

## تسک 5 — 🔴 `useBookAppointment`: mutation و Idempotency

⏱ **۷۵ دقیقه** · فایل‌ها: `hooks/useBookAppointment.ts` · `components/BookingForm.tsx` · `lib/api.ts`

**هدف:** رزرو نوبت با فرم، مدیریت درست خطاهای ۴۰۰ و ۴۰۹، و جلوگیری از رزرو دوباره.

**مفاهیم:** `useMutation`، `isPending`، `invalidateQueries`، هدر `Idempotency-Key`، خطای تایپ‌دار، اعتبارسنجی فرم (RHF + Yup/Zod)، race condition.

**معیار قبولی:**
- [ ] دکمه تا پایان درخواست (≈۶۰۰ms) disabled است و متن «در حال ثبت…» دارد.
- [ ] هر درخواست `Idempotency-Key` با `crypto.randomUUID()` دارد. می‌دانی کلید را کجا بسازی که retry همان کلید را بفرستد.
- [ ] خطای ۴۰۰: پیام هر فیلد زیر همان فیلد نمایش داده می‌شود.
- [ ] خطای ۴۰۹: پیام «این نوبت قبلاً رزرو شده» و slotها دوباره بارگذاری می‌شوند.
- [ ] بعد از موفقیت، کوئری slotها invalidate می‌شود و پیام موفقیت دیده می‌شود.
- [ ] شمارهٔ موبایل با ارقام فارسی هم پذیرفته می‌شود (`۰۹۱۲…`).

**آزمایش 🧪:** با `curl` دو بار یک POST با یک `Idempotency-Key` بفرست. بعد با دو کلید متفاوت. بعد با یک کلید و بدنهٔ متفاوت. سه خروجی را مقایسه و توضیح بده.

**Hint:** `AppointmentRequestSchema` در shared، `setError` در React Hook Form، `onError` و `onSettled`.

**❓ سؤال‌های خودسنجی**
1. idempotency چیست؟ چرا فقط disable کردن دکمه کافی نیست؟
2. وقتی ۴۰۹ می‌گیری چه کار می‌کنی؟ optimistic update در این سناریو چه ریسکی دارد؟
3. `mutate` در برابر `mutateAsync`؟ کدام کجا؟

---

## تسک 6 — 🔴 `useSlotsSocket`: WebSocket بومی + هماهنگی کش + reconnect

⏱ **۱۲۰ دقیقه** · فایل: `hooks/useSlotsSocket.ts`

**هدف:** وقتی slot در سرور رزرو یا آزاد می‌شود، UI بدون refresh به‌روز شود (شبیه‌ساز API هر ۱۵ تا ۲۵ ثانیه رویداد می‌فرستد).

**مفاهیم:** WebSocket API، چرخهٔ عمر اتصال، cleanup در `useEffect`، `setQueryData` در برابر `invalidateQueries`، exponential backoff + jitter، رفتار StrictMode.

**معیار قبولی:**
- [ ] بعد از open پیام `subscribe` و هنگام unmount پیام `unsubscribe` ارسال می‌شود و socket بسته می‌شود.
- [ ] پیام‌ها با `ServerMessageSchema.safeParse` اعتبارسنجی می‌شوند.
- [ ] روی `slot:booked` / `slot:released` کش به‌روز می‌شود. با `setQueryData` پیاده کن و تفاوتش با `invalidateQueries` را روی کاغذ بنویس.
- [ ] قطع اتصال: reconnect با تأخیر افزایشی (مثلاً ۱s، ۲s، ۴s… با سقف) و کمی jitter.
- [ ] بعد از reconnect موفق، داده‌ها یک‌بار با سرور همگام می‌شوند (چرا؟).
- [ ] بعد از unmount هیچ timer یا listener یا socket باقی نمی‌ماند، حتی با StrictMode.
- [ ] وضعیت اتصال (`connecting` / `open` / `reconnecting`) برای تسک ۷ برگردانده می‌شود.

**آزمایش 🧪:**
- API را kill کن و دوباره بالا بیار. در تب Network → WS رفتار reconnect را ببین.
- در DevTools یک پیام نامعتبر دستی بفرست (`ws.send('x')` از کنسول) و پاسخ `error` را ببین.
- لاگ‌های API را ببین: چند subscriber دارد؟ بعد از رفتن به صفحهٔ دیگر چه می‌شود؟ (نشت اتصال)
- چند ثانیه آفلاین شو (DevTools → Network → Offline)؛ آیا ping/pong و close رخ می‌دهد؟

**Hint:** `useRef` برای socket و timer، `readyState`، `onclose` در برابر `onerror`، `queryClient.setQueryData(key, updater)` (updater باید immutable باشد).

**❓ سؤال‌های خودسنجی**
1. چرا بعد از reconnect ممکن است داده‌ها ناسازگار باشند؟ راه حل؟
2. `setQueryData` در برابر `invalidateQueries`: سرعت، ترافیک، ریسک؟ کدام را کجا انتخاب می‌کنی؟
3. WebSocket در برابر SSE در برابر polling؟ کی کدام؟

---

## تسک 7 — 🟢 `ConnectionStatus` + `useOnlineStatus`

⏱ **۴۰ دقیقه** · فایل‌ها: `components/ConnectionStatus.tsx` · `hooks/useOnlineStatus.ts`

**هدف:** نمایش وضعیت WebSocket و آنلاین/آفلاین بودن مرورگر، و غیرفعال شدن رزرو در حالت آفلاین.

**مفاهیم:** `useSyncExternalStore`، `navigator.onLine` و محدودیتش، رویدادهای `online`/`offline`، دسترس‌پذیری (`role="status"`).

**معیار قبولی:**
- [ ] هوک بدون خطای hydration کار می‌کند (SSR snapshot).
- [ ] نشانگر فقط با رنگ پیام نمی‌دهد (متن هم دارد).
- [ ] در حالت آفلاین دکمهٔ رزرو disabled و دلیلش به کاربر گفته می‌شود.

**Hint:** آرگومان سوم `useSyncExternalStore`.

**❓ سؤال‌های خودسنجی**
1. چرا `useSyncExternalStore` و نه `useState + useEffect`؟
2. چرا `navigator.onLine === true` یعنی اینترنت دارد، غلط است؟

---

## تسک 8 — 🔴🧪 PWA: manifest + Serwist + webpack + Service Worker

⏱ **۱۲۰ دقیقه** · فایل‌ها: `app/manifest.ts` · `app/sw.ts` · `next.config.ts` · `app/offline/page.tsx`

**هدف:** برنامه قابل نصب شود، فایل‌های استاتیک کش شوند، API هرگز کش نشود، و بدون اینترنت صفحهٔ `/offline` نمایش داده شود. در این تسک می‌فهمی ما چرا webpack لازم داریم و SW در پشت صحنه چیست.

**مفاهیم:** Web App Manifest، چرخهٔ عمر SW (install → waiting → activate)، scope، `skipWaiting`/`clients.claim`، precache در برابر runtime cache، استراتژی‌های Cache First / NetworkOnly / StaleWhileRevalidate، چرا POST نباید cache شود، webpack در برابر Turbopack و plugin ها، `self.__SW_MANIFEST`.

### 8a — فهم (قبل از کد، ~۳۰ دقیقه) 🧪
- [ ] README را بخوان، بخش «چرا `next build --webpack`؟». `package.json` در `apps/web` را ببین: `dev` و `build` چه فرقی دارند؟
- [ ] در این ریپو `@serwist/next` فقط نصب شده. با `grep -r "webpack" node_modules/@serwist/next/dist | head` ببین plugin در کدام نقطهٔ build وارد می‌شود. نتیجه را در یک خط در DECISIONS.md بنویس: `@serwist/next` به‌صورت یک plugin به webpack وصل می‌شود تا sw را بسازد و لیست precache را تولید کند. Serwist برای Turbopack هم راه جداگانه‌ای دارد (مثال `next-turbo-basic` در مخزن Serwist). تفاوت این دو رویکرد را در دو خط بنویس.
- [ ] بعد از پیاده‌سازی، `public/sw.js` تولیدشده را باز کن (گیت‌ایگنور است). لیست precache (`__SW_MANIFEST`) شامل چه فایل‌هایی است؟ چه چیزی را توقع داشتی و نیست؟

### 8b — پیاده‌سازی
- [ ] `manifest.ts`: `lang: 'fa'`، `dir: 'rtl'`، `display: 'standalone'`، `start_url`، `theme_color`، `icons` (۱۹۲، ۵۱۲، maskable ۵۱۲).
- [ ] `next.config.ts` با Serwist پیکربندی شده (`swSrc`، `swDest`) و SW در dev **غیرفعال** است.
- [ ] `sw.ts`: درخواست API → **NetworkOnly**؛ استاتیک‌ها (`/_next/static`، تصاویر، فونت) → **CacheFirst**؛ ناوبری آفلاین → fallback به `/offline`.
- [ ] SW فقط در production ثبت می‌شود (کجا و چطور ثبتش می‌کنی؟).
- [ ] صفحهٔ `/offline` ساده و بدون وابستگی به API است.

### 8c — آزمایش‌های چرخهٔ عمر 🧪 (`next build --webpack && next start`)
- [ ] DevTools → Application → Service Workers: وضعیت install/activate را ببین.
- [ ] یک تغییر کوچک بده و دوباره build کن؛ SW جدید در حالت **waiting** می‌ماند. چرا؟ با `skipWaiting` چه فرقی می‌کند؟ ریسکش چیست؟
- [ ] Application → Cache Storage: چه کش‌هایی ساخته شده؟ هر کدام برای چیست؟
- [ ] تیک Offline را بزن: صفحهٔ دیدارشده، صفحهٔ دیدارنشده، و درخواست رزرو چه می‌شوند؟
- [ ] Lighthouse → PWA/Installability را اجرا کن؛ چه چیزی گم است؟

**معیار قبولی:**
- [ ] Manifest در DevTools بدون هشدار و installable است.
- [ ] درخواست‌های API در Network با «from service worker» **کش** نمی‌شوند.
- [ ] می‌توانی بدون نگاه کردن، چرخهٔ install → waiting → activate و تفاوت precache و runtime cache را توضیح بدهی.

**Hint:** مثال‌های رسمی Serwist برای Next (`next-basic`)، `defaultCache`، `fallbacks`، `serwist.addEventListeners()`. اگر در dev خطای ناسازگاری webpack و Turbopack دیدی، مستندات `turbopack` در next.config را ببین. فایل‌های `public/sw.js` از گیت حذف شده‌اند.

**❓ سؤال‌های خودسنجی**
1. Service Worker چیست؟ روی کدام thread اجرا می‌شود و به DOM دسترسی دارد؟
2. چرا SW جدید بلافاصله فعال نمی‌شود؟ کاربر چطور به نسخهٔ جدید می‌رسد؟
3. چرا API را cache نکردیم؟ در چه سناریویی NetworkFirst یا StaleWhileRevalidate برای API منطقی است؟
4. webpack چه کاری می‌کند (bundling، loader، plugin، code splitting)؟ Turbopack چه فرقی دارد و چرا اینجا از `@serwist/next` + webpack استفاده کردیم؟ (جواب را از کد پکیج و مستندات پیدا کن)

---

## تسک 9 — 🔴 تست‌ها

⏱ **۹۰ دقیقه** · پوشهٔ `apps/web/tests/` (فایل‌های `it.todo` آماده است)

**هدف:** رفتارهای مهم را تست کن، نه جزئیات پیاده‌سازی را.

**مفاهیم:** React Testing Library، `renderHook`، wrapper با QueryClient (`retry: false`)، mock کردن `fetch` و `WebSocket`، fake timers، تست رفتار کاربر.

**معیار قبولی:**
- [ ] 9a: دکمهٔ رزرو در حال pending غیرفعال است. کلیک دوباره درخواست دوم نمی‌فرستد.
- [ ] 9a: پیام ۴۰۹ نمایش داده می‌شود. خطای ۴۰۰ زیر فیلد درست نمایش داده می‌شود.
- [ ] 9a: هوک سوکت با `FakeWebSocket` کش را به‌روز می‌کند (`slot:booked` / `slot:released`).
- [ ] 9a: reconnect با fake timers و cleanup بعد از unmount تست شده.
- [ ] 9b (اگر وقت ماند): SlotPicker (گروه‌بندی، disabled)، `useOnlineStatus`.
- [ ] همهٔ `it.todo`های 🔴 به تست واقعی تبدیل شده‌اند و `pnpm test` سبز است.

**Hint:** `vi.stubGlobal`، `vi.useFakeTimers()`، `waitFor`، `userEvent.setup()`، `queryClient.setQueryData/getQueryData`. جست‌وجو کن: «testing react query» (مستندات رسمی TanStack).

**❓ سؤال‌های خودسنجی**
1. چرا برای تست React Query باید `retry: false` بگذاری؟
2. چرا به‌جای تست state داخلی، رفتار قابل‌مشاهده را تست می‌کنیم؟
3. چطور WebSocket را بدون سرور واقعی تست می‌کنی؟

---

## تسک 10 — 🟢 `DECISIONS.md` (با زبان خودت)

⏱ **۴۵ دقیقه**

**هدف:** برای هر تصمیم مهم یک پاراگراف کوتاه بنویس: چه کردم، چرا، گزینهٔ دیگر چه بود و چرا کنار گذاشتم.

**معیار قبولی:**
- [ ] حداقل ۸ تصمیم (مثلاً: SSG/ISR برای پروفایل، Client Fetch برای slotها، `staleTime`، `setQueryData` یا `invalidateQueries`، backoff، NetworkOnly برای API، webpack برای Serwist، monorepo و shared schema).
- [ ] هر مورد «trade-off» دارد، نه فقط «چون بهتر است».
- [ ] با صدای خودت نوشته شده؛ هیچ جمله‌ای را که نمی‌توانی با دهان خودت توضیح بدهی کپی نکن.

---

## تسک 11 — 🔴🧪 نقشهٔ معماری و لایه‌های cache

⏱ **۶۰ دقیقه** · خروجی: یک فایل `ARCHITECTURE.md` (خودت می‌سازی) با دست‌خط خودت

**هدف:** کل سیستم را در ذهنت یکپارچه کن. در مصاحبه‌های سنیورتر همین نقطه جداکنندهٔ «کد می‌زند» از «می‌فهمد» است.

**قدم‌ها:**
- [ ] **نمودار جریان داده:** مرورگر ↔ Next (server) ↔ API ↔ WebSocket را با فلش رسم کن. هر فلش را با نوع ارتباط و کش برچسب بزن. (ابزار: Mermaid یا کاغذ)
- [ ] **جدول چهار لایهٔ cache** را پر کن و برای هر لایه بنویس چه چیزی کش می‌شود، تا کی، و چطور باطل (invalidate) می‌شود:

| لایه | چه چیزی | چقدر زنده می‌ماند | چه چیزی باطلش می‌کند |
|---|---|---|---|
| Next (Full Route Cache / ISR) | ? | ? | ? |
| Data Cache (`fetch`) | ? | ? | ? |
| React Query (کلاینت) | ? | ? | ? |
| Service Worker + HTTP (`Cache-Control`) | ? | ? | ? |

- [ ] **سناریوها را شبیه‌سازی کن** و توضیح بده:
  1. دو کاربر هم‌زمان یک slot را رزرو می‌کنند (کدام لایه جلوی دوبار رزرو را می‌گیرد؟ اتمیک بودن در `store.book` را بخوان).
  2. کاربر دوبار روی «ثبت» می‌زند، یا شبکه قطع می‌شود و retry می‌شود.
  3. WebSocket یک دقیقه قطع بوده و دوباره وصل می‌شود.
  4. صفحهٔ پروفایل ISR شده را کاربر می‌بیند ولی slotها لحظه‌ای عوض می‌شوند. کدام بخش استاتیک و کدام زنده است و چرا؟
- [ ] **اگر مقیاس بدهیم:** API الان in-memory و تک‌پروسه است. اگر ۳ instance پشت load balancer باشد، چه چیزی می‌شکند؟ (store، idempotency map، room های WebSocket). راه حل ها را فقط اسم ببر: دیتابیس با constraint یکتا، Redis، pub/sub، sticky session.
- [ ] هر نتیجه را در یک جمله بنویس.

**Hint:** `apps/api/src/store.ts` (متد `book`)، `apps/api/src/app.ts` (بخش idempotency)، `apps/api/src/hub.ts` (rooms و heartbeat). جست‌وجو: «Next.js caching layers»، «idempotency key», «pub/sub».

**❓ سؤال‌های خودسنجی**
1. وقتی چند لایهٔ cache داری، چه چیزی تضمین می‌کند کاربر داده کهنه نبیند؟ (و برای کدام داده‌ها مشکلی ندارد کهنه باشد؟)
2. چرا برای `POST /appointments` `Cache-Control: no-store` گذاشتیم؟
3. اگر ۱۰ برابر کاربر بیاید، اول کجا می‌شکند و چه می‌کنی؟

---

## چک‌لیست نهایی قبل از مصاحبه

- [ ] `pnpm test`، `pnpm lint` و `pnpm typecheck` از ریشه سبز است.
- [ ] `pnpm --filter web build && pnpm --filter web start` اجرا و PWA در DevTools بررسی شده.
- [ ] برای هر 🔴 حداقل ۲ سؤال خودسنجی را با صدای بلند جواب داده‌ام.
- [ ] می‌توانم پروژه را در ۳ دقیقه تعریف کنم: مسئله، معماری، دو تصمیم سخت، و یک چیز که امروز عوضش می‌کردم.
