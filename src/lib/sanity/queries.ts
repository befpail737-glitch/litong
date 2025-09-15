import { groq } from 'next-sanity';

import { client, GROQ_FRAGMENTS, withRetry, SanityError } from './client';

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
    if (!product) {
      throw new SanityError('Product not found', 'PRODUCT_NOT_FOUND');
    }
    return product;
  } catch (error) {
    if (error instanceof SanityError) throw error;
    throw new SanityError('Failed to fetch product', 'FETCH_PRODUCT_ERROR');
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
    return await withRetry(() => client.fetch(query));
  } catch (error) {
    throw new SanityError('Failed to fetch brands', 'FETCH_BRANDS_ERROR');
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
    if (!article) {
      throw new SanityError('Article not found', 'ARTICLE_NOT_FOUND');
    }
    return article;
  } catch (error) {
    if (error instanceof SanityError) throw error;
    throw new SanityError('Failed to fetch article', 'FETCH_ARTICLE_ERROR');
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
    *[_type == "solution" && slug.current == $slug && isPublished == true][0] {
      ${GROQ_FRAGMENTS.solution}
    }
  `;

  try {
    const solution = await withRetry(() => client.fetch(query, { slug }));
    if (!solution) {
      throw new SanityError('Solution not found', 'SOLUTION_NOT_FOUND');
    }
    return solution;
  } catch (error) {
    if (error instanceof SanityError) throw error;
    throw new SanityError('Failed to fetch solution', 'FETCH_SOLUTION_ERROR');
  }
}

// 搜索解决方案
export async function searchSolutions(searchTerm: string, limit = 10) {
  const query = groq`
    *[
      _type == "solution" && 
      isPublished == true && 
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
