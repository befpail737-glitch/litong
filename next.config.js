// const createNextIntlPlugin = require('next-intl/plugin');
// const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Worker pool configuration to prevent Jest worker errors
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  // Webpack configuration for better worker handling
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Limit worker pools in development
      config.parallelism = 1;
      config.infrastructureLogging = {
        level: 'error',
      };
    }
    return config;
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['localhost', 'cdn.sanity.io'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
};

module.exports = nextConfig; // withNextIntl(nextConfig);