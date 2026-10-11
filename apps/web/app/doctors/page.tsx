// TODO (تسک ۲ — 🟢): لیست پزشکان با فیلتر تخصص از طریق searchParams
//
// هدف: Server Component که `?specialty=قلب` را از URL می‌خواند، از API دریافت می‌کند
// و کارت پزشکان را نشان می‌دهد. فیلتر باید با لینک/فرم GET کار کند (بدون state کلاینتی).
//
// راهنما:
//  - کلیدواژه: `searchParams` در page (نسخهٔ جدید Next: Promise است)، Dynamic Rendering
//  - چرا استفاده از searchParams باعث dynamic شدن route می‌شود؟
//  - fetch با گزینهٔ `cache` / `next: { revalidate }` را بررسی کن.
//  - اگر مقدار `specialty` نامعتبر بود چه رفتاری می‌خواهی؟ (API خطای ۴۰۰ می‌دهد)
//  - `SPECIALTIES` از `@nobat/shared` برای ساخت لینک‌های فیلتر قابل استفاده است.

export default function DoctorsPage() {
  return <p>TODO: doctors list</p>;
}
