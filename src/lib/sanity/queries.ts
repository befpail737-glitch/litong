import { groq } from 'next-sanity';

import { client, GROQ_FRAGMENTS, withRetry, SanityError } from './client';
import { getCloudflareOptimizedLimits } from '../config/environment';

// 轻量级函数仅用于generateStaticParams，减少查询复杂度 - 大幅减少以避免超时
export async function getProductSlugsOnly(limit = 5): Promise<string[]> {
  const startTime = Date.now();
  console.log(`🚀 [getProductSlugsOnly] Starting query with limit: ${limit}`);

  try {
    // 简化查询 - 移除草稿检查，提高性能
    const query = groq`
      *[_type == "product" && isActive == true && defined(slug.current)] | order(_updatedAt desc) [0...${limit}] {
        "slug": slug.current
      }
    `;

    const products = await withRetry(() => client.fetch(query), 3, 1000, 15000); // 15秒超时
    const slugs = products?.map(product => product.slug).filter(Boolean) || [];

    const duration = Date.now() - startTime;
    console.log(`✅ [getProductSlugsOnly] Query completed in ${duration}ms, returned ${slugs.length} slugs`);

    return slugs;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [getProductSlugsOnly] Error fetching product slugs after ${duration}ms:`, error);
    console.warn('⚠️ [getProductSlugsOnly] Returning empty array - no hardcoded fallbacks');
    return [];
  }
}

export async function getSolutionSlugsOnly(limit = 3): Promise<string[]> {
  const startTime = Date.now();
  console.log(`🚀 [getSolutionSlugsOnly] Starting query with limit: ${limit}`);

  try {
    // 简化查询 - 减少条件复杂度
    const query = groq`
      *[_type == "solution" && isPublished == true && defined(slug.current)] | order(_updatedAt desc) [0...${limit}] {
        "slug": slug.current
      }
    `;

    const solutions = await withRetry(() => client.fetch(query), 3, 1000, 15000); // 15秒超时
    const slugs = solutions?.map(solution => solution.slug).filter(Boolean) || [];

    const duration = Date.now() - startTime;
    console.log(`✅ [getSolutionSlugsOnly] Query completed in ${duration}ms, returned ${slugs.length} slugs`);

    return slugs;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [getSolutionSlugsOnly] Error fetching solution slugs after ${duration}ms:`, error);
    console.warn('⚠️ [getSolutionSlugsOnly] Returning empty array - no hardcoded fallbacks');
    return [];
  }
}

// 获取品牌-产品组合用于静态参数生成 - 使用真实Sanity数据，减少批次大小
export async function getBrandProductCombinations(limit?: number): Promise<Array<{brandSlug: string, productSlug: string}>> {
  const optimizedLimits = getCloudflareOptimizedLimits();
  const actualLimit = limit || optimizedLimits.BRAND_LIMIT;
  const startTime = Date.now();
  console.log(`🚀 [getBrandProductCombinations] Starting query with limit: ${actualLimit}`);

  try {
    console.log(`🔧 [getBrandProductCombinations] Fetching real brand-product combinations from Sanity (limit: ${actualLimit})...`);

    // 移除应急模式 - 始终使用真实Sanity数据

    // 简化查询 - 仅获取必要字段，减少处理时间
    const query = groq`
      *[_type == "product" && isActive == true && defined(slug.current) && defined(brand->slug.current)] | order(_updatedAt desc) [0...${actualLimit}] {
        "productSlug": slug.current,
        "brandSlug": brand->slug.current
      }
    `;

    const combinations = await withRetry(() => client.fetch(query), 3, 1000, 15000); // 15秒超时
    const validCombinations = combinations?.filter(c => c.brandSlug && c.productSlug) || [];

    const duration = Date.now() - startTime;
    console.log(`✅ [getBrandProductCombinations] Query completed in ${duration}ms, returned ${validCombinations.length} combinations`);
    console.log('🔍 [getBrandProductCombinations] Sample combinations:', validCombinations.slice(0, 5));

    // 调试信息：如果没有数据，提供详细诊断
    if (validCombinations.length === 0) {
      console.warn('⚠️ [getBrandProductCombinations] 没有找到品牌-产品组合！这将导致generateStaticParams返回空数组');
      console.warn('⚠️ [getBrandProductCombinations] 检查Sanity数据库中是否有正确的品牌和产品数据');
    }

    return validCombinations;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [getBrandProductCombinations] Error fetching brand-product combinations after ${duration}ms:`, error);
    console.warn('⚠️ [getBrandProductCombinations] Returning empty array - no hardcoded fallbacks');
    return [];
  }
}

// 获取品牌-解决方案组合用于静态参数生成 - 减少批次大小防止超时
export async function getBrandSolutionCombinations(limit?: number): Promise<Array<{brandSlug: string, solutionSlug: string}>> {
  const optimizedLimits = getCloudflareOptimizedLimits();
  const actualLimit = limit || optimizedLimits.SOLUTION_LIMIT;
  const startTime = Date.now();
  console.log(`🚀 [getBrandSolutionCombinations] Starting query with limit: ${actualLimit}`);

  try {
    // 简化查询 - 减少条件复杂度，提高查询效率
    const query = groq`
      *[_type == "solution" && isPublished == true && defined(slug.current) && defined(primaryBrand->slug.current)] | order(_updatedAt desc) [0...${actualLimit}] {
        "solutionSlug": slug.current,
        "brandSlug": primaryBrand->slug.current
      }
    `;

    const combinations = await withRetry(() => client.fetch(query), 3, 1000, 15000); // 15秒超时
    const validCombinations = combinations?.filter(c => c.brandSlug && c.solutionSlug) || [];

    const duration = Date.now() - startTime;
    console.log(`✅ [getBrandSolutionCombinations] Query completed in ${duration}ms, returned ${validCombinations.length} combinations`);

    return validCombinations;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [getBrandSolutionCombinations] Error fetching brand-solution combinations after ${duration}ms:`, error);
    console.warn('⚠️ [getBrandSolutionCombinations] Returning empty array - no hardcoded fallbacks');
    return [];
  }
}

export async function getArticleSlugsOnly(limit = 15): Promise<string[]> {
  const startTime = Date.now();
  console.log(`🚀 [getArticleSlugsOnly] Starting query with limit: ${limit}`);

  try {
    // 简化查询 - 仅查询必要条件
    const query = groq`
      *[_type == "article" && isPublished == true && defined(slug.current)] | order(_updatedAt desc) [0...${limit}] {
        "slug": slug.current
      }
    `;

    const articles = await withRetry(() => client.fetch(query), 3, 1000, 15000); // 15秒超时
    const slugs = articles?.map(article => article.slug).filter(Boolean) || [];

    const duration = Date.now() - startTime;
    console.log(`✅ [getArticleSlugsOnly] Query completed in ${duration}ms, returned ${slugs.length} slugs`);

    return slugs;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [getArticleSlugsOnly] Error fetching article slugs after ${duration}ms:`, error);
    console.warn('⚠️ [getArticleSlugsOnly] Returning empty array - no hardcoded fallbacks');
    return [];
  }
}

// 产品查询
export async function getProducts(params: {
  limit?: number
  offset?: number
  category?: string
  brand?: string
  featured?: boolean
  preview?: boolean
} = {}) {
  const {
    limit = 12,
    offset = 0,
    category,
    brand,
    featured,
    preview = false
  } = params;

  let filter = '_type == "product" && isActive == true && !(_id in path("drafts.**"))';

  if (category) {
    filter += ` && category->slug.current == "${category}"`;
  }

  if (brand) {
    filter += ` && brand->slug.current == "${brand}"`;
  }

  if (featured) {
    filter += ' && isFeatured == true';
  }

  const query = groq`
    {
      "products": *[${filter}] | order(_createdAt desc) [${offset}...${offset + limit}] {
        ${GROQ_FRAGMENTS.productBase}
      },
      "total": count(*[${filter}])
    }
  `;

  try {
    console.log('Fetching products with query:', query);
    console.log('Query parameters:', { limit, offset, category, brand, featured });
    const result = await withRetry(() => client.fetch(query), 3, 1000, 15000); // 15秒超时
    console.log('Products fetch result:', {
      totalProducts: result.total,
      fetchedProducts: result.products?.length || 0,
      firstProduct: result.products?.[0] || null
    });
    return result;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new SanityError('Failed to fetch products', 'FETCH_PRODUCTS_ERROR');
  }
}

// 获取单个产品
export async function getProduct(slug: string, preview = false) {
  const query = groq`
    *[_type == "product" && slug.current == $slug && isActive == true && !(_id in path("drafts.**"))][0] {
      ${GROQ_FRAGMENTS.productDetail}
    }
  `;

  try {
    const product = await withRetry(() => client.fetch(query, { slug }), 3, 1000, 15000); // 15秒超时
    return product || null;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
}

// 获取品牌特定的产品（确保品牌-产品关联正确）
export async function getBrandProduct(brandSlug: string, productSlug: string, preview = false) {
  const query = groq`
    *[_type == "product" &&
      slug.current == $productSlug &&
      brand->slug.current == $brandSlug &&
      isActive == true &&
      !(_id in path("drafts.**"))][0] {
      ${GROQ_FRAGMENTS.productDetail}
    }
  `;

  try {
    console.log(`🔍 [getBrandProduct] Searching for product ${productSlug} in brand ${brandSlug}`);
    const product = await withRetry(() => client.fetch(query, { brandSlug, productSlug }), 3, 1000, 15000); // 15秒超时

    if (product) {
      console.log(`✅ [getBrandProduct] Found product: ${product.title} for brand ${brandSlug}`);
    } else {
      console.log(`❌ [getBrandProduct] Product ${productSlug} not found for brand ${brandSlug}`);
    }

    return product || null;
  } catch (error) {
    console.error(`Error fetching brand product ${brandSlug}/${productSlug}:`, error);
    return null;
  }
}

// 获取产品分类
export async function getProductCategories(parentId?: string) {
  let filter = '_type == "productCategory" && isVisible == true';

  if (parentId) {
    filter += ` && parent._ref == "${parentId}"`;
  } else {
    filter += ' && !defined(parent)';
  }

  const query = groq`
    *[${filter}] | order(sortOrder asc, name asc) {
      ${GROQ_FRAGMENTS.category}
    }
  `;

  try {
    return await withRetry(() => client.fetch(query), 3, 1000, 15000); // 15秒超时
  } catch (error) {
    throw new SanityError('Failed to fetch categories', 'FETCH_CATEGORIES_ERROR');
  }
}

// 获取品牌列表
export async function getBrands(featured = false) {
  let filter = '_type == "brandBasic" && isActive == true && !(_id in path("drafts.**"))';

  if (featured) {
    filter += ' && isFeatured == true';
  }

  const query = groq`
    *[${filter}] | order(name asc) {
      ${GROQ_FRAGMENTS.brand}
    }
  `;

  try {
    console.log('🔍 执行品牌查询:', {
      查询条件: filter,
      GROQ查询: query,
      是否仅获取推荐: featured
    });

    const result = await withRetry(() => client.fetch(query), 3, 1000, 15000); // 15秒超时

    console.log('📊 品牌查询结果:', {
      数量: result?.length || 0,
      品牌列表: result?.map(b => ({
        id: b._id,
        名称: b.name,
        slug: b.slug,
        是否激活: b.isActive,
        是否推荐: b.isFeatured
      })) || []
    });

    return result;
  } catch (error) {
    console.error('❌ 品牌查询失败:', error);
    throw new SanityError(`Failed to fetch brands: ${error.message}`, 'FETCH_BRANDS_ERROR');
  }
}

// 搜索产品
export async function searchProducts(searchTerm: string, limit = 10) {
  const query = groq`
    *[
      _type == "product" && 
      isActive == true && 
      (
        title match $searchTerm + "*" ||
        partNumber match $searchTerm + "*" ||
        shortDescription match $searchTerm + "*"
      )
    ] | order(title asc) [0...${limit}] {
      ${GROQ_FRAGMENTS.productBase}
    }
  `;

  try {
    return await withRetry(() => client.fetch(query, { searchTerm }), 3, 1000, 15000); // 15秒超时
  } catch (error) {
    throw new SanityError('Failed to search products', 'SEARCH_PRODUCTS_ERROR');
  }
}

// 获取相关产品
export async function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  const query = groq`
    *[
      _type == "product" && 
      _id != $productId &&
      category._ref == $categoryId &&
      isActive == true
    ] | order(_createdAt desc) [0...${limit}] {
      ${GROQ_FRAGMENTS.productBase}
    }
  `;

  try {
    return await withRetry(() => client.fetch(query, { productId, categoryId }), 3, 1000, 15000); // 15秒超时
  } catch (error) {
    throw new SanityError('Failed to fetch related products', 'FETCH_RELATED_PRODUCTS_ERROR');
  }
}

// 获取文章列表
export async function getArticles(params: {
  limit?: number
  offset?: number
  category?: string
  brand?: string
  featured?: boolean
} = {}) {
  const {
    limit = 10,
    offset = 0,
    category,
    brand,
    featured
  } = params;

  let filter = '_type == "article" && isPublished == true';

  if (category) {
    filter += ` && category->slug.current == "${category}"`;
  }

  if (brand) {
    filter += ` && "${brand}" in relatedBrands[]->slug.current`;
  }

  if (featured) {
    filter += ' && isFeatured == true';
  }

  const query = groq`
    {
      "articles": *[${filter}] | order(publishedAt desc) [${offset}...${offset + limit}] {
        ${GROQ_FRAGMENTS.article}
      },
      "total": count(*[${filter}])
    }
  `;

  try {
    return await withRetry(() => client.fetch(query), 3, 1000, 15000); // 15秒超时
  } catch (error) {
    throw new SanityError('Failed to fetch articles', 'FETCH_ARTICLES_ERROR');
  }
}

// 获取单篇文章
export async function getArticle(slug: string) {
  const query = groq`
    *[_type == "article" && slug.current == $slug && isPublished == true][0] {
      ${GROQ_FRAGMENTS.article}
    }
  `;

  try {
    const article = await withRetry(() => client.fetch(query, { slug }), 3, 1000, 15000); // 15秒超时
    return article || null;
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    return null;
  }
}

// 获取解决方案列表
export async function getSolutions(params: {
  limit?: number
  offset?: number
  targetMarket?: string
  brand?: string
  featured?: boolean
  preview?: boolean
} = {}) {
  const {
    limit = 10,
    offset = 0,
    targetMarket,
    brand,
    featured,
    preview = false
  } = params;

  let filter = '_type == "solution" && (isPublished == true || !defined(isPublished))';

  if (targetMarket) {
    filter += ` && targetMarket == "${targetMarket}"`;
  }

  if (brand) {
    filter += ` && ("${brand}" in relatedBrands[]->slug.current || primaryBrand->slug.current == "${brand}")`;
  }

  if (featured) {
    filter += ' && isFeatured == true';
  }

  const query = groq`
    {
      "solutions": *[${filter}] | order(publishedAt desc) [${offset}...${offset + limit}] {
        ${GROQ_FRAGMENTS.solution}
      },
      "total": count(*[${filter}])
    }
  `;

  try {
    console.log('Fetching solutions with query:', query);
    console.log('Query parameters:', { limit, offset, targetMarket, brand, featured });
    const result = await withRetry(() => client.fetch(query), 3, 1000, 15000); // 15秒超时
    console.log('Solutions fetch result:', {
      totalSolutions: result.total,
      fetchedSolutions: result.solutions?.length || 0,
      firstSolution: result.solutions?.[0] || null
    });
    return result;
  } catch (error) {
    console.error('Error fetching solutions:', error);
    throw new SanityError('Failed to fetch solutions', 'FETCH_SOLUTIONS_ERROR');
  }
}

// 获取单个解决方案
export async function getSolution(slug: string, preview = false) {
  const query = groq`
    *[_type == "solution" && slug.current == $slug && (isPublished == true || !defined(isPublished))][0] {
      ${GROQ_FRAGMENTS.solution}
    }
  `;

  try {
    const solution = await withRetry(() => client.fetch(query, { slug }), 3, 1000, 15000); // 15秒超时
    return solution || null;
  } catch (error) {
    console.error(`Error fetching solution with slug ${slug}:`, error);
    return null;
  }
}

// 搜索解决方案
export async function searchSolutions(searchTerm: string, limit = 10) {
  const query = groq`
    *[
      _type == "solution" &&
      (isPublished == true || !defined(isPublished)) &&
      (
        title match $searchTerm + "*" ||
        summary match $searchTerm + "*"
      )
    ] | order(title asc) [0...${limit}] {
      ${GROQ_FRAGMENTS.solution}
    }
  `;

  try {
    return await withRetry(() => client.fetch(query, { searchTerm }), 3, 1000, 15000); // 15秒超时
  } catch (error) {
    throw new SanityError('Failed to search solutions', 'SEARCH_SOLUTIONS_ERROR');
  }
}

// 获取相关解决方案
export async function getRelatedSolutions(solutionId: string, targetMarket: string, limit = 4) {
  const query = groq`
    *[
      _type == "solution" && 
      _id != $solutionId &&
      targetMarket == $targetMarket &&
      isPublished == true
    ] | order(publishedAt desc) [0...${limit}] {
      ${GROQ_FRAGMENTS.solution}
    }
  `;

  try {
    return await withRetry(() => client.fetch(query, { solutionId, targetMarket }), 3, 1000, 15000); // 15秒超时
  } catch (error) {
    throw new SanityError('Failed to fetch related solutions', 'FETCH_RELATED_SOLUTIONS_ERROR');
  }
}

// 获取网站统计数据
export async function getSiteStats() {
  const query = groq`
    {
      "totalProducts": count(*[_type == "product" && isActive == true]),
      "totalBrands": count(*[_type == "brandBasic" && isActive == true]),
      "totalCategories": count(*[_type == "productCategory" && isVisible == true]),
      "featuredProducts": count(*[_type == "product" && isActive == true && isFeatured == true]),
      "totalSolutions": count(*[_type == "solution" && isPublished == true])
    }
  `;

  try {
    return await withRetry(() => client.fetch(query), 3, 1000, 15000); // 15秒超时
  } catch (error) {
    throw new SanityError('Failed to fetch site stats', 'FETCH_STATS_ERROR');
  }
}
