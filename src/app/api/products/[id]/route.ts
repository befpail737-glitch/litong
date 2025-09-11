import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { authenticateRequest } from '@/lib/auth';
import { cacheResponse } from '@/lib/cache';
import { logAPIRequest } from '@/lib/logging';
import { rateLimit } from '@/lib/rate-limit';

// Validation Schemas
const ProductUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  manufacturer: z.string().min(1).max(100).optional(),
  category: z.string().min(1).max(100).optional(),
  model: z.string().max(100).optional(),
  price: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  specifications: z.record(z.any()).optional(),
  images: z.array(z.string().url()).optional(),
  documents: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED', 'COMING_SOON']).optional()
});

// Mock Database Functions
async function getProductById(id: string) {
  // Return null if product not found
  if (parseInt(id) > 150) {
    return null;
  }

  // Simulate database fetch with detailed product data
  const product = {
    id,
    name: `STM32H${743 + parseInt(id)} Microcontroller`,
    slug: `stm32h${743 + parseInt(id)}-microcontroller`,
    description: `High-performance ARM Cortex-M7 microcontroller ${id} with advanced features for demanding applications. Features dual-bank Flash memory, multiple communication interfaces, and comprehensive peripheral set.`,
    shortDescription: `High-performance ARM Cortex-M7 MCU with ${480 + parseInt(id) * 10}MHz frequency`,
    manufacturer: 'STMicroelectronics',
    category: 'Microcontrollers',
    subcategory: 'ARM Cortex-M7',
    model: `STM32H${743 + parseInt(id)}VIT6`,
    partNumber: `STM32H${743 + parseInt(id)}VIT6`,
    price: 15.50 + parseInt(id) * 2.5,
    currency: 'USD',

    specifications: {
      core: {
        processor: 'ARM Cortex-M7',
        frequency: `${480 + parseInt(id) * 10}MHz`,
        architecture: '32-bit',
        fpu: 'Single and double precision FPU'
      },
      memory: {
        flash: `${2 + Math.floor(parseInt(id) / 10)}MB`,
        ram: `${1 + Math.floor(parseInt(id) / 20)}MB`,
        eeprom: 'None',
        cache: '16KB I-cache, 16KB D-cache'
      },
      package: {
        type: 'LQFP144',
        pins: 144,
        size: '20x20mm',
        pitch: '0.5mm'
      },
      electrical: {
        voltage: '1.62V to 3.6V',
        current: {
          active: '280µA/MHz',
          standby: '2.95µA',
          stop: '108nA'
        },
        temperature: '-40°C to +85°C'
      },
      peripherals: {
        gpio: 168,
        timers: {
          total: 22,
          advanced: 2,
          general: 12,
          basic: 2,
          lowPower: 5,
          watchdog: 2
        },
        adc: {
          count: 3,
          resolution: '16-bit',
          channels: 36,
          samplingRate: '5.33Msps'
        },
        dac: {
          count: 2,
          resolution: '12-bit',
          channels: 2
        },
        communication: {
          uart: 8,
          spi: 6,
          i2c: 4,
          can: 2,
          usb: 2,
          ethernet: 1,
          sdio: 2,
          camera: 1
        },
        security: {
          cryptoProcessor: 'Yes',
          trng: 'Yes',
          aes: '128/256-bit',
          hash: 'SHA-1/SHA-2',
          rsa: 'Up to 4096-bit'
        }
      }
    },

    images: [
      {
        id: `img_${id}_1`,
        url: `https://cdn.example.com/products/${id}/main.jpg`,
        alt: `STM32H${743 + parseInt(id)} Main Product Image`,
        title: `STM32H${743 + parseInt(id)} Microcontroller`,
        width: 800,
        height: 600,
        size: 125000,
        format: 'JPEG',
        thumbnail: `https://cdn.example.com/products/${id}/thumb_main.jpg`,
        isPrimary: true
      },
      {
        id: `img_${id}_2`,
        url: `https://cdn.example.com/products/${id}/pinout.jpg`,
        alt: `STM32H${743 + parseInt(id)} Pinout Diagram`,
        title: 'Pinout Diagram',
        width: 1200,
        height: 800,
        size: 200000,
        format: 'JPEG',
        thumbnail: `https://cdn.example.com/products/${id}/thumb_pinout.jpg`,
        isPrimary: false
      },
      {
        id: `img_${id}_3`,
        url: `https://cdn.example.com/products/${id}/block-diagram.jpg`,
        alt: `STM32H${743 + parseInt(id)} Block Diagram`,
        title: 'Block Diagram',
        width: 1000,
        height: 700,
        size: 180000,
        format: 'JPEG',
        thumbnail: `https://cdn.example.com/products/${id}/thumb_block.jpg`,
        isPrimary: false
      }
    ],

    documents: [
      {
        id: `doc_${id}_1`,
        name: `STM32H${743 + parseInt(id)} Datasheet`,
        filename: `stm32h${743 + parseInt(id)}_datasheet.pdf`,
        url: `https://cdn.example.com/docs/${id}/datasheet.pdf`,
        type: 'DATASHEET',
        size: 2457600,
        pages: 247,
        version: '1.2',
        language: 'EN',
        downloadCount: Math.floor(Math.random() * 1000),
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `doc_${id}_2`,
        name: 'Reference Manual RM0433',
        filename: 'rm0433_reference_manual.pdf',
        url: `https://cdn.example.com/docs/${id}/reference.pdf`,
        type: 'MANUAL',
        size: 15728640,
        pages: 3320,
        version: '2.1',
        language: 'EN',
        downloadCount: Math.floor(Math.random() * 500),
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `doc_${id}_3`,
        name: 'Programming Manual',
        filename: 'pm0253_programming_manual.pdf',
        url: `https://cdn.example.com/docs/${id}/programming.pdf`,
        type: 'MANUAL',
        size: 1234567,
        pages: 156,
        version: '1.0',
        language: 'EN',
        downloadCount: Math.floor(Math.random() * 300),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `doc_${id}_4`,
        name: 'Application Note AN4013',
        filename: 'an4013_application_note.pdf',
        url: `https://cdn.example.com/docs/${id}/application_note.pdf`,
        type: 'APPLICATION_NOTE',
        size: 867532,
        pages: 45,
        version: '1.1',
        language: 'EN',
        downloadCount: Math.floor(Math.random() * 200),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],

    tags: ['STM32', 'ARM', 'Microcontroller', 'High Performance', 'IoT', 'Industrial', 'Automotive', 'Real-time'],
    categories: ['Microcontrollers', 'ARM Cortex-M7', 'High Performance MCUs'],
    status: 'ACTIVE',

    inventory: {
      id: `inv_${id}`,
      productId: id,
      quantity: Math.floor(Math.random() * 1000) + 100,
      reserved: Math.floor(Math.random() * 50),
      available: Math.floor(Math.random() * 950) + 50,
      reorderLevel: 100,
      leadTime: Math.floor(Math.random() * 30) + 7,
      supplier: 'STMicroelectronics Official',
      distributors: [
        { name: 'Digi-Key', leadTime: 2, stock: Math.floor(Math.random() * 500) },
        { name: 'Mouser', leadTime: 3, stock: Math.floor(Math.random() * 300) },
        { name: 'Arrow', leadTime: 5, stock: Math.floor(Math.random() * 200) }
      ],
      location: 'Warehouse A - Section 12',
      lastUpdated: new Date().toISOString(),
      projectedStock: {
        nextWeek: Math.floor(Math.random() * 200),
        nextMonth: Math.floor(Math.random() * 500),
        nextQuarter: Math.floor(Math.random() * 1000)
      }
    },

    pricing: {
      unitPrice: 15.50 + parseInt(id) * 2.5,
      currency: 'USD',
      msrp: (15.50 + parseInt(id) * 2.5) * 1.4,
      tiers: [
        { minQuantity: 1, maxQuantity: 9, price: 15.50 + parseInt(id) * 2.5, discount: 0 },
        { minQuantity: 10, maxQuantity: 99, price: (15.50 + parseInt(id) * 2.5) * 0.95, discount: 5 },
        { minQuantity: 100, maxQuantity: 999, price: (15.50 + parseInt(id) * 2.5) * 0.90, discount: 10 },
        { minQuantity: 1000, maxQuantity: 4999, price: (15.50 + parseInt(id) * 2.5) * 0.85, discount: 15 },
        { minQuantity: 5000, maxQuantity: null, price: (15.50 + parseInt(id) * 2.5) * 0.80, discount: 20 }
      ],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date().toISOString()
    },

    metrics: {
      rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 100) + 10,
      views: Math.floor(Math.random() * 5000) + 500,
      purchaseCount: Math.floor(Math.random() * 200) + 50,
      wishlistCount: Math.floor(Math.random() * 150) + 20,
      downloadCount: Math.floor(Math.random() * 800) + 100,
      inquiryCount: Math.floor(Math.random() * 30) + 5,
      conversionRate: parseFloat((Math.random() * 0.1 + 0.02).toFixed(3)),
      avgOrderQuantity: Math.floor(Math.random() * 50) + 10,
      popularityScore: Math.floor(Math.random() * 100) + 50
    },

    compatibility: {
      developmentBoards: [
        {
          id: 'nucleo-h743zi2',
          name: 'NUCLEO-H743ZI2',
          manufacturer: 'STMicroelectronics',
          compatibility: 100,
          price: 25.50,
          url: '/products/nucleo-h743zi2'
        },
        {
          id: 'stm32h743i-eval',
          name: 'STM32H743I-EVAL',
          manufacturer: 'STMicroelectronics',
          compatibility: 100,
          price: 156.00,
          url: '/products/stm32h743i-eval'
        }
      ],
      software: [
        {
          name: 'STM32CubeMX',
          version: '6.11.0',
          compatibility: 100,
          url: 'https://www.st.com/en/development-tools/stm32cubemx.html'
        },
        {
          name: 'STM32CubeIDE',
          version: '1.15.0',
          compatibility: 100,
          url: 'https://www.st.com/en/development-tools/stm32cubeide.html'
        },
        {
          name: 'Keil MDK-ARM',
          version: '5.38',
          compatibility: 100,
          url: 'https://www2.keil.com/mdk5'
        },
        {
          name: 'IAR EWARM',
          version: '9.40',
          compatibility: 100,
          url: 'https://www.iar.com/products/architectures/arm/iar-embedded-workbench-for-arm/'
        }
      ],
      operatingSystems: [
        { name: 'FreeRTOS', compatibility: 100 },
        { name: 'ThreadX', compatibility: 100 },
        { name: 'Zephyr', compatibility: 95 },
        { name: 'RT-Thread', compatibility: 90 }
      ]
    },

    applications: [
      {
        id: `app_${id}_1`,
        title: 'Industrial IoT Gateway',
        description: 'High-performance gateway for industrial IoT applications with real-time data processing',
        industry: 'Industrial Automation',
        useCase: 'Data Acquisition and Processing',
        features: ['Real-time processing', 'Multiple connectivity options', 'Secure communication'],
        image: `https://cdn.example.com/applications/${id}_iot_gateway.jpg`
      },
      {
        id: `app_${id}_2`,
        title: 'Advanced Motor Control',
        description: 'Precision motor control system with advanced algorithms and feedback control',
        industry: 'Automotive',
        useCase: 'Motor Control',
        features: ['FOC control', 'Encoder feedback', 'Safety monitoring'],
        image: `https://cdn.example.com/applications/${id}_motor_control.jpg`
      },
      {
        id: `app_${id}_3`,
        title: 'Medical Device Controller',
        description: 'Safe and reliable controller for critical medical equipment',
        industry: 'Medical',
        useCase: 'Device Control',
        features: ['Safety certification', 'Low power operation', 'Real-time monitoring'],
        image: `https://cdn.example.com/applications/${id}_medical.jpg`
      }
    ],

    relatedProducts: {
      similar: [
        {
          id: (parseInt(id) + 1).toString(),
          name: `STM32H${743 + parseInt(id) + 1} Microcontroller`,
          relationship: 'similar',
          price: 15.50 + (parseInt(id) + 1) * 2.5,
          image: `https://cdn.example.com/products/${parseInt(id) + 1}/thumb_main.jpg`
        },
        {
          id: (parseInt(id) - 1 || 1).toString(),
          name: `STM32H${743 + (parseInt(id) - 1 || 1)} Microcontroller`,
          relationship: 'similar',
          price: 15.50 + ((parseInt(id) - 1) || 1) * 2.5,
          image: `https://cdn.example.com/products/${parseInt(id) - 1 || 1}/thumb_main.jpg`
        }
      ],
      upgrades: [
        {
          id: (parseInt(id) + 10).toString(),
          name: `STM32H${743 + parseInt(id) + 10} Advanced`,
          relationship: 'upgrade',
          price: 15.50 + (parseInt(id) + 10) * 2.5,
          improvements: ['Higher frequency', 'More memory', 'Additional peripherals'],
          image: `https://cdn.example.com/products/${parseInt(id) + 10}/thumb_main.jpg`
        }
      ],
      accessories: [
        {
          id: `dev_board_${id}`,
          name: `Development Board for STM32H${743 + parseInt(id)}`,
          relationship: 'accessory',
          price: 45.00,
          description: 'Complete development and evaluation board',
          image: `https://cdn.example.com/products/dev_board_${id}/thumb_main.jpg`
        },
        {
          id: `debugger_${id}`,
          name: 'ST-LINK/V3SET Debugger',
          relationship: 'accessory',
          price: 75.00,
          description: 'Professional debugging and programming tool',
          image: 'https://cdn.example.com/products/debugger/thumb_main.jpg'
        }
      ],
      alternatives: [
        {
          id: `ti_${id}`,
          name: 'TI TM4C129x Series',
          manufacturer: 'Texas Instruments',
          relationship: 'alternative',
          price: 18.50,
          comparison: ['Similar performance', 'Different ecosystem', 'Competitive pricing'],
          image: `https://cdn.example.com/products/ti_${id}/thumb_main.jpg`
        }
      ]
    },

    certifications: [
      {
        name: 'ISO 26262',
        level: 'ASIL-D',
        description: 'Automotive functional safety standard',
        validUntil: '2026-12-31'
      },
      {
        name: 'IEC 61508',
        level: 'SIL 3',
        description: 'Functional safety standard',
        validUntil: '2025-06-30'
      },
      {
        name: 'AEC-Q100',
        level: 'Grade 1',
        description: 'Automotive electronics qualification',
        validUntil: '2027-03-15'
      }
    ],

    seo: {
      metaTitle: `STM32H${743 + parseInt(id)} - High Performance ARM Cortex-M7 Microcontroller | Buy Online`,
      metaDescription: `Buy STM32H${743 + parseInt(id)} microcontroller with ARM Cortex-M7 core, ${480 + parseInt(id) * 10}MHz frequency, ${2 + Math.floor(parseInt(id) / 10)}MB Flash. Fast delivery, competitive prices, technical support.`,
      keywords: [
        'STM32',
        `STM32H${743 + parseInt(id)}`,
        'microcontroller',
        'ARM Cortex-M7',
        'high performance',
        'IoT',
        'industrial',
        'automotive',
        'real-time'
      ],
      canonical: `/products/${id}`,
      alternateUrls: {
        'en-US': `/en/products/${id}`,
        'zh-CN': `/zh/products/${id}`,
        'de-DE': `/de/products/${id}`,
        'fr-FR': `/fr/products/${id}`
      },
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `STM32H${743 + parseInt(id)} Microcontroller`,
        description: `High-performance ARM Cortex-M7 microcontroller with ${480 + parseInt(id) * 10}MHz frequency`,
        manufacturer: {
          '@type': 'Organization',
          name: 'STMicroelectronics',
          url: 'https://www.st.com'
        },
        model: `STM32H${743 + parseInt(id)}VIT6`,
        category: 'Microcontrollers',
        image: `https://cdn.example.com/products/${id}/main.jpg`,
        offers: {
          '@type': 'Offer',
          price: (15.50 + parseInt(id) * 2.5).toString(),
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'Electronics Distributor'
          }
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: (4.0 + Math.random() * 1.0).toFixed(1),
          reviewCount: Math.floor(Math.random() * 100) + 10
        },
        brand: {
          '@type': 'Brand',
          name: 'STMicroelectronics'
        }
      }
    },

    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    lastViewedAt: new Date().toISOString()
  };

  return product;
}

async function updateProduct(id: string, data: any, userId?: string) {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    return null;
  }

  // Simulate database update
  const updatedProduct = {
    ...existingProduct,
    ...data,
    updatedAt: new Date().toISOString(),
    lastModifiedBy: userId
  };

  return updatedProduct;
}

async function deleteProduct(id: string, userId?: string) {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    return null;
  }

  // Simulate soft delete
  return {
    success: true,
    message: 'Product deleted successfully',
    deletedAt: new Date().toISOString(),
    deletedBy: userId
  };
}

// API Route Handlers
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  const productId = params.id;

  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, { limit: 200, window: 60000 });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      );
    }

    // Check cache first
    const cacheKey = `product:${productId}`;
    const cachedProduct = await cacheResponse(cacheKey);
    if (cachedProduct) {
      return NextResponse.json({
        success: true,
        data: cachedProduct,
        cached: true,
        processingTime: Date.now() - startTime
      });
    }

    // Fetch product
    const product = await getProductById(productId);

    if (!product) {
      await logAPIRequest({
        method: 'GET',
        endpoint: `/api/products/${productId}`,
        responseTime: Date.now() - startTime,
        status: 404,
        userAgent: request.headers.get('user-agent') || '',
        ip: request.ip || ''
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          message: `Product with ID ${productId} does not exist`
        },
        { status: 404 }
      );
    }

    const response = {
      success: true,
      data: product,
      cached: false,
      processingTime: Date.now() - startTime
    };

    // Log successful request
    await logAPIRequest({
      method: 'GET',
      endpoint: `/api/products/${productId}`,
      responseTime: Date.now() - startTime,
      status: 200,
      userAgent: request.headers.get('user-agent') || '',
      ip: request.ip || ''
    });

    // Cache for 10 minutes
    await cacheResponse(cacheKey, product, 600);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Product Detail API Error:', error);

    await logAPIRequest({
      method: 'GET',
      endpoint: `/api/products/${productId}`,
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
        message: 'An error occurred while fetching the product'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  const productId = params.id;

  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, { limit: 20, window: 60000 });
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
    const validation = ProductUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.errors
        },
        { status: 400 }
      );
    }

    // Update product
    const updatedProduct = await updateProduct(productId, validation.data, authResult.user.id);

    if (!updatedProduct) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          message: `Product with ID ${productId} does not exist`
        },
        { status: 404 }
      );
    }

    const response = {
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully',
      processingTime: Date.now() - startTime
    };

    // Invalidate cache
    await cacheResponse(`product:${productId}`, null, 0);

    // Log API request
    await logAPIRequest({
      method: 'PUT',
      endpoint: `/api/products/${productId}`,
      userId: authResult.user.id,
      responseTime: Date.now() - startTime,
      status: 200,
      userAgent: request.headers.get('user-agent') || '',
      ip: request.ip || ''
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Update Product API Error:', error);

    await logAPIRequest({
      method: 'PUT',
      endpoint: `/api/products/${productId}`,
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
        message: 'An error occurred while updating the product'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  const productId = params.id;

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
    if (!authResult.success || authResult.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin role required' },
        { status: 401 }
      );
    }

    // Delete product
    const result = await deleteProduct(productId, authResult.user.id);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          message: `Product with ID ${productId} does not exist`
        },
        { status: 404 }
      );
    }

    const response = {
      success: true,
      message: 'Product deleted successfully',
      processingTime: Date.now() - startTime
    };

    // Invalidate cache
    await cacheResponse(`product:${productId}`, null, 0);

    // Log API request
    await logAPIRequest({
      method: 'DELETE',
      endpoint: `/api/products/${productId}`,
      userId: authResult.user.id,
      responseTime: Date.now() - startTime,
      status: 200,
      userAgent: request.headers.get('user-agent') || '',
      ip: request.ip || ''
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Delete Product API Error:', error);

    await logAPIRequest({
      method: 'DELETE',
      endpoint: `/api/products/${productId}`,
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
        message: 'An error occurred while deleting the product'
      },
      { status: 500 }
    );
  }
}
