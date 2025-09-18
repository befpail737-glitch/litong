// 品牌注册系统 - 提供统一的品牌管理接口
import { getBrandSlugs, getFeaturedBrandSlugs, validateBrandSlug, clearBrandCache } from './brand-config';
import { APP_CONSTANTS } from '@/config/constants';
import { queryLimits } from '@/config/sanity';

// 品牌注册表类 - 单例模式
class BrandRegistry {
  private static instance: BrandRegistry;
  private brandSlugs: string[] = [];
  private featuredSlugs: string[] = [];
  private lastUpdate: number = 0;
  private updateInterval: number = 1000 * 60 * 30; // 30分钟更新间隔

  private constructor() {}

  static getInstance(): BrandRegistry {
    if (!BrandRegistry.instance) {
      BrandRegistry.instance = new BrandRegistry();
    }
    return BrandRegistry.instance;
  }

  // 初始化品牌注册表
  async initialize(): Promise<void> {
    try {
      console.log('🚀 [BrandRegistry] Initializing brand registry...');

      const [allSlugs, featuredSlugs] = await Promise.all([
        getBrandSlugs(queryLimits.brands),
        getFeaturedBrandSlugs(APP_CONSTANTS.MAX_FEATURED_BRANDS)
      ]);

      this.brandSlugs = allSlugs;
      this.featuredSlugs = featuredSlugs;
      this.lastUpdate = Date.now();

      console.log(`✅ [BrandRegistry] Initialized with ${allSlugs.length} brands (${featuredSlugs.length} featured)`);
    } catch (error) {
      console.error('❌ [BrandRegistry] Failed to initialize:', error);
      throw error;
    }
  }

  // 获取所有品牌slugs
  async getAllBrandSlugs(forceRefresh = false): Promise<string[]> {
    if (this.shouldUpdate() || forceRefresh) {
      await this.initialize();
    }

    return [...this.brandSlugs];
  }

  // 获取特色品牌slugs
  async getFeaturedBrandSlugs(forceRefresh = false): Promise<string[]> {
    if (this.shouldUpdate() || forceRefresh) {
      await this.initialize();
    }

    return [...this.featuredSlugs];
  }

  // 验证品牌slug
  async isValidBrandSlug(slug: string, forceRefresh = false): Promise<boolean> {
    if (this.shouldUpdate() || forceRefresh) {
      await this.initialize();
    }

    return this.brandSlugs.includes(slug);
  }

  // 生成静态参数（用于generateStaticParams）
  async generateStaticParams(locales: string[] = APP_CONSTANTS.SUPPORTED_LOCALES): Promise<Array<{ locale: string; slug: string }>> {
    const brandSlugs = await this.getAllBrandSlugs();
    const params: Array<{ locale: string; slug: string }> = [];

    for (const locale of locales) {
      for (const slug of brandSlugs) {
        if (slug && typeof slug === 'string' && slug.trim().length > 0) {
          params.push({ locale, slug: slug.trim() });

          // 对于中文品牌，也添加URL编码版本
          const encodedSlug = encodeURIComponent(slug.trim());
          if (slug !== encodedSlug) {
            params.push({ locale, slug: encodedSlug });
          }
        }
      }
    }

    console.log(`📋 [BrandRegistry] Generated ${params.length} static params for ${brandSlugs.length} brands`);
    return params;
  }

  // 生成特色品牌静态参数
  async generateFeaturedStaticParams(locales: string[] = ['zh-CN', 'en']): Promise<Array<{ locale: string; slug: string }>> {
    const featuredSlugs = await this.getFeaturedBrandSlugs();
    const params: Array<{ locale: string; slug: string }> = [];

    for (const locale of locales) {
      for (const slug of featuredSlugs) {
        params.push({ locale, slug });
      }
    }

    return params;
  }

  // 获取分页品牌slugs
  async getPaginatedBrandSlugs(page: number = 1, limit: number = 20): Promise<{
    slugs: string[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const allSlugs = await this.getAllBrandSlugs();
    const total = allSlugs.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const slugs = allSlugs.slice(startIndex, endIndex);

    return {
      slugs,
      total,
      page,
      totalPages
    };
  }

  // 搜索品牌slugs
  async searchBrandSlugs(query: string): Promise<string[]> {
    const allSlugs = await this.getAllBrandSlugs();
    const lowerQuery = query.toLowerCase();

    return allSlugs.filter(slug =>
      slug.toLowerCase().includes(lowerQuery)
    );
  }

  // 检查是否需要更新
  private shouldUpdate(): boolean {
    return Date.now() - this.lastUpdate > this.updateInterval;
  }

  // 强制刷新
  async refresh(): Promise<void> {
    clearBrandCache();
    await this.initialize();
  }

  // 获取统计信息
  getStats() {
    return {
      totalBrands: this.brandSlugs.length,
      featuredBrands: this.featuredSlugs.length,
      lastUpdate: this.lastUpdate,
      isStale: this.shouldUpdate()
    };
  }
}

// 导出单例实例
export const brandRegistry = BrandRegistry.getInstance();

// 便捷函数导出
export const getAllBrandSlugs = (forceRefresh?: boolean) => brandRegistry.getAllBrandSlugs(forceRefresh);
export const getFeaturedBrands = (forceRefresh?: boolean) => brandRegistry.getFeaturedBrandSlugs(forceRefresh);
export const isValidBrand = (slug: string, forceRefresh?: boolean) => brandRegistry.isValidBrandSlug(slug, forceRefresh);
export const generateBrandStaticParams = (locales?: string[]) => brandRegistry.generateStaticParams(locales);
export const refreshBrands = () => brandRegistry.refresh();