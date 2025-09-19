// 环境配置管理 - 集中管理所有环境变量和配置
export const environment = {
  // Node环境
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Sanity CMS配置
  SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID || 'oquvb2bs',
  SANITY_DATASET: process.env.SANITY_DATASET || 'production',
  SANITY_API_VERSION: process.env.SANITY_API_VERSION || '2023-05-03',
  SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,

  // 构建配置 - 大幅提升品牌限制以解决子目录缺失问题
  BRAND_LIMIT: parseInt(process.env.BRAND_LIMIT || '200'),
  PRODUCT_LIMIT: parseInt(process.env.PRODUCT_LIMIT || '100'),
  SOLUTION_LIMIT: parseInt(process.env.SOLUTION_LIMIT || '50'),

  // 缓存配置
  ENABLE_CDN: process.env.NODE_ENV === 'production',
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '3600'), // 1小时

  // 调试配置
  DEBUG_MODE: process.env.DEBUG_MODE === 'true',
  VERBOSE_LOGGING: process.env.VERBOSE_LOGGING === 'true',
} as const;

// 配置验证
export function validateEnvironment() {
  const errors: string[] = [];

  if (!environment.SANITY_PROJECT_ID) {
    errors.push('SANITY_PROJECT_ID is required');
  }

  if (!environment.SANITY_DATASET) {
    errors.push('SANITY_DATASET is required');
  }

  if (environment.BRAND_LIMIT < 1 || environment.BRAND_LIMIT > 1000) {
    errors.push('BRAND_LIMIT must be between 1 and 1000');
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.join(', ')}`);
  }

  return true;
}

// 类型安全的环境配置访问
export function getConfig<K extends keyof typeof environment>(key: K): typeof environment[K] {
  return environment[key];
}

// 检查是否为生产环境
export const isProduction = () => environment.NODE_ENV === 'production';
export const isDevelopment = () => environment.NODE_ENV === 'development';
export const isTest = () => environment.NODE_ENV === 'test';