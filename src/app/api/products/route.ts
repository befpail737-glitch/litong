import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authenticateRequest } from '@/lib/auth';
import { cacheResponse } from '@/lib/cache';
import { logAPIRequest } from '@/lib/logging';
import { rateLimit } from '@/lib/rate-limit';
import { validateRequest } from '@/lib/validation';

// Validation Schemas
const ProductQuerySchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => Math.min(parseInt(val || '20'), 100)),
  category: z.string().optional(),
  manufacturer: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  inStock: z.string().optional().transform(val => val === 'true'),
  sortBy: z.enum(['name', 'price', 'createdAt', 'popularity', 'rating']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  tags: z.string().optional().transform(val => val ? val.split(',') : undefined)
});

const ProductCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  manufacturer: z.string().min(1).max(100),
  category: z.string().min(1).max(100),
  model: z.string().optional().max(100),
  price: z.number().positive().optional(),
  currency: z.string().length(3).optional().default('USD'),
  specifications: z.record(z.any()).optional(),
  images: z.array(z.string().url()).optional().default([]),
  documents: z.array(z.string().url()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED', 'COMING_SOON']).optional().default('ACTIVE')
});

const ProductUpdateSchema = ProductCreateSchema.partial();

// Mock Database Functions
async function getProducts(filters: any = {}, pagination: any = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;

  // Simulate database query
  let products = Array.from({ length: 150 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `STM32 Product ${i + 1}`,
    description: `High-performance microcontroller ${i + 1} with advanced features`,
    manufacturer: ['STMicroelectronics', 'Texas Instruments', 'Analog Devices'][i % 3],
    category: ['Microcontrollers', 'Processors', 'Sensors'][i % 3],
    model: `STM32H${743 + i}`,
    price: 15.50 + (i * 2.5),
    currency: 'USD',
    specifications: {
      core: 'ARM Cortex-M7',
      frequency: `${480 + i * 10}MHz`,
      flash: `${2 + Math.floor(i / 10)}MB`,
      ram: `${1 + Math.floor(i / 20)}MB`,
      packages: ['LQFP144', 'BGA176', 'LQFP100'],
      temperature: '-40°C to +85°C',
      voltage: '1.62V to 3.6V'
    },
    images: [
      `https://cdn.example.com/products/${i + 1}/main.jpg`,
      `https://cdn.example.com/products/${i + 1}/pinout.jpg`
    ],
    documents: [
      `https://cdn.example.com/docs/${i + 1}/datasheet.pdf`,
      `https://cdn.example.com/docs/${i + 1}/reference.pdf`
    ],
    tags: ['STM32', 'ARM', 'Microcontroller', 'High Performance'],
    status: 'ACTIVE',
    inventory: {
      quantity: Math.floor(Math.random() * 1000),
      reserved: Math.floor(Math.random() * 50),
      available: Math.floor(Math.random() * 950),
      leadTime: Math.floor(Math.random() * 30)
    },
    metrics: {
      rating: 4.0 + Math.random() * 1.0,
      reviewCount: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 5000),
      purchaseCount: Math.floor(Math.random() * 200)
    },
    seo: {
      metaTitle: `${`STM32 Product ${i + 1}`} - High Performance Microcontroller`,
      metaDescription: `Discover the ${`STM32 Product ${i + 1}`} with advanced ARM Cortex-M7 core`,
      keywords: ['STM32', 'microcontroller', 'ARM', 'embedded'],
      canonical: `/products/${i + 1}`
    },
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }));

  // Apply filters
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.manufacturer.toLowerCase().includes(searchLower) ||
      p.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );
  }

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

  if (filters.inStock) {
    products = products.filter(p => p.inventory.available > 0);
  }

  if (filters.tags && filters.tags.length > 0) {
    products = products.filter(p =>
      filters.tags.some((tag: string) => p.tags.includes(tag))
    );
  }

  // Apply sorting
  if (filters.sortBy) {
    products.sort((a: any, b: any) => {
      let aVal = a[filters.sortBy];
      let bVal = b[filters.sortBy];

      if (filters.sortBy === 'rating') {
        aVal = a.metrics.rating;
        bVal = b.metrics.rating;
      } else if (filters.sortBy === 'popularity') {
        aVal = a.metrics.views;
        bVal = b.metrics.views;
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      const order = filters.sortOrder === 'desc' ? -1 : 1;
      return aVal > bVal ? order : aVal < bVal ? -order : 0;
    });
  }

  const totalCount = products.length;
  const paginatedProducts = products.slice(offset, offset + limit);

  return {
    data: paginatedProducts,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNext: page * limit < totalCount,
      hasPrev: page > 1
    },
    filters: {
      categories: [...new Set(products.map(p => p.category))],
      manufacturers: [...new Set(products.map(p => p.manufacturer))],
      priceRange: {
        min: Math.min(...products.map(p => p.price)),
        max: Math.max(...products.map(p => p.price))
      },
      tags: [...new Set(products.flatMap(p => p.tags))]
    }
  };
}

async function getProductById(id: string) {
  // Simulate database fetch
  const product = {
    id,
    name: `STM32 Product ${id}`,
    description: `High-performance microcontroller ${id} with advanced features for demanding applications`,
    manufacturer: 'STMicroelectronics',
    category: 'Microcontrollers',
    model: `STM32H${743 + parseInt(id)}`,
    price: 15.50 + parseInt(id) * 2.5,
    currency: 'USD',
    specifications: {
      core: 'ARM Cortex-M7',
      frequency: `${480 + parseInt(id) * 10}MHz`,
      flash: `${2 + Math.floor(parseInt(id) / 10)}MB`,
      ram: `${1 + Math.floor(parseInt(id) / 20)}MB`,
      packages: ['LQFP144', 'BGA176', 'LQFP100'],
      temperature: '-40°C to +85°C',
      voltage: '1.62V to 3.6V',
      peripherals: {
        gpio: 168,
        timers: 22,
        adc: '3x 16-bit',
        dac: '2x 12-bit',
        communication: ['UART', 'SPI', 'I2C', 'CAN', 'USB', 'Ethernet'],
        crypto: 'AES, HASH, RSA'
      }
    },
    images: [
      {
        id: `img_${id}_1`,
        url: `https://cdn.example.com/products/${id}/main.jpg`,
        alt: `STM32 Product ${id} Main Image`,
        title: `STM32 Product ${id}`,
        width: 800,
        height: 600,
        thumbnail: `https://cdn.example.com/products/${id}/thumb_main.jpg`
      },
      {
        id: `img_${id}_2`,
        url: `https://cdn.example.com/products/${id}/pinout.jpg`,
        alt: `STM32 Product ${id} Pinout`,
        title: 'Pinout Diagram',
        width: 1200,
        height: 800,
        thumbnail: `https://cdn.example.com/products/${id}/thumb_pinout.jpg`
      }
    ],
    documents: [
      {
        id: `doc_${id}_1`,
        name: `STM32H${743 + parseInt(id)} Datasheet`,
        url: `https://cdn.example.com/docs/${id}/datasheet.pdf`,
        type: 'DATASHEET',
        size: 2457600,
        downloadCount: Math.floor(Math.random() * 1000)
      },
      {
        id: `doc_${id}_2`,
        name: 'Reference Manual',
        url: `https://cdn.example.com/docs/${id}/reference.pdf`,
        type: 'MANUAL',
        size: 15728640,
        downloadCount: Math.floor(Math.random() * 500)
      }
    ],
    tags: ['STM32', 'ARM', 'Microcontroller', 'High Performance', 'IoT', 'Industrial'],
    status: 'ACTIVE',
    inventory: {
      id: `inv_${id}`,
      productId: id,
      quantity: Math.floor(Math.random() * 1000),
      reserved: Math.floor(Math.random() * 50),
      available: Math.floor(Math.random() * 950),
      reorderLevel: 100,
      leadTime: Math.floor(Math.random() * 30),
      supplier: 'Official Distributor',
      location: 'Warehouse A',
      lastUpdated: new Date().toISOString()
    },
    pricing: {
      unitPrice: 15.50 + parseInt(id) * 2.5,
      currency: 'USD',
      tiers: [
        { minQuantity: 1, maxQuantity: 9, price: 15.50 + parseInt(id) * 2.5 },
        { minQuantity: 10, maxQuantity: 99, price: (15.50 + parseInt(id) * 2.5) * 0.95 },
        { minQuantity: 100, maxQuantity: 999, price: (15.50 + parseInt(id) * 2.5) * 0.90 },
        { minQuantity: 1000, maxQuantity: null, price: (15.50 + parseInt(id) * 2.5) * 0.85 }
      ],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    metrics: {
      rating: 4.0 + Math.random() * 1.0,
      reviewCount: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 5000),
      purchaseCount: Math.floor(Math.random() * 200),
      wishlistCount: Math.floor(Math.random() * 150)
    },
    compatibility: {
      developmentBoards: [
        { id: 'board1', name: 'NUCLEO-H743ZI2', compatibility: 100 },
        { id: 'board2', name: 'STM32H743I-EVAL', compatibility: 100 }
      ],
      software: [
        { name: 'STM32CubeMX', version: '6.x', compatibility: 100 },
        { name: 'STM32CubeIDE', version: '1.x', compatibility: 100 },
        { name: 'Keil MDK-ARM', version: '5.x', compatibility: 100 }
      ]
    },
    applications: [
      {
        id: `app_${id}_1`,
        title: 'Industrial IoT Gateway',
        description: 'High-performance gateway for industrial IoT applications',
        industry: 'Industrial Automation'
      },
      {
        id: `app_${id}_2`,
        title: 'Motor Control System',
        description: 'Advanced motor control with real-time feedback',
        industry: 'Automotive'
      }
    ],
    relatedProducts: [
      { id: (parseInt(id) + 1).toString(), name: `STM32 Product ${parseInt(id) + 1}`, relationship: 'similar' },
      { id: (parseInt(id) + 2).toString(), name: `STM32 Product ${parseInt(id) + 2}`, relationship: 'upgrade' },
      { id: (parseInt(id) + 10).toString(), name: 'Development Board for STM32', relationship: 'accessory' }
    ],
    seo: {
      metaTitle: `STM32H${743 + parseInt(id)} - High Performance ARM Cortex-M7 Microcontroller`,
      metaDescription: `Discover the STM32H${743 + parseInt(id)} microcontroller with ARM Cortex-M7 core, ${480 + parseInt(id) * 10}MHz frequency, and advanced peripherals for demanding applications.`,
      keywords: ['STM32', `STM32H${743 + parseInt(id)}`, 'microcontroller', 'ARM Cortex-M7', 'IoT', 'industrial'],
      canonical: `/products/${id}`,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `STM32 Product ${id}`,
        manufacturer: { '@type': 'Organization', name: 'STMicroelectronics' },
        model: `STM32H${743 + parseInt(id)}`,
        category: 'Microcontrollers',
        offers: {
          '@type': 'Offer',
          price: (15.50 + parseInt(id) * 2.5).toString(),
          priceCurrency: 'USD',
          availability: 'InStock'
        }
      }
    },
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Increment view count
  product.metrics.views += 1;

  return product;
}

async function createProduct(data: any) {
  // Simulate database insert
  const newProduct = {
    id: `product_${Date.now()}`,
    ...data,
    metrics: {
      rating: 0,
      reviewCount: 0,
      views: 0,
      purchaseCount: 0,
      wishlistCount: 0
    },
    inventory: {
      id: `inv_${Date.now()}`,
      productId: `product_${Date.now()}`,
      quantity: 0,
      reserved: 0,
      available: 0,
      reorderLevel: 10,
      leadTime: 14,
      supplier: '',
      location: '',
      lastUpdated: new Date().toISOString()
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return newProduct;
}

async function updateProduct(id: string, data: any) {
  // Simulate database update
  const updatedProduct = {
    ...await getProductById(id),
    ...data,
    updatedAt: new Date().toISOString()
  };

  return updatedProduct;
}

async function deleteProduct(id: string) {
  // Simulate database delete
  return { success: true, message: 'Product deleted successfully' };
}

// API Route Handlers
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

    const validation = ProductQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: validation.error.errors
        },
        { status: 400 }
      );
    }

    const { page, limit, sortBy, sortOrder, ...filters } = validation.data;

    // Check cache
    const cacheKey = `products:${JSON.stringify({ page, limit, sortBy, sortOrder, ...filters })}`;
    const cachedResult = await cacheResponse(cacheKey);
    if (cachedResult) {
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        processingTime: Date.now() - startTime
      });
    }

    // Fetch products
    const result = await getProducts(filters, { page, limit, sortBy, sortOrder });

    const response = {
      success: true,
      data: result.data,
      pagination: result.pagination,
      filters: result.filters,
      processingTime: Date.now() - startTime,
      cached: false
    };

    // Log API request
    await logAPIRequest({
      method: 'GET',
      endpoint: '/api/products',
      params: queryParams,
      responseTime: Date.now() - startTime,
      status: 200,
      userAgent: request.headers.get('user-agent') || '',
      ip: request.ip || ''
    });

    // Cache response for 5 minutes
    await cacheResponse(cacheKey, response, 300);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Products API Error:', error);

    await logAPIRequest({
      method: 'GET',
      endpoint: '/api/products',
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
        message: 'An error occurred while fetching products'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, { limit: 10, window: 60000 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      );
    }

    // Authentication
    const authResult = await authenticateRequest(request);
    if (!authResult.success || !['ADMIN', 'MANAGER'].includes(authResult.user?.role)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin or Manager role required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = ProductCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.errors
        },
        { status: 400 }
      );
    }

    // Create product
    const newProduct = await createProduct(validation.data);

    const response = {
      success: true,
      data: newProduct,
      message: 'Product created successfully',
      processingTime: Date.now() - startTime
    };

    // Log API request
    await logAPIRequest({
      method: 'POST',
      endpoint: '/api/products',
      userId: authResult.user.id,
      responseTime: Date.now() - startTime,
      status: 201,
      userAgent: request.headers.get('user-agent') || '',
      ip: request.ip || ''
    });

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Create Product API Error:', error);

    await logAPIRequest({
      method: 'POST',
      endpoint: '/api/products',
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
        message: 'An error occurred while creating the product'
      },
      { status: 500 }
    );
  }
}
