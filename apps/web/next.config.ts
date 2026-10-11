import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Workspace package is shipped as TypeScript source.
  transpilePackages: ['@nobat/shared'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'i.pravatar.cc' }],
  },
  // NOTE: `cacheComponents` is intentionally OFF. With it enabled, the classic route
  // segment config (`revalidate`, `dynamic`, `dynamicParams`) is removed, and the tasks in
  // TASKS.md (ISR / generateStaticParams / revalidate) rely on that classic model.
};

export default nextConfig;
