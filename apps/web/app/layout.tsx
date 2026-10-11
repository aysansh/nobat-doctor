import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import { Header } from '@/components/Header';
import { Providers } from './providers';
import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazirmatn',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'نوبت دکتر', template: '%s | نوبت دکتر' },
  description: 'رزرو آنلاین نوبت پزشک',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-screen antialiased">
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
