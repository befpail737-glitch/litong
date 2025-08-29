import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import ProductDetail from '@/components/products/ProductDetail';
import Breadcrumb from '@/components/ui/Breadcrumb';

// 产品数据获取函数 - 在实际应用中会从CMS或数据库获取
const getProductData = (slug: string) => {
  // 示例产品数据
  const products = {
    'stm32f407vgt6': {
      id: '1',
      partNumber: 'STM32F407VGT6',
      fullName: 'STM32F407VGT6 - 32位ARM Cortex-M4微控制器',
      brand: 'STMicroelectronics',
      brandSlug: 'stm',
      category: 'microcontrollers',
      categoryName: '微控制器',
      description: '32位ARM Cortex-M4微控制器，168MHz主频，1024KB Flash存储器，192KB RAM',
      detailedDescription: 'STM32F407VGT6是STMicroelectronics推出的高性能32位ARM® Cortex®-M4微控制器，基于高性能ARM® Cortex®-M4 32位RISC内核，工作频率高达168MHz。该芯片集成了高速嵌入式存储器（高达1Mbyte的Flash存储器和192Kbyte的RAM）以及连接到两条APB总线、两条AHB总线和一个32位多AHB总线矩阵的丰富的增强I/O和外设。',
      specifications: {
        core: 'ARM® Cortex®-M4',
        frequency: '168 MHz',
        flash: '1024 KB',
        ram: '192 KB',
        package: 'LQFP100',
        gpio: '82',
        adc: '3x 12-bit, 16通道',
        dac: '2x 12-bit',
        timer: '14个定时器',
        communication: 'CAN 2.0B, USB 2.0, UART, SPI, I2C',
        temperature: '-40°C to +85°C',
        voltage: '1.8V to 3.6V',
        current: '50μA (待机模式)'
      },
      features: [
        'ARM® Cortex®-M4内核，工作频率高达168MHz',
        '1024KB Flash存储器和192KB RAM',
        '82个GPIO引脚，支持5V容忍',
        '3个12位ADC，转换速度高达2.4MSPS',
        '2个12位DAC输出通道',
        '14个通用定时器，包括2个32位定时器',
        '多种通信接口：CAN、USB、UART、SPI、I2C',
        '低功耗设计，待机模式仅50μA',
        '工业级温度范围：-40°C到+85°C',
        '符合ECOPACK®环保标准'
      ],
      applications: [
        '工业自动化和控制系统',
        '电机控制和驱动器',
        '医疗设备和仪器',
        '消费类电子产品',
        '建筑自动化',
        '报警和安防系统',
        '家电控制',
        '游戏和GPS导航'
      ],
      pinout: '/images/products/stm32f407vgt6-pinout.png',
      blockDiagram: '/images/products/stm32f407vgt6-block-diagram.png',
      package: {
        type: 'LQFP100',
        dimensions: '14x14x1.4mm',
        pitch: '0.5mm',
        pins: 100
      },
      documents: [
        {
          type: 'datasheet',
          name: '数据手册',
          url: '/documents/stm32f407vgt6-datasheet.pdf',
          size: '2.5MB'
        },
        {
          type: 'reference-manual',
          name: '参考手册',
          url: '/documents/stm32f407-reference-manual.pdf',
          size: '18.2MB'
        },
        {
          type: 'programming-manual',
          name: '编程手册',
          url: '/documents/stm32f4-programming-manual.pdf',
          size: '1.8MB'
        },
        {
          type: 'errata',
          name: '勘误表',
          url: '/documents/stm32f407vgt6-errata.pdf',
          size: '245KB'
        }
      ],
      developmentTools: [
        {
          name: 'STM32CubeMX',
          description: '图形化配置工具和代码生成器',
          url: 'https://www.st.com/stm32cubemx'
        },
        {
          name: 'STM32CubeIDE',
          description: '集成开发环境',
          url: 'https://www.st.com/stm32cubeide'
        },
        {
          name: 'STM32CubeF4',
          description: 'STM32F4系列HAL库和中间件',
          url: 'https://www.st.com/stm32cubef4'
        }
      ],
      relatedProducts: [
        {
          partNumber: 'STM32F407VET6',
          description: '相同系列，512KB Flash版本',
          link: '/products/stm32f407vet6'
        },
        {
          partNumber: 'STM32F407ZGT6', 
          description: '相同系列，144引脚版本',
          link: '/products/stm32f407zgt6'
        },
        {
          partNumber: 'STM32F405VGT6',
          description: '不含以太网MAC的版本',
          link: '/products/stm32f405vgt6'
        }
      ],
      pricing: {
        price: '¥45.80',
        currency: 'CNY',
        quantity: 1,
        stock: 1200,
        moq: 1, // 最小起订量
        leadTime: '现货',
        priceBreaks: [
          { quantity: 1, price: 45.80 },
          { quantity: 10, price: 42.30 },
          { quantity: 100, price: 38.80 },
          { quantity: 500, price: 35.20 },
          { quantity: 1000, price: 32.50 }
        ]
      },
      images: [
        '/images/products/stm32f407vgt6-main.jpg',
        '/images/products/stm32f407vgt6-package.jpg',
        '/images/products/stm32f407vgt6-board.jpg'
      ],
      videos: [
        {
          title: 'STM32F407开发板介绍',
          url: 'https://www.youtube.com/watch?v=example1',
          thumbnail: '/images/videos/stm32f407-intro.jpg'
        }
      ]
    }
  };

  return products[slug] || null;
};

export async function generateStaticParams() {
  // Generate static params for all available product slugs
  const productSlugs = ['stm32f407vgt6', 'lm358', 'ads1115']; // Add more product slugs as needed
  
  return productSlugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const product = getProductData(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found'
    };
  }
  
  return {
    title: `${product.partNumber} ${product.categoryName} - 参数规格书 | LiTong`,
    description: `${product.partNumber} - ${product.description}。力通电子提供${product.brand} ${product.partNumber}现货供应，技术支持，规格书下载。`,
    keywords: [
      product.partNumber,
      `${product.partNumber}参数`,
      `${product.partNumber}规格书`,
      `${product.partNumber}现货`,
      `${product.brand}${product.categoryName}`,
      product.categoryName
    ],
    openGraph: {
      title: `${product.partNumber} - ${product.description}`,
      description: `${product.brand} ${product.partNumber} ${product.categoryName}，现货供应，技术支持`,
      type: 'website',
      images: product.images ? [product.images[0]] : undefined
    },
    robots: {
      index: true,
      follow: true
    },
    alternates: {
      canonical: `/${locale}/products/${slug}`
    }
  };
}

export default async function ProductDetailPage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  const product = getProductData(slug);
  
  if (!product) {
    notFound();
  }

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '品牌列表', href: '/brands' },
    { label: product.brand, href: `/brands/${product.brandSlug}` },
    { label: product.categoryName, href: `/brands/${product.brandSlug}/products/${product.category}` },
    { label: product.partNumber, href: `/products/${slug}` }
  ];

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      
      <ProductDetail product={product} />
      
      {/* JSON-LD Schema for Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.partNumber,
            "description": product.description,
            "brand": {
              "@type": "Brand",
              "name": product.brand
            },
            "manufacturer": {
              "@type": "Organization",
              "name": product.brand
            },
            "category": product.categoryName,
            "sku": product.partNumber,
            "offers": {
              "@type": "Offer",
              "price": product.pricing.price.replace('¥', ''),
              "priceCurrency": "CNY",
              "availability": product.pricing.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "LiTong Electronics"
              }
            },
            "additionalProperty": Object.entries(product.specifications).map(([key, value]) => ({
              "@type": "PropertyValue",
              "name": key,
              "value": value
            })),
            "image": product.images,
            "url": `/${locale}/products/${slug}`
          })
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `${product.partNumber}的主要特性是什么？`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": product.features.slice(0, 3).join('；')
                }
              },
              {
                "@type": "Question", 
                "name": `${product.partNumber}适用于哪些应用？`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": product.applications.slice(0, 4).join('、')
                }
              },
              {
                "@type": "Question",
                "name": `在哪里可以下载${product.partNumber}的数据手册？`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `您可以在本页面的技术文档部分下载${product.partNumber}的完整数据手册和参考资料。`
                }
              }
            ]
          })
        }}
      />
    </>
  );
}