// 配置验证系统 - 确保所有配置正确且一致
import { validateEnvironment, environment } from '@/config/environment';
import { validateSanityConfig, sanityConfig } from '@/config/sanity';
import { APP_CONSTANTS, ERROR_MESSAGES } from '@/config/constants';
import { getCoreBrandSlugs, getBrandStats } from '@/config/brand-data';

// 验证结果接口
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    environment: boolean;
    sanity: boolean;
    brandData: boolean;
    constants: boolean;
  };
}

// 验证所有配置
export async function validateAllConfigurations(): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    summary: {
      environment: false,
      sanity: false,
      brandData: false,
      constants: false
    }
  };

  console.log('🔍 [validateAllConfigurations] Starting comprehensive configuration validation...');

  // 验证环境配置
  try {
    validateEnvironment();
    result.summary.environment = true;
    console.log('✅ Environment configuration valid');
  } catch (error) {
    result.errors.push(`Environment validation failed: ${error}`);
    result.isValid = false;
    console.error('❌ Environment configuration invalid:', error);
  }

  // 验证Sanity配置
  try {
    validateSanityConfig();
    result.summary.sanity = true;
    console.log('✅ Sanity configuration valid');
  } catch (error) {
    result.errors.push(`Sanity validation failed: ${error}`);
    result.isValid = false;
    console.error('❌ Sanity configuration invalid:', error);
  }

  // 验证品牌数据配置
  try {
    validateBrandDataConfig();
    result.summary.brandData = true;
    console.log('✅ Brand data configuration valid');
  } catch (error) {
    result.errors.push(`Brand data validation failed: ${error}`);
    result.isValid = false;
    console.error('❌ Brand data configuration invalid:', error);
  }

  // 验证常量配置
  try {
    validateConstantsConfig();
    result.summary.constants = true;
    console.log('✅ Constants configuration valid');
  } catch (error) {
    result.errors.push(`Constants validation failed: ${error}`);
    result.isValid = false;
    console.error('❌ Constants configuration invalid:', error);
  }

  // 检查配置一致性
  checkConfigurationConsistency(result);

  if (result.isValid) {
    console.log('🎉 All configurations are valid!');
  } else {
    console.error('❌ Configuration validation failed with errors:', result.errors);
  }

  return result;
}

// 验证品牌数据配置
function validateBrandDataConfig(): void {
  const brandSlugs = getCoreBrandSlugs();
  const brandStats = getBrandStats();

  // 检查是否有品牌数据
  if (brandSlugs.length === 0) {
    throw new Error('No core brand data found');
  }

  // 检查品牌数量是否合理
  if (brandSlugs.length < 3) {
    throw new Error('Too few core brands configured (minimum 3 required)');
  }

  if (brandSlugs.length > 100) {
    throw new Error('Too many core brands configured (maximum 100 allowed)');
  }

  // 检查特色品牌数量
  if (brandStats.featured === 0) {
    throw new Error('No featured brands configured');
  }

  // 检查slug格式
  for (const slug of brandSlugs) {
    if (!APP_CONSTANTS.SLUG_VALIDATION_REGEX.test(slug)) {
      throw new Error(`Invalid brand slug format: ${slug}`);
    }

    if (slug.length > APP_CONSTANTS.MAX_SLUG_LENGTH) {
      throw new Error(`Brand slug too long: ${slug} (max ${APP_CONSTANTS.MAX_SLUG_LENGTH} characters)`);
    }
  }
}

// 验证常量配置
function validateConstantsConfig(): void {
  // 检查分页配置
  if (APP_CONSTANTS.DEFAULT_PAGE_SIZE <= 0 || APP_CONSTANTS.DEFAULT_PAGE_SIZE > APP_CONSTANTS.MAX_PAGE_SIZE) {
    throw new Error('Invalid page size configuration');
  }

  // 检查图片质量配置
  if (APP_CONSTANTS.DEFAULT_IMAGE_QUALITY < 1 || APP_CONSTANTS.DEFAULT_IMAGE_QUALITY > 100) {
    throw new Error('Invalid image quality configuration (must be 1-100)');
  }

  // 检查支持的语言
  if (APP_CONSTANTS.SUPPORTED_LOCALES.length === 0) {
    throw new Error('No supported locales configured');
  }

  if (!APP_CONSTANTS.SUPPORTED_LOCALES.includes(APP_CONSTANTS.DEFAULT_LOCALE)) {
    throw new Error('Default locale not in supported locales list');
  }

  // 检查重试配置
  if (APP_CONSTANTS.MAX_RETRY_ATTEMPTS < 1 || APP_CONSTANTS.MAX_RETRY_ATTEMPTS > 10) {
    throw new Error('Invalid retry attempts configuration (must be 1-10)');
  }
}

// 检查配置一致性
function checkConfigurationConsistency(result: ValidationResult): void {
  // 检查品牌限制与环境配置的一致性
  const brandCount = getCoreBrandSlugs().length;
  if (environment.BRAND_LIMIT < brandCount) {
    result.warnings.push(`Environment BRAND_LIMIT (${environment.BRAND_LIMIT}) is less than core brand count (${brandCount})`);
  }

  // 检查Sanity和环境配置的一致性
  if (sanityConfig.projectId !== environment.SANITY_PROJECT_ID) {
    result.errors.push('Sanity project ID mismatch between sanityConfig and environment');
    result.isValid = false;
  }

  if (sanityConfig.dataset !== environment.SANITY_DATASET) {
    result.errors.push('Sanity dataset mismatch between sanityConfig and environment');
    result.isValid = false;
  }

  // 检查API版本格式
  const apiVersionRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!apiVersionRegex.test(environment.SANITY_API_VERSION)) {
    result.errors.push('Invalid Sanity API version format in environment');
    result.isValid = false;
  }
}

// 验证运行时配置
export async function validateRuntimeConfiguration(): Promise<boolean> {
  try {
    console.log('🚀 [validateRuntimeConfiguration] Validating runtime configuration...');

    // 检查必需的环境变量
    const requiredEnvVars = ['SANITY_PROJECT_ID', 'SANITY_DATASET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
      return false;
    }

    // 验证所有配置
    const validationResult = await validateAllConfigurations();

    if (!validationResult.isValid) {
      console.error('❌ Runtime configuration validation failed');
      return false;
    }

    console.log('✅ Runtime configuration validation passed');
    return true;

  } catch (error) {
    console.error('❌ Runtime configuration validation error:', error);
    return false;
  }
}

// 获取配置状态摘要
export function getConfigurationSummary() {
  const brandStats = getBrandStats();

  return {
    environment: {
      nodeEnv: environment.NODE_ENV,
      brandLimit: environment.BRAND_LIMIT,
      enableCdn: environment.ENABLE_CDN,
      debugMode: environment.DEBUG_MODE
    },
    sanity: {
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      useCdn: sanityConfig.useCdn
    },
    brandData: {
      totalBrands: brandStats.total,
      featuredBrands: brandStats.featured,
      totalProducts: brandStats.totalProducts
    },
    constants: {
      defaultLocale: APP_CONSTANTS.DEFAULT_LOCALE,
      supportedLocales: APP_CONSTANTS.SUPPORTED_LOCALES.length,
      maxPageSize: APP_CONSTANTS.MAX_PAGE_SIZE
    }
  };
}