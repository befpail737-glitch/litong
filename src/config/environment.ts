// 环境配置管理 - 集中管理所有环境变量和配置
export const environment = {
  // Node环境
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Sanity CMS配置
  SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID || 'oquvb2bs',
  SANITY_DATASET: process.env.SANITY_DATASET || 'production',
  SANITY_API_VERSION: process.env.SANITY_API_VERSION || '2023-05-03',
  SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,

  // 构建配置 - 减少批次大小防止Cloudflare构建超时
  BRAND_LIMIT: parseInt(process.env.RUNTIME_BRAND_LIMIT || process.env.BRAND_LIMIT || '50'),
  PRODUCT_LIMIT: parseInt(process.env.RUNTIME_PRODUCT_LIMIT || process.env.PRODUCT_LIMIT || '30'),
  SOLUTION_LIMIT: parseInt(process.env.RUNTIME_SOLUTION_LIMIT || process.env.SOLUTION_LIMIT || '20'),
  SUPPORT_LIMIT: parseInt(process.env.RUNTIME_SUPPORT_LIMIT || process.env.SUPPORT_LIMIT || '40'),

  // Cloudflare优化配置
  IS_CLOUDFLARE: process.env.CF_PAGES === 'true' || process.env.CLOUDFLARE_ENVIRONMENT !== undefined,
  BUILD_TIMEOUT: parseInt(process.env.BUILD_TIMEOUT || '240'), // 4分钟构建超时
  QUERY_TIMEOUT: parseInt(process.env.QUERY_TIMEOUT || '15'), // 15秒查询超时
  CONCURRENT_BUILDS: parseInt(process.env.CONCURRENT_BUILDS || '2'), // 并发构建数量

  // 分阶段构建配置
  BUILD_STAGE: process.env.BUILD_STAGE || 'full', // 'minimal', 'partial', 'full'
  EMERGENCY_BUILD: process.env.EMERGENCY_BUILD === 'true',

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

  if (environment.BUILD_TIMEOUT < 60 || environment.BUILD_TIMEOUT > 900) {
    errors.push('BUILD_TIMEOUT must be between 60 and 900 seconds');
  }

  if (environment.QUERY_TIMEOUT < 5 || environment.QUERY_TIMEOUT > 60) {
    errors.push('QUERY_TIMEOUT must be between 5 and 60 seconds');
  }

  if (environment.CONCURRENT_BUILDS < 1 || environment.CONCURRENT_BUILDS > 10) {
    errors.push('CONCURRENT_BUILDS must be between 1 and 10');
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

// Cloudflare特定配置
export const isCloudflare = () => environment.IS_CLOUDFLARE;
export const isEmergencyBuild = () => environment.EMERGENCY_BUILD;
export const getBuildStage = () => environment.BUILD_STAGE;

export const getCloudflareOptimizedLimits = () => {
  // 分阶段构建的限制调整
  const stage = getBuildStage();
  const isEmergency = isEmergencyBuild();

  if (isEmergency || stage === 'minimal') {
    return {
      BRAND_LIMIT: Math.min(environment.BRAND_LIMIT, 10),
      PRODUCT_LIMIT: Math.min(environment.PRODUCT_LIMIT, 5),
      SOLUTION_LIMIT: Math.min(environment.SOLUTION_LIMIT, 3),
      SUPPORT_LIMIT: Math.min(environment.SUPPORT_LIMIT, 15),
    };
  }

  if (stage === 'partial' || isCloudflare()) {
    return {
      BRAND_LIMIT: Math.min(environment.BRAND_LIMIT, 30),
      PRODUCT_LIMIT: Math.min(environment.PRODUCT_LIMIT, 20),
      SOLUTION_LIMIT: Math.min(environment.SOLUTION_LIMIT, 15),
      SUPPORT_LIMIT: Math.min(environment.SUPPORT_LIMIT, 30),
    };
  }

  // full build
  return {
    BRAND_LIMIT: environment.BRAND_LIMIT,
    PRODUCT_LIMIT: environment.PRODUCT_LIMIT,
    SOLUTION_LIMIT: environment.SOLUTION_LIMIT,
    SUPPORT_LIMIT: environment.SUPPORT_LIMIT,
  };
};