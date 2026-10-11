// TODO (تسک ۳ — 🔴): پروفایل پزشک (Server Component) + بخش رزرو
//
// هدف: اطلاعات پزشک روی سرور fetch شود، صفحه برای پزشکان از قبل ساخته شود (SSG/ISR)،
// و متادیتای هر پزشک جداگانه تولید شود. بخش رزرو (SlotPicker + BookingForm) Client Component است.
//
// راهنما:
//  - کلیدواژه‌ها: `generateStaticParams`، `export const revalidate`، `generateMetadata`،
//    `notFound()`، `dynamicParams`
//  - در Next جدید `params` یک Promise است.
//  - چه فرقی بین Server و Client Component در اینجا هست؟ مرز 'use client' را کجا می‌گذاری؟
//  - به‌خاطر `generateStaticParams` باید API هنگام `next build` در حال اجرا باشد (README را ببین).
//  - یک fetch مشترک برای generateMetadata و page: Next درخواست‌های تکراری fetch را چطور dedupe می‌کند؟

export default function DoctorProfilePage() {
  return <p>TODO: doctor profile</p>;
}
