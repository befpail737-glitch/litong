import { client, GROQ_FRAGMENTS } from './client';
import { getProducts, getSolutions, getArticles } from './queries';
import { 
  getAllFallbackBrands, 
  getFeaturedFallbackBrands, 
  getFallbackBrandStats,
  getFallbackBrandBySlug,
  type FallbackBrand 
} from '../data/fallback-brands';

export interface Brand {
  _id: string
  name: string
  description?: string
  website?: string
  country?: string
  isActive: boolean
  isFeatured?: boolean
  slug?: string
  logo?: any
  headquarters?: string
  established?: string
}

// 获取所有品牌 - 应急模式，减少数据库查询
export async function getAllBrands(): Promise<Brand[]> {
  try {
    console.log('🔍 [getAllBrands] Starting brand data fetch from Sanity...');

    // 应急模式：在构建时使用简化数据，减少查询负载
    const emergencyMode = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

    if (emergencyMode) {
      console.log('🚨 [getAllBrands] Emergency mode: Using hardcoded brands to avoid timeout');
      return [
        { _id: 'cree-id', name: 'Cree', slug: 'cree', isActive: true, isFeatured: true },
        { _id: 'ti-id', name: 'Texas Instruments', slug: 'ti', isActive: true, isFeatured: true },
        { _id: 'infineon-id', name: 'Infineon', slug: 'infineon', isActive: true, isFeatured: false },
        { _id: 'stm-id', name: 'STMicroelectronics', slug: 'stmicroelectronics', isActive: true, isFeatured: false },
        { _id: 'lem-id', name: 'LEM', slug: 'lem', isActive: true, isFeatured: false }
      ];
    }

    // 尝试更宽松的查询条件
    const query = `*[_type == "brandBasic" && (isActive == true || !defined(isActive))] | order(name asc) [0...10] {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      isFeatured,
      "slug": slug.current,
      logo,
      headquarters,
      established
    }`;

    console.log('🔍 [getAllBrands] Executing Sanity query...');
    const brands = await client.fetch(query);
    console.log(`🔍 [getAllBrands] Sanity query returned: ${brands?.length || 0} brands`);
    
    // 如果Sanity返回的品牌数量少于5个，使用fallback数据
    if (!brands || brands.length < 5) {
      console.warn('Sanity returned insufficient brands, using fallback data');
      const fallbackBrands = getAllFallbackBrands();
      
      // 合并Sanity数据和fallback数据，避免重复
      const combined = [...brands];
      fallbackBrands.forEach(fallback => {
        if (!combined.find(brand => brand.name === fallback.name)) {
          combined.push(fallback as Brand);
        }
      });
      
      return combined;
    }
    
    return brands;
  } catch (error) {
    console.error('Error fetching brands, using fallback data:', error);
    return getAllFallbackBrands() as Brand[];
  }
}

// 获取特色品牌 - 带fallback支持
export async function getFeaturedBrands(): Promise<Brand[]> {
  try {
    const query = `*[_type == "brandBasic" && (isActive == true || !defined(isActive)) && isFeatured == true] | order(name asc) {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      isFeatured,
      "slug": slug.current,
      logo,
      headquarters,
      established
    }`;

    const brands = await client.fetch(query);
    
    // 如果Sanity返回的特色品牌数量少于3个，使用fallback数据
    if (!brands || brands.length < 3) {
      console.warn('Sanity returned insufficient featured brands, using fallback data');
      const fallbackBrands = getFeaturedFallbackBrands();
      
      // 合并Sanity数据和fallback数据
      const combined = [...brands];
      fallbackBrands.forEach(fallback => {
        if (!combined.find(brand => brand.name === fallback.name)) {
          combined.push(fallback as Brand);
        }
      });
      
      return combined;
    }
    
    return brands;
  } catch (error) {
    console.error('Error fetching featured brands, using fallback data:', error);
    return getFeaturedFallbackBrands() as Brand[];
  }
}

// 根据名称获取品牌
export async function getBrandByName(name: string): Promise<Brand | null> {
  try {
    const query = `*[_type == "brandBasic" && name == $name && isActive == true && !(_id in path("drafts.**"))][0] {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      isFeatured,
      "slug": slug.current,
      logo,
      headquarters,
      established
    }`;

    const brand = await client.fetch(query, { name });
    return brand || null;
  } catch (error) {
    console.error('Error fetching brand by name:', error);
    return null;
  }
}

// 标准化slug格式
function normalizeSlug(slug: string): string {
  return slug.toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// 根据slug获取品牌数据
export async function getBrandData(slug: string): Promise<Brand | null> {
  try {
    console.log(`🔍 [getBrandData] Searching for brand with slug: ${slug}`);

    if (!slug || slug.trim() === '') {
      console.warn('❌ [getBrandData] Empty slug provided');
      return null;
    }

    const normalizedSlug = normalizeSlug(slug);
    const decodedSlug = decodeURIComponent(slug);

    // 尝试多种匹配策略
    const searchTerms = [
      slug,                    // 原始slug
      decodedSlug,            // URL解码后的slug
      normalizedSlug,         // 标准化slug
      slug.toLowerCase(),     // 小写slug
      decodedSlug.toLowerCase() // 小写解码slug
    ];

    // 去重搜索词
    const uniqueSearchTerms = [...new Set(searchTerms)];

    for (const searchTerm of uniqueSearchTerms) {
      // 精确匹配
      let query = `*[_type == "brandBasic" && slug.current == $slug && isActive == true && !(_id in path("drafts.**"))][0] {
        _id,
        _type,
        name,
        description,
        website,
        country,
        isActive,
        isFeatured,
        "slug": slug.current,
        logo,
        headquarters,
        established
      }`;

      let brand = await client.fetch(query, { slug: searchTerm });

      if (brand) {
        console.log(`✅ [getBrandData] Found brand: ${brand.name} with search term: ${searchTerm}`);
        return brand;
      }

      // 名称匹配
      query = `*[_type == "brandBasic" && (name match $slug || slug.current match $slug) && (isActive == true || !defined(isActive)) && !(_id in path("drafts.**"))][0] {
        _id,
        _type,
        name,
        description,
        website,
        country,
        isActive,
        isFeatured,
        "slug": slug.current,
        logo,
        headquarters,
        established
      }`;

      brand = await client.fetch(query, { slug: searchTerm + '*' });

      if (brand) {
        console.log(`✅ [getBrandData] Found brand by name match: ${brand.name} with search term: ${searchTerm}`);
        return brand;
      }
    }

    console.warn(`❌ [getBrandData] Brand not found for any search terms: ${uniqueSearchTerms.join(', ')}`);

    // 作为最后的fallback，从fallback数据中查找
    const fallbackBrand = getFallbackBrandBySlug(slug);
    if (fallbackBrand) {
      console.log(`🔄 [getBrandData] Using fallback brand: ${fallbackBrand.name}`);
      return fallbackBrand as Brand;
    }

    return null;
  } catch (error) {
    console.error('Error fetching brand data:', error);

    // 错误时尝试fallback数据
    const fallbackBrand = getFallbackBrandBySlug(slug);
    if (fallbackBrand) {
      console.log(`🔄 [getBrandData] Using fallback brand due to error: ${fallbackBrand.name}`);
      return fallbackBrand as Brand;
    }

    return null;
  }
}

// 获取按分类分组的品牌数据
export async function getBrandsByCategories() {
  try {
    const query = `{
      "brandCategories": *[_type == "productCategory" && level == 1 && isVisible == true] | order(sortOrder asc, name asc) {
        _id,
        name,
        "slug": slug.current,
        description,
        icon,
        "brands": array::unique(*[_type == "product" && isActive == true && category._ref == ^._id].brand->)[defined(@) && isActive == true] | order(name asc) {
          _id,
          name,
          "slug": slug.current,
          description,
          website,
          country,
          headquarters,
          established,
          logo,
          isActive,
          isFeatured
        }
      },
      "allBrands": *[_type == "brandBasic" && isActive == true && !(_id in path("drafts.**"))] | order(name asc) {
        _id,
        name,
        "slug": slug.current,
        description,
        website,
        country,
        headquarters,
        established,
        logo,
        isActive,
        isFeatured
      }
    }`;

    const result = await client.fetch(query);
    
    // 过滤掉没有品牌的分类
    const validCategories = result?.brandCategories?.filter(cat => cat.brands && cat.brands.length > 0) || [];
    
    return {
      brandCategories: validCategories,
      allBrands: result?.allBrands || []
    };
  } catch (error) {
    console.error('Error fetching brands by categories:', error);
    return {
      brandCategories: [],
      allBrands: []
    };
  }
}

// 获取品牌统计数据 - 带fallback支持
export async function getBrandStats() {
  try {
    const query = `{
      "total": count(*[_type == "brandBasic" && (isActive == true || !defined(isActive))]),
      "featured": count(*[_type == "brandBasic" && (isActive == true || !defined(isActive)) && isFeatured == true]),
      "solutions": count(*[_type == "solution" && (isPublished == true || !defined(isPublished))])
    }`;

    const stats = await client.fetch(query);
    
    // 如果Sanity返回的数据不足，使用fallback数据补充
    const fallbackStats = getFallbackBrandStats();
    
    return {
      total: Math.max(stats?.total || 0, fallbackStats.total),
      authorized: Math.max(stats?.featured || 0, fallbackStats.authorized),
      totalProducts: Math.max(stats?.solutions * 1000 || 0, fallbackStats.totalProducts),
    };
  } catch (error) {
    console.error('Error fetching brand stats, using fallback data:', error);
    return getFallbackBrandStats();
  }
}

// 获取品牌相关产品
export async function getBrandProducts(brandSlug: string, limit = 12) {
  try {
    const result = await getProducts({ brand: brandSlug, limit });
    return result.products || [];
  } catch (error) {
    console.error('Error fetching brand products:', error);
    return [];
  }
}

// 获取品牌相关解决方案
export async function getBrandSolutions(brandSlug: string, limit = 6) {
  try {
    const result = await getSolutions({ brand: brandSlug, limit });
    return result.solutions || [];
  } catch (error) {
    console.error('Error fetching brand solutions:', error);
    return [];
  }
}

// 获取品牌相关技术文章
export async function getBrandArticles(brandSlug: string, limit = 6) {
  try {
    const result = await getArticles({ brand: brandSlug, limit });
    return result.articles || [];
  } catch (error) {
    console.error('Error fetching brand articles:', error);
    return [];
  }
}

// 获取品牌产品分类统计
export async function getBrandProductCategories(brandSlug: string) {
  try {
    const query = `*[_type == "product" && brand->slug.current == "${brandSlug}" && isActive == true] {
      "category": category-> {
        name,
        "slug": slug.current,
        description
      }
    } | order(category.name asc)`;
    
    const products = await client.fetch(query);
    
    // 统计每个分类的产品数量
    const categoryStats = {};
    products.forEach(product => {
      if (product.category) {
        const categoryName = product.category.name;
        if (!categoryStats[categoryName]) {
          categoryStats[categoryName] = {
            ...product.category,
            count: 0
          };
        }
        categoryStats[categoryName].count++;
      }
    });
    
    return Object.values(categoryStats);
  } catch (error) {
    console.error('Error fetching brand product categories:', error);
    return [];
  }
}

// 获取品牌slug列表（仅用于generateStaticParams，减少查询复杂度）
// 注意：此函数已被 brand-config.ts 中的动态系统替换
// 保留用于向后兼容，建议使用 getBrandSlugs() from '@/lib/brands/brand-config'
export async function getBrandSlugsOnly(limit = 50): Promise<string[]> {
  console.warn('⚠️ [getBrandSlugsOnly] This function is deprecated. Use getBrandSlugs from @/lib/brands/brand-config instead.');

  // 导入动态配置
  const { getBrandSlugs } = await import('@/lib/brands/brand-config');
  return getBrandSlugs(limit);
}

// 获取品牌完整数据（包含相关内容）
export async function getBrandWithContent(brandSlug: string) {
  try {
    console.log(`🔍 [getBrandWithContent] Fetching content for brand: ${brandSlug}`);

    if (!brandSlug || brandSlug.trim() === '') {
      console.warn('❌ [getBrandWithContent] Empty brandSlug provided');
      return {
        brand: null,
        products: [],
        solutions: [],
        articles: [],
        categories: []
      };
    }

    // 首先获取品牌数据，如果品牌不存在就不需要获取其他数据
    const brand = await getBrandData(brandSlug);

    if (!brand) {
      console.warn(`❌ [getBrandWithContent] Brand not found: ${brandSlug}`);
      return {
        brand: null,
        products: [],
        solutions: [],
        articles: [],
        categories: []
      };
    }

    console.log(`✅ [getBrandWithContent] Brand found: ${brand.name}, fetching related content...`);

    // 并行获取相关内容，但有错误容错
    const [
      products,
      solutions,
      articles,
      categories
    ] = await Promise.allSettled([
      getBrandProducts(brandSlug, 8),
      getBrandSolutions(brandSlug, 4),
      getBrandArticles(brandSlug, 4),
      getBrandProductCategories(brandSlug)
    ]);

    // 安全地提取结果，失败的请求返回空数组
    const safeProducts = products.status === 'fulfilled' ? products.value : [];
    const safeSolutions = solutions.status === 'fulfilled' ? solutions.value : [];
    const safeArticles = articles.status === 'fulfilled' ? articles.value : [];
    const safeCategories = categories.status === 'fulfilled' ? categories.value : [];

    console.log(`✅ [getBrandWithContent] Content fetched - Products: ${safeProducts.length}, Solutions: ${safeSolutions.length}, Articles: ${safeArticles.length}, Categories: ${safeCategories.length}`);

    return {
      brand,
      products: safeProducts,
      solutions: safeSolutions,
      articles: safeArticles,
      categories: safeCategories
    };
  } catch (error) {
    console.error('Error fetching brand with content:', error);

    // 尝试至少返回brand数据，即使其他内容获取失败
    const brand = await getBrandData(brandSlug).catch(() => null);

    return {
      brand,
      products: [],
      solutions: [],
      articles: [],
      categories: []
    };
  }
}
