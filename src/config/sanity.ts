// Sanity CMS专用配置管理
import { environment, validateEnvironment } from './environment';
import { APP_CONSTANTS } from './constants';

// Sanity客户端配置
export const sanityConfig = {
  projectId: environment.SANITY_PROJECT_ID,
  dataset: environment.SANITY_DATASET,
  apiVersion: environment.SANITY_API_VERSION,
  useCdn: environment.ENABLE_CDN,
  token: environment.SANITY_API_TOKEN,
  perspective: 'published' as const,
  ignoreBrowserTokenWarning: true,
};

// 预览模式配置
export const previewConfig = {
  ...sanityConfig,
  useCdn: false,
  perspective: 'previewDrafts' as const,
};

// GROQ查询限制配置
export const queryLimits = {
  brands: environment.BRAND_LIMIT,
  products: environment.PRODUCT_LIMIT,
  solutions: environment.SOLUTION_LIMIT,
  articles: 20,
  categories: 50,
  maxRetries: APP_CONSTANTS.MAX_RETRY_ATTEMPTS,
  retryDelay: APP_CONSTANTS.RETRY_DELAY_MS,
};

// Sanity文档类型
export const DOCUMENT_TYPES = {
  BRAND: 'brandBasic',
  PRODUCT: 'product',
  SOLUTION: 'solution',
  ARTICLE: 'article',
  CATEGORY: 'category',
} as const;

// 图片变换配置
export const imageTransforms = {
  thumbnail: { width: 150, height: 150, quality: 80 },
  small: { width: 300, height: 200, quality: 85 },
  medium: { width: 600, height: 400, quality: 85 },
  large: { width: 1200, height: 800, quality: 90 },
  hero: { width: 1920, height: 1080, quality: 95 },
};

// 验证Sanity配置
export function validateSanityConfig() {
  try {
    validateEnvironment();

    if (!sanityConfig.projectId) {
      throw new Error('Sanity project ID is required');
    }

    if (!sanityConfig.dataset) {
      throw new Error('Sanity dataset is required');
    }

    // 验证API版本格式
    const apiVersionRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!apiVersionRegex.test(sanityConfig.apiVersion)) {
      throw new Error('Invalid Sanity API version format. Expected YYYY-MM-DD');
    }

    return true;
  } catch (error) {
    console.error('Sanity configuration validation failed:', error);
    throw error;
  }
}

// 获取环境特定的客户端配置
export function getClientConfig(preview = false) {
  validateSanityConfig();
  return preview ? previewConfig : sanityConfig;
}