const withNextIntl = require('next-intl/plugin')(
  // This is the default location for the i18n config
  './src/i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['xlsx']
  },
  
  // 配置静态导出用于Cloudflare Pages
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // 图片优化配置
  images: {
    unoptimized: true
  },
  
  // 环境变量配置
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  }
}

module.exports = withNextIntl(nextConfig);