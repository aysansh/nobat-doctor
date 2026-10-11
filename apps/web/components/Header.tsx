import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-teal-700">
          نوبت دکتر
        </Link>
        <nav className="flex gap-4 text-sm text-slate-600">
          <Link href="/doctors" className="hover:text-teal-700">
            پزشکان
          </Link>
        </nav>
      </div>
    </header>
  );
}
