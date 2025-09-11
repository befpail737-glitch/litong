import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { cacheResponse } from '@/lib/cache';
import { logAPIRequest } from '@/lib/logging';
import { rateLimit } from '@/lib/rate-limit';

// Validation Schema
const SearchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  type: z.enum(['all', 'products', 'applications', 'news', 'solutions', 'caseStudies']).optional().default('all'),
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => Math.min(parseInt(val || '20'), 100)),
  category: z.string().optional(),
  manufacturer: z.string().optional(),
  minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  sortBy: z.enum(['relevance', 'name', 'price', 'date', 'popularity']).optional().default('relevance'),
  filters: z.string().optional().transform(val => val ? JSON.parse(val) : {})
});

// Search functions
async function searchProducts(query: string, filters: any = {}, pagination: any = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;

  // Simulate Elasticsearch/search engine query
  let products = Array.from({ length: 50 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `STM32 ${query} Product ${i + 1}`,
    description: `High-performance microcontroller matching "${query}" with advanced features`,
    manufacturer: ['STMicroelectronics', 'Texas Instruments', 'Analog Devices'][i % 3],
    category: ['Microcontrollers', 'Processors', 'Sensors'][i % 3],
    model: `STM32H${743 + i}`,
    price: 15.50 + (i * 2.5),
    currency: 'USD',
    image: `https://cdn.example.com/products/${i + 1}/thumb_main.jpg`,
    rating: 4.0 + Math.random() * 1.0,
    reviewCount: Math.floor(Math.random() * 100),
    availability: Math.random() > 0.2 ? 'In Stock' : 'Out of Stock',
    tags: ['STM32', 'ARM', 'Microcontroller', query],
    relevanceScore: Math.random() * 100,
    highlights: {
      name: [`STM32 <mark>${query}</mark> Product ${i + 1}`],
      description: [`High-performance microcontroller matching "<mark>${query}</mark>" with advanced features`]
    }
  }));

  // Apply filters
  if (filters.category) {
    products = products.filter(p => p.category === filters.category);
  }

  if (filters.manufacturer) {
    products = products.filter(p => p.manufacturer === filters.manufacturer);
  }

  if (filters.minPrice !== undefined) {
    products = products.filter(p => p.price >= filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    products = products.filter(p => p.price <= filters.maxPrice);
  }

  // Apply sorting
  if (filters.sortBy === 'relevance') {
    products.sort((a, b) => b.relevanceScore - a.relevanceScore);
  } else if (filters.sortBy === 'price') {
    products.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'name') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.sortBy === 'popularity') {
    products.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  const totalCount = products.length;
  const paginatedProducts = products.slice(offset, offset + limit);

  // Generate facets/filters
  const facets = {
    categories: [
      { value: 'microcontrollers', count: 25, label: 'Microcontrollers' },
      { value: 'processors', count: 15, label: 'Processors' },
      { value: 'sensors', count: 10, label: 'Sensors' }
    ].filter(f => f.count > 0),
    manufacturers: [
      { value: 'stmicroelectronics', count: 20, label: 'STMicroelectronics' },
      { value: 'texas-instruments', count: 15, label: 'Texas Instruments' },
      { value: 'analog-devices', count: 15, label: 'Analog Devices' }
    ].filter(f => f.count > 0),
    priceRanges: [
      { value: '0-25', count: 20, label: '$0 - $25' },
      { value: '25-50', count: 15, label: '$25 - $50' },
      { value: '50-100', count: 10, label: '$50 - $100' },
      { value: '100+', count: 5, label: '$100+' }
    ].filter(f => f.count > 0),
    availability: [
      { value: 'in-stock', count: 40, label: 'In Stock' },
      { value: 'out-of-stock', count: 10, label: 'Out of Stock' }
    ],
    ratings: [
      { value: '4+', count: 35, label: '4+ Stars' },
      { value: '3+', count: 45, label: '3+ Stars' },
      { value: '2+', count: 48, label: '2+ Stars' }
    ]
  };

  return {
    items: paginatedProducts,
    total: totalCount,
    facets,
    suggestions: query.length > 2 ? [
      `${query} datasheet`,
      `${query} development board`,
      `${query} evaluation kit`,
      `${query} application note`,
      `${query} reference design`
    ] : []
  };
}

async function searchApplications(query: string, filters: any = {}, pagination: any = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;

  const applications = Array.from({ length: 20 }, (_, i) => ({
    id: `app_${i + 1}`,
    title: `${query} Application ${i + 1}`,
    description: `Industrial application using ${query} technology for enhanced performance`,
    industry: ['Industrial Automation', 'Automotive', 'Medical', 'Consumer Electronics'][i % 4],
    useCase: ['Motor Control', 'Data Acquisition', 'Communication', 'Signal Processing'][i % 4],
    image: `https://cdn.example.com/applications/app_${i + 1}.jpg`,
    products: [`product_${i + 1}`, `product_${i + 2}`],
    relevanceScore: Math.random() * 100,
    highlights: {
      title: [`<mark>${query}</mark> Application ${i + 1}`],
      description: [`Industrial application using <mark>${query}</mark> technology`]
    }
  }));

  const totalCount = applications.length;
  const paginatedApps = applications.slice(offset, offset + limit);

  return {
    items: paginatedApps,
    total: totalCount
  };
}

async function searchNews(query: string, filters: any = {}, pagination: any = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;

  const news = Array.from({ length: 15 }, (_, i) => ({
    id: `news_${i + 1}`,
    title: `Latest ${query} Technology News ${i + 1}`,
    excerpt: `Breaking news about ${query} technology developments and market trends`,
    category: ['Technology', 'Industry', 'Product Launch', 'Market Analysis'][i % 4],
    author: `Author ${i + 1}`,
    publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    image: `https://cdn.example.com/news/news_${i + 1}.jpg`,
    tags: [query, 'Technology', 'Industry', 'Innovation'],
    views: Math.floor(Math.random() * 1000),
    relevanceScore: Math.random() * 100,
    highlights: {
      title: [`Latest <mark>${query}</mark> Technology News ${i + 1}`],
      excerpt: [`Breaking news about <mark>${query}</mark> technology developments`]
    }
  }));

  const totalCount = news.length;
  const paginatedNews = news.slice(offset, offset + limit);

  return {
    items: paginatedNews,
    total: totalCount
  };
}

async function searchSolutions(query: string, filters: any = {}, pagination: any = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;

  const solutions = Array.from({ length: 12 }, (_, i) => ({
    id: `solution_${i + 1}`,
    title: `${query} Solution ${i + 1}`,
    description: `Complete solution featuring ${query} technology for industrial applications`,
    industry: ['Industrial', 'Automotive', 'Medical', 'IoT'][i % 4],
    complexity: ['Simple', 'Moderate', 'Complex', 'Advanced'][i % 4],
    estimatedCost: 1000 + (i * 500),
    developmentTime: 4 + (i * 2),
    image: `https://cdn.example.com/solutions/solution_${i + 1}.jpg`,
    products: [`product_${i + 1}`, `product_${i + 2}`, `product_${i + 3}`],
    relevanceScore: Math.random() * 100,
    highlights: {
      title: [`<mark>${query}</mark> Solution ${i + 1}`],
      description: [`Complete solution featuring <mark>${query}</mark> technology`]
    }
  }));

  const totalCount = solutions.length;
  const paginatedSolutions = solutions.slice(offset, offset + limit);

  return {
    items: paginatedSolutions,
    total: totalCount
  };
}

async function searchCaseStudies(query: string, filters: any = {}, pagination: any = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;

  const caseStudies = Array.from({ length: 10 }, (_, i) => ({
    id: `case_${i + 1}`,
    title: `${query} Implementation Success Story ${i + 1}`,
    description: `How Company ${i + 1} successfully implemented ${query} technology`,
    customer: `TechCorp ${i + 1}`,
    industry: ['Manufacturing', 'Automotive', 'Healthcare', 'Aerospace'][i % 4],
    challenge: `Needed efficient ${query} integration`,
    solution: `Implemented ${query} based system`,
    results: `${50 + i * 10}% performance improvement`,
    image: `https://cdn.example.com/case-studies/case_${i + 1}.jpg`,
    products: [`product_${i + 1}`],
    relevanceScore: Math.random() * 100,
    highlights: {
      title: [`<mark>${query}</mark> Implementation Success Story ${i + 1}`],
      description: [`How Company ${i + 1} successfully implemented <mark>${query}</mark> technology`]
    }
  }));

  const totalCount = caseStudies.length;
  const paginatedCaseStudies = caseStudies.slice(offset, offset + limit);

  return {
    items: paginatedCaseStudies,
    total: totalCount
  };
}

async function getSearchSuggestions(query: string, limit: number = 10) {
  // Simulate autocomplete/suggestion engine
  const suggestions = [
    `${query}`,
    `${query} datasheet`,
    `${query} development board`,
    `${query} evaluation kit`,
    `${query} application note`,
    `${query} reference design`,
    `${query} software`,
    `${query} driver`,
    `${query} schematic`,
    `${query} tutorial`,
    `${query} programming guide`,
    `${query} getting started`,
    `${query} comparison`,
    `${query} alternatives`,
    `${query} pinout`,
    `${query} specifications`,
    `${query} documentation`,
    `${query} examples`,
    `${query} libraries`,
    `${query} tools`
  ].filter(s => s.toLowerCase().includes(query.toLowerCase()))
   .slice(0, limit);

  return suggestions;
}

// API Route Handler
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, { limit: 100, window: 60000 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validation = SearchQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid search parameters',
          details: validation.error.errors
        },
        { status: 400 }
      );
    }

    const { q: query, type, page, limit, sortBy, ...filters } = validation.data;

    // Check cache
    const cacheKey = `search:${JSON.stringify({ query, type, page, limit, sortBy, ...filters })}`;
    const cachedResult = await cacheResponse(cacheKey);
    if (cachedResult) {
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        processingTime: Date.now() - startTime
      });
    }

    // Perform searches based on type
    const searchResults: any = {
      query,
      type,
      totalResults: 0,
      processingTime: 0,
      suggestions: await getSearchSuggestions(query, 10)
    };

    if (type === 'all' || type === 'products') {
      const productResults = await searchProducts(query, { ...filters, sortBy }, { page, limit });
      searchResults.products = productResults;
      if (type === 'products') {
        searchResults.totalResults = productResults.total;
      }
    }

    if (type === 'all' || type === 'applications') {
      const appResults = await searchApplications(query, filters, { page, limit });
      searchResults.applications = appResults;
      if (type === 'applications') {
        searchResults.totalResults = appResults.total;
      }
    }

    if (type === 'all' || type === 'news') {
      const newsResults = await searchNews(query, filters, { page, limit });
      searchResults.news = newsResults;
      if (type === 'news') {
        searchResults.totalResults = newsResults.total;
      }
    }

    if (type === 'all' || type === 'solutions') {
      const solutionResults = await searchSolutions(query, filters, { page, limit });
      searchResults.solutions = solutionResults;
      if (type === 'solutions') {
        searchResults.totalResults = solutionResults.total;
      }
    }

    if (type === 'all' || type === 'caseStudies') {
      const caseResults = await searchCaseStudies(query, filters, { page, limit });
      searchResults.caseStudies = caseResults;
      if (type === 'caseStudies') {
        searchResults.totalResults = caseResults.total;
      }
    }

    // Calculate total results for 'all' type
    if (type === 'all') {
      searchResults.totalResults =
        (searchResults.products?.total || 0) +
        (searchResults.applications?.total || 0) +
        (searchResults.news?.total || 0) +
        (searchResults.solutions?.total || 0) +
        (searchResults.caseStudies?.total || 0);
    }

    // Add search analytics
    const searchAnalytics = {
      searchId: `search_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      query,
      type,
      totalResults: searchResults.totalResults,
      hasResults: searchResults.totalResults > 0,
      filters: Object.keys(filters).length > 0 ? filters : null,
      userAgent: request.headers.get('user-agent') || '',
      ip: request.ip || ''
    };

    const response = {
      success: true,
      data: searchResults,
      analytics: searchAnalytics,
      pagination: {
        page,
        limit,
        totalResults: searchResults.totalResults,
        totalPages: Math.ceil(searchResults.totalResults / limit),
        hasNext: page * limit < searchResults.totalResults,
        hasPrev: page > 1
      },
      cached: false,
      processingTime: Date.now() - startTime
    };

    // Log search request
    await logAPIRequest({
      method: 'GET',
      endpoint: '/api/search',
      params: { query, type, ...filters },
      responseTime: Date.now() - startTime,
      status: 200,
      metadata: {
        searchId: searchAnalytics.searchId,
        totalResults: searchResults.totalResults,
        hasResults: searchResults.totalResults > 0
      },
      userAgent: request.headers.get('user-agent') || '',
      ip: request.ip || ''
    });

    // Cache response for 5 minutes
    await cacheResponse(cacheKey, response.data, 300);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Search API Error:', error);

    await logAPIRequest({
      method: 'GET',
      endpoint: '/api/search',
      params: Object.fromEntries(new URL(request.url).searchParams.entries()),
      responseTime: Date.now() - startTime,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error',
      userAgent: request.headers.get('user-agent') || '',
      ip: request.ip || ''
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An error occurred while performing the search'
      },
      { status: 500 }
    );
  }
}
