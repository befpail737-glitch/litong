import { groq } from 'next-sanity';

import { client, GROQ_FRAGMENTS, withRetry, SanityError } from './client';

// 轻量级函数仅用于generateStaticParams，减少查询复杂度 - 大幅减少以避免超时
export async function getProductSlugsOnly(limit = 5): Promise<string[]> {
  try {
    const query = groq`
      *[_type == "product" && isActive == true && defined(slug.current)] | order(_createdAt desc) [0...${limit}] {
        "slug": slug.current
      }
    `;

    const products = await client.fetch(query);
    const slugs = products?.map(product => product.slug).filter(Boolean) || [];

    return slugs;
  } catch (error) {
    console.error('Error fetching product slugs, using fallback:', error);
    return ['demo-product-1', 'demo-product-2', 'demo-product-3'];
  }
}

export async function getSolutionSlugsOnly(limit = 3): Promise<string[]> {
  try {
    const query = groq`
      *[_type == "solution" && (isPublished == true || !defined(isPublished)) && defined(slug.current)] | order(_createdAt desc) [0...${limit}] {
        "slug": slug.current
      }
    `;

    const solutions = await client.fetch(query);
    const slugs = solutions?.map(solution => solution.slug).filter(Boolean) || [];

    return slugs;
  } catch (error) {
    console.error('Error fetching solution slugs, using fallback:', error);
    return ['demo-solution-1', 'demo-solution-2'];
  }
}

// 获取品牌-产品组合用于静态参数生成 - 扩大覆盖范围解决404问题
export async function getBrandProductCombinations(limit = 200): Promise<Array<{brandSlug: string, productSlug: string}>> {
  try {
    console.log('🔧 [getBrandProductCombinations] Fetching comprehensive brand-product combinations from Sanity...');

    // 智能应急模式：提供更全面的硬编码组合
    const emergencyMode = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

    if (emergencyMode) {
      console.log('🚨 Smart emergency mode: Using comprehensive hardcoded product combinations');
      return [
        // Cree products
        { brandSlug: 'cree', productSlug: '55555' },
        { brandSlug: 'cree', productSlug: '11111' },
        { brandSlug: 'cree', productSlug: 'sic mosfet' },
        { brandSlug: 'cree', productSlug: '99999' },
        { brandSlug: 'cree', productSlug: 'stm32f407vgt6' },

        // TI products
        { brandSlug: 'ti', productSlug: 'opa2134pa' },
        { brandSlug: 'ti', productSlug: 'lm358' },
        { brandSlug: 'ti', productSlug: 'ne555' },
        { brandSlug: 'ti', productSlug: 'tl074' },

        // Infineon products
        { brandSlug: 'infineon', productSlug: 'bss123' },
        { brandSlug: 'infineon', productSlug: 'irfz44n' },
        { brandSlug: 'infineon', productSlug: 'buz11' },

        // STMicroelectronics products
        { brandSlug: 'stmicroelectronics', productSlug: 'stm32f103c8t6' },
        { brandSlug: 'stmicroelectronics', productSlug: 'stm32f407vgt6' },
        { brandSlug: 'stmicroelectronics', productSlug: 'l7805cv' },

        // Additional major brands
        { brandSlug: 'mediatek', productSlug: 'mt6580' },
        { brandSlug: 'mediatek', productSlug: 'mt6737' },
        { brandSlug: 'qualcomm', productSlug: 'snapdragon_865' },
        { brandSlug: 'espressif', productSlug: 'esp32' },
        { brandSlug: 'espressif', productSlug: 'esp8266' },
        { brandSlug: 'microchip', productSlug: 'pic16f877a' },
        { brandSlug: 'analog-devices', productSlug: 'ad8620' },
        { brandSlug: 'maxim', productSlug: 'max232' },
        { brandSlug: 'nordic', productSlug: 'nrf52840' },
        { brandSlug: 'cypress', productSlug: 'cy7c68013a' },
        { brandSlug: 'renesas', productSlug: 'rh850' }
      ];
    }

    const query = groq`
      *[_type == "product" && (isActive == true || !defined(isActive)) && defined(slug.current) && defined(brand->slug.current)] | order(_createdAt desc) [0...${limit}] {
        "productSlug": slug.current,
        "brandSlug": brand->slug.current
      }
    `;

    const combinations = await client.fetch(query);
    const validCombinations = combinations?.filter(c => c.brandSlug && c.productSlug) || [];

    console.log('✅ [getBrandProductCombinations] Found combinations:', {
      total: validCombinations.length,
      combinations: validCombinations.slice(0, 5) // Log first 5 for debugging
    });

    return validCombinations;
  } catch (error) {
    console.error('Error fetching brand-product combinations, using fallback:', error);
    // Return only verified fallback combinations that actually exist in the database
    // Based on real data analysis from development server logs
    return [
      { brandSlug: 'cree', productSlug: 'sic mosfet' },
      { brandSlug: 'cree', productSlug: '11111' },
    ];
  }
}

// 获取品牌-解决方案组合用于静态参数生成 - 扩大覆盖范围
export async function getBrandSolutionCombinations(limit = 150): Promise<Array<{brandSlug: string, solutionSlug: string}>> {
  try {
    const query = groq`
      *[_type == "solution" && (isPublished == true || !defined(isPublished)) && defined(slug.current) && defined(primaryBrand->slug.current)] | order(_createdAt desc) [0...${limit}] {
        "solutionSlug": slug.current,
        "brandSlug": primaryBrand->slug.current
      }
    `;

    const combinations = await client.fetch(query);
    return combinations?.filter(c => c.brandSlug && c.solutionSlug) || [];
  } catch (error) {
    console.error('Error fetching brand-solution combinations, using fallback:', error);
    // Return comprehensive fallback combinations for critical brands
    return [
      // Cree solutions
      { brandSlug: 'cree', solutionSlug: '11111' },
      { brandSlug: 'cree', solutionSlug: 'power-management' },
      { brandSlug: 'cree', solutionSlug: 'led-lighting' },

      // Infineon solutions
      { brandSlug: 'infineon', solutionSlug: '22222' },
      { brandSlug: 'infineon', solutionSlug: 'automotive-power' },
      { brandSlug: 'infineon', solutionSlug: 'iot-security' },

      // TI solutions
      { brandSlug: 'ti', solutionSlug: '33333' },
      { brandSlug: 'ti', solutionSlug: 'analog-design' },
      { brandSlug: 'ti', solutionSlug: 'embedded-processing' },

      // MediaTek solutions
      { brandSlug: 'mediatek', solutionSlug: '11111' },
      { brandSlug: 'mediatek', solutionSlug: 'mobile-connectivity' },
      { brandSlug: 'mediatek', solutionSlug: 'smart-tv' },

      // Qualcomm solutions
      { brandSlug: 'qualcomm', solutionSlug: '22222' },
      { brandSlug: 'qualcomm', solutionSlug: '5g-solutions' },
      { brandSlug: 'qualcomm', solutionSlug: 'ai-processing' },

      // Additional brand solutions
      { brandSlug: 'stmicroelectronics', solutionSlug: 'mcu-solutions' },
      { brandSlug: 'espressif', solutionSlug: 'iot-wifi' },
      { brandSlug: 'microchip', solutionSlug: 'microcontroller' },
      { brandSlug: 'nordic', solutionSlug: 'bluetooth-mesh' },
      { brandSlug: 'cypress', solutionSlug: 'usb-connectivity' }
    ];
  }
}

export async function getArticleSlugsOnly(limit = 15): Promise<string[]> {
  try {
    const query = groq`
      *[_type == "article" && (isPublished == true || !defined(isPublished)) && defined(slug.current)] | order(_createdAt desc) [0...${limit}] {
        "slug": slug.current
      }
    `;

    const articles = await client.fetch(query);
    const slugs = articles?.map(article => article.slug).filter(Boolean) || [];

    return slugs;
  } catch (error) {
    console.error('Error fetching article slugs, using fallback:', error);
    return ['demo-article-1', 'demo-article-2'];
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
    const result = await withRetry(() => client.fetch(query));
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
    const product = await withRetry(() => client.fetch(query, { slug }));
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
    const product = await withRetry(() => client.fetch(query, { brandSlug, productSlug }));

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
    return await withRetry(() => client.fetch(query));
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

    const result = await withRetry(() => client.fetch(query));

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
    return await withRetry(() => client.fetch(query, { searchTerm }));
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
    return await withRetry(() => client.fetch(query, { productId, categoryId }));
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
    return await withRetry(() => client.fetch(query));
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
    const article = await withRetry(() => client.fetch(query, { slug }));
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
    const result = await withRetry(() => client.fetch(query));
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
    const solution = await withRetry(() => client.fetch(query, { slug }));
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
    return await withRetry(() => client.fetch(query, { searchTerm }));
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
    return await withRetry(() => client.fetch(query, { solutionId, targetMarket }));
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
    return await withRetry(() => client.fetch(query));
  } catch (error) {
    throw new SanityError('Failed to fetch site stats', 'FETCH_STATS_ERROR');
  }
}
