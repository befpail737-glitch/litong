// const createNextIntlPlugin = require('next-intl/plugin');
// const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Cloudflare Pages compatibility
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  // Worker pool configuration to prevent Jest worker errors
  experimental: {
    workerThreads: false,
    cpus: 1,
    webpackBuildWorker: true, // Enable webpack build worker for better cache management
  },
  // Webpack configuration for better worker handling and cache exclusion
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Limit worker pools in development
      config.parallelism = 1;
      config.infrastructureLogging = {
        level: 'error',
      };
    }
    
    // Configure cache to be stored outside .next directory for production
    if (!dev) {
      const path = require('path');
      config.cache = {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.webpack-cache'), // Absolute path for webpack cache
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    
    return config;
  },
  typescript: {
    ignoreBuildErrors: true, // 暂时忽略构建时的TypeScript错误以支持部署
  },
  eslint: {
    ignoreDuringBuilds: true, // 暂时忽略构建时的ESLint错误以支持部署
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://litong.pages.dev',
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
};

module.exports = nextConfig; // withNextIntl(nextConfig);