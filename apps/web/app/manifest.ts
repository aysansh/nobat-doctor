import type { MetadataRoute } from 'next';

// TODO (تسک ۸ — 🔴): Web App Manifest
//
// هدف: برنامه قابل نصب شود (Installable).
//
// راهنما:
//  - فیلدها: name, short_name, lang, dir, start_url, display ('standalone'), theme_color,
//    background_color, icons
//  - آیکون‌ها در /public/icons هستند: ۱۹۲، ۵۱۲ و maskable ۵۱۲ (purpose: 'maskable')
//  - تفاوت `purpose: 'any'` و `'maskable'` چیست؟
//  - بررسی: DevTools → Application → Manifest (باید بدون هشدار باشد)

export default function manifest(): MetadataRoute.Manifest {
  return {};
}
