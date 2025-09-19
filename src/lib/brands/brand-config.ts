// 动态品牌配置管理 - 替换硬编码品牌数据
import { client } from '@/lib/sanity/client';
import { queryLimits, DOCUMENT_TYPES } from '@/config/sanity';
import { APP_CONSTANTS, ERROR_MESSAGES } from '@/config/constants';

// 品牌基础接口
export interface BrandConfig {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  isFeatured?: boolean;
  priority?: number;
}

// 缓存管理
let brandCache: {
  data: BrandConfig[] | null;
  timestamp: number;
  ttl: number;
} = {
  data: null,
  timestamp: 0,
  ttl: 1000 * 60 * 30, // 30分钟缓存
};

// 导入配置化的品牌数据
import { getCoreBrandSlugs, getBrandDataBySlug, getExpandedCoreBrandSlugs } from '@/config/brand-data';

// 从Sanity获取所有激活的品牌配置 - 支持分批查询优化
export async function fetchBrandConfigs(limit?: number, offset: number = 0): Promise<BrandConfig[]> {
  try {
    const actualLimit = limit || queryLimits.brands;

    console.log(`🔍 [fetchBrandConfigs] Fetching up to ${actualLimit} brand configs from Sanity (offset: ${offset})...`);

    const query = `*[_type == "${DOCUMENT_TYPES.BRAND}" && (isActive == true || !defined(isActive)) && defined(slug.current) && defined(name)] | order(coalesce(priority, 999) asc, name asc) [${offset}...${offset + actualLimit}] {
      _id,
      name,
      "slug": slug.current,
      isActive,
      isFeatured,
      priority
    }`;

    const brands = await client.fetch(query);

    if (!brands || brands.length === 0) {
      console.warn('⚠️ [fetchBrandConfigs] No brands found in Sanity, using fallback strategy');
      return createFallbackBrandConfigs();
    }

    const validBrands = brands.filter((brand: any) =>
      brand._id &&
      brand.name &&
      brand.slug &&
      typeof brand.slug === 'string' &&
      brand.slug.trim().length > 0
    );

    console.log(`✅ [fetchBrandConfigs] Successfully fetched ${validBrands.length} valid brand configs`);

    // 更新缓存
    brandCache = {
      data: validBrands,
      timestamp: Date.now(),
      ttl: brandCache.ttl
    };

    return validBrands;

  } catch (error) {
    console.error('❌ [fetchBrandConfigs] Error fetching brand configs:', error);
    return createFallbackBrandConfigs();
  }
}

// 获取品牌slug列表（用于generateStaticParams）- 支持大批量查询
export async function getBrandSlugs(limit?: number): Promise<string[]> {
  try {
    const requestedLimit = limit || queryLimits.brands;

    // 检查缓存
    if (brandCache.data && (Date.now() - brandCache.timestamp) < brandCache.ttl) {
      console.log('📦 [getBrandSlugs] Using cached brand data');
      const slugs = brandCache.data
        .slice(0, requestedLimit)
        .map(brand => brand.slug);
      return slugs;
    }

    // 如果请求大量品牌，使用分批查询避免超时
    if (requestedLimit > 100) {
      console.log(`🔧 [getBrandSlugs] Using batched queries for ${requestedLimit} brands`);
      const batch1 = await fetchBrandConfigs(100, 0);
      const batch2 = await fetchBrandConfigs(requestedLimit - 100, 100);
      const allBrands = [...batch1, ...batch2];

      // 更新缓存
      brandCache = {
        data: allBrands,
        timestamp: Date.now(),
        ttl: brandCache.ttl
      };

      return allBrands.map(brand => brand.slug);
    } else {
      // 获取新数据
      const brands = await fetchBrandConfigs(requestedLimit);
      return brands.map(brand => brand.slug);
    }

  } catch (error) {
    console.error('❌ [getBrandSlugs] Error getting brand slugs:', error);
    return getExpandedCoreBrandSlugs();
  }
}

// 创建fallback品牌配置
function createFallbackBrandConfigs(): BrandConfig[] {
  console.log('🆘 [createFallbackBrandConfigs] Creating fallback brand configs from core data');

  const coreSlugs = getCoreBrandSlugs();

  return coreSlugs.map((slug, index) => {
    const brandData = getBrandDataBySlug(slug);
    return {
      _id: `fallback-${slug}`,
      name: brandData?.name || slug.charAt(0).toUpperCase() + slug.slice(1),
      slug,
      isActive: true,
      isFeatured: brandData?.featured || index < 3, // 使用配置的featured状态
      priority: index + 1
    };
  });
}

// 获取特色品牌
export async function getFeaturedBrandSlugs(limit?: number): Promise<string[]> {
  try {
    const brands = await fetchBrandConfigs();
    const featuredBrands = brands
      .filter(brand => brand.isFeatured)
      .slice(0, limit || APP_CONSTANTS.MAX_FEATURED_BRANDS);

    return featuredBrands.map(brand => brand.slug);
  } catch (error) {
    console.error('❌ [getFeaturedBrandSlugs] Error getting featured brand slugs:', error);
    // 使用配置化的特色品牌数据
    const { getFeaturedBrandData } = await import('@/config/brand-data');
    return getFeaturedBrandData().slice(0, limit || 3).map(brand => brand.slug);
  }
}

// 验证品牌slug是否存在
export async function validateBrandSlug(slug: string): Promise<boolean> {
  try {
    const brandSlugs = await getBrandSlugs();
    return brandSlugs.includes(slug);
  } catch (error) {
    console.error('❌ [validateBrandSlug] Error validating brand slug:', error);
    return getCoreBrandSlugs().includes(slug);
  }
}

// 清除品牌缓存
export function clearBrandCache(): void {
  brandCache.data = null;
  brandCache.timestamp = 0;
  console.log('🧹 [clearBrandCache] Brand cache cleared');
}

// 获取缓存状态
export function getBrandCacheStatus() {
  const isValid = brandCache.data && (Date.now() - brandCache.timestamp) < brandCache.ttl;
  return {
    hasData: !!brandCache.data,
    isValid,
    itemCount: brandCache.data?.length || 0,
    age: Date.now() - brandCache.timestamp,
    ttl: brandCache.ttl
  };
}