import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import ProductFilter from '@/components/brands/ProductFilter';
import Breadcrumb from '@/components/ui/Breadcrumb';

// 产品数据结构
interface Product {
  id: string;
  partNumber: string;
  description: string;
  brand: string;
  category: string;
  parameters: Record<string, string>;
  package: string;
  datasheet?: string;
  price?: string;
  stock?: number;
  image?: string;
}

// 产品分类数据 - 在实际应用中会从CMS或数据库获取
const getProductData = (brandSlug: string, categorySlug: string) => {
  const productData = {
    'stm': {
      'microcontrollers': {
        id: 'microcontrollers',
        name: '微控制器',
        description: 'STM32系列32位ARM® Cortex®-M微控制器，提供丰富的外设和强大的性能',
        features: [
          'ARM® Cortex®-M内核',
          '丰富的外设接口',
          '低功耗设计',
          '完善的开发生态',
          '工业级温度范围',
          'ECOPACK®环保封装'
        ],
        applications: [
          '工业自动化',
          '消费电子',
          '医疗设备',
          '智能家居',
          '汽车电子',
          '物联网'
        ],
        filterColumns: [
          { key: 'series', name: '产品系列', type: 'select', options: ['STM32F0', 'STM32F1', 'STM32F4', 'STM32F7', 'STM32H7', 'STM32L4', 'STM32G0', 'STM32G4'] },
          { key: 'core', name: 'CPU内核', type: 'select', options: ['Cortex-M0', 'Cortex-M0+', 'Cortex-M3', 'Cortex-M4', 'Cortex-M7'] },
          { key: 'frequency', name: '主频MHz', type: 'range', min: 8, max: 550, unit: 'MHz' },
          { key: 'flash', name: 'Flash容量', type: 'select', options: ['16KB', '32KB', '64KB', '128KB', '256KB', '512KB', '1MB', '2MB'] },
          { key: 'ram', name: 'RAM容量', type: 'select', options: ['4KB', '8KB', '16KB', '32KB', '64KB', '128KB', '256KB', '512KB', '1MB'] },
          { key: 'package', name: '封装类型', type: 'select', options: ['LQFP32', 'LQFP48', 'LQFP64', 'LQFP100', 'LQFP144', 'LQFP176', 'BGA100', 'BGA176', 'UFBGA64', 'UFBGA100'] },
          { key: 'gpio', name: 'GPIO数量', type: 'range', min: 16, max: 140, unit: '个' },
          { key: 'adc', name: 'ADC通道', type: 'range', min: 0, max: 24, unit: '通道' },
          { key: 'timer', name: '定时器数量', type: 'range', min: 1, max: 20, unit: '个' },
          { key: 'temperature', name: '工作温度', type: 'select', options: ['-40~85°C', '-40~105°C', '-40~125°C'] }
        ],
        products: [
          {
            id: '1',
            partNumber: 'STM32F407VGT6',
            description: '32位ARM Cortex-M4微控制器，168MHz，1024KB Flash，192KB RAM',
            brand: 'STMicroelectronics',
            category: 'microcontrollers',
            parameters: {
              series: 'STM32F4',
              core: 'Cortex-M4',
              frequency: '168',
              flash: '1MB',
              ram: '192KB',
              package: 'LQFP100',
              gpio: '82',
              adc: '16',
              timer: '14',
              temperature: '-40~85°C'
            },
            package: 'LQFP100',
            datasheet: '/datasheets/stm32f407vgt6.pdf',
            price: '¥45.80',
            stock: 1200,
            image: '/images/products/stm32f407vgt6.jpg'
          },
          {
            id: '2',
            partNumber: 'STM32F103C8T6',
            description: '32位ARM Cortex-M3微控制器，72MHz，64KB Flash，20KB RAM',
            brand: 'STMicroelectronics',
            category: 'microcontrollers',
            parameters: {
              series: 'STM32F1',
              core: 'Cortex-M3',
              frequency: '72',
              flash: '64KB',
              ram: '20KB',
              package: 'LQFP48',
              gpio: '37',
              adc: '10',
              timer: '7',
              temperature: '-40~85°C'
            },
            package: 'LQFP48',
            datasheet: '/datasheets/stm32f103c8t6.pdf',
            price: '¥12.50',
            stock: 8500,
            image: '/images/products/stm32f103c8t6.jpg'
          },
          {
            id: '3',
            partNumber: 'STM32H743VIT6',
            description: '32位ARM Cortex-M7微控制器，400MHz，2048KB Flash，1024KB RAM',
            brand: 'STMicroelectronics',
            category: 'microcontrollers',
            parameters: {
              series: 'STM32H7',
              core: 'Cortex-M7',
              frequency: '400',
              flash: '2MB',
              ram: '1MB',
              package: 'LQFP100',
              gpio: '82',
              adc: '20',
              timer: '18',
              temperature: '-40~85°C'
            },
            package: 'LQFP100',
            datasheet: '/datasheets/stm32h743vit6.pdf',
            price: '¥125.60',
            stock: 450,
            image: '/images/products/stm32h743vit6.jpg'
          },
          {
            id: '4',
            partNumber: 'STM32L476RGT6',
            description: '32位ARM Cortex-M4超低功耗微控制器，80MHz，1024KB Flash，128KB RAM',
            brand: 'STMicroelectronics',
            category: 'microcontrollers',
            parameters: {
              series: 'STM32L4',
              core: 'Cortex-M4',
              frequency: '80',
              flash: '1MB',
              ram: '128KB',
              package: 'LQFP64',
              gpio: '51',
              adc: '16',
              timer: '16',
              temperature: '-40~85°C'
            },
            package: 'LQFP64',
            datasheet: '/datasheets/stm32l476rgt6.pdf',
            price: '¥35.20',
            stock: 2200,
            image: '/images/products/stm32l476rgt6.jpg'
          },
          {
            id: '5',
            partNumber: 'STM32G474RET6',
            description: '32位ARM Cortex-M4混合信号微控制器，170MHz，512KB Flash，128KB RAM',
            brand: 'STMicroelectronics',
            category: 'microcontrollers',
            parameters: {
              series: 'STM32G4',
              core: 'Cortex-M4',
              frequency: '170',
              flash: '512KB',
              ram: '128KB',
              package: 'LQFP64',
              gpio: '51',
              adc: '20',
              timer: '20',
              temperature: '-40~125°C'
            },
            package: 'LQFP64',
            datasheet: '/datasheets/stm32g474ret6.pdf',
            price: '¥28.90',
            stock: 1800,
            image: '/images/products/stm32g474ret6.jpg'
          }
        ]
      },
      'analog-ics': {
        id: 'analog-ics',
        name: '模拟IC',
        description: '高性能模拟集成电路，包括运算放大器、比较器、电压基准和模拟开关',
        features: [
          '高精度性能',
          '低噪声设计',
          '宽工作温度范围',
          '低功耗',
          '小封装尺寸',
          '高可靠性'
        ],
        applications: [
          '精密测量',
          '传感器接口',
          '音频处理',
          '工业控制',
          '医疗电子',
          '通信设备'
        ],
        filterColumns: [
          { key: 'type', name: '器件类型', type: 'select', options: ['运算放大器', '比较器', '电压基准', '模拟开关', 'ADC', 'DAC'] },
          { key: 'channels', name: '通道数', type: 'select', options: ['1', '2', '4', '8'] },
          { key: 'supply_voltage', name: '供电电压', type: 'select', options: ['1.8V-5.5V', '2.7V-12V', '5V-36V', '±5V', '±15V'] },
          { key: 'bandwidth', name: '带宽MHz', type: 'range', min: 0.1, max: 1000, unit: 'MHz' },
          { key: 'offset_voltage', name: '失调电压', type: 'select', options: ['<1mV', '<100μV', '<10μV', '<1μV'] },
          { key: 'package', name: '封装类型', type: 'select', options: ['SOT23-5', 'SOT23-8', 'MSOP8', 'SOIC8', 'SOIC14', 'TSSOP14', 'VFQFPN16'] },
          { key: 'temperature', name: '工作温度', type: 'select', options: ['-40~85°C', '-40~105°C', '-40~125°C'] }
        ],
        products: [
          {
            id: '6',
            partNumber: 'TSV521IST',
            description: '单路RRIO运算放大器，4.5MHz，1.4V-5.5V供电',
            brand: 'STMicroelectronics',
            category: 'analog-ics',
            parameters: {
              type: '运算放大器',
              channels: '1',
              supply_voltage: '1.8V-5.5V',
              bandwidth: '4.5',
              offset_voltage: '<1mV',
              package: 'SOT23-5',
              temperature: '-40~125°C'
            },
            package: 'SOT23-5',
            datasheet: '/datasheets/tsv521ist.pdf',
            price: '¥3.20',
            stock: 15000,
            image: '/images/products/tsv521ist.jpg'
          }
        ]
      }
    }
  };

  return (productData as any)[brandSlug]?.[categorySlug] || null;
};

export async function generateStaticParams() {
  // Generate static params for all available brand slugs and category slugs
  const brandCategories = [
    { slug: 'stm', category: 'microcontrollers' },
    { slug: 'stm', category: 'analog-ics' }
  ];
  
  return brandCategories.map((item) => ({
    slug: item.slug,
    category: item.category,
  }));
}

export async function generateMetadata({
  params: { locale, slug, category }
}: {
  params: { locale: string; slug: string; category: string };
}): Promise<Metadata> {
  const categoryData = getProductData(slug, category);
  
  if (!categoryData) {
    return {
      title: 'Category Not Found'
    };
  }

  const brandName = slug === 'stm' ? 'STMicroelectronics' : slug;
  
  return {
    title: `${brandName} ${categoryData.name} - 型号筛选 | LiTong`,
    description: `${categoryData.description}。力通电子提供${brandName}全系列${categoryData.name}产品，支持参数筛选，现货供应，技术支持。`,
    keywords: [`${brandName}${categoryData.name}`, `${categoryData.name}筛选`, `${categoryData.name}型号`, '电子元件筛选'],
    openGraph: {
      title: `${brandName} ${categoryData.name} - 型号筛选 | LiTong`,
      description: `${categoryData.name}产品型号筛选，参数对比选型`,
      type: 'website'
    }
  };
}

export default async function ProductCategoryPage({
  params: { locale, slug, category }
}: {
  params: { locale: string; slug: string; category: string };
}) {
  const categoryData = getProductData(slug, category);
  
  if (!categoryData) {
    notFound();
  }

  const brandName = slug === 'stm' ? 'STMicroelectronics' : slug;

  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: '品牌列表', href: '/brands' },
    { label: brandName, href: `/brands/${slug}` },
    { label: '产品分类', href: `/brands/${slug}/products` },
    { label: categoryData.name, href: `/brands/${slug}/products/${category}` }
  ];

  return (
    <>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      
      <ProductFilter 
        brandSlug={slug}
        brandName={brandName}
        categoryData={categoryData}
      />
      
      {/* JSON-LD Schema for Product Category Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${brandName} ${categoryData.name}`,
            "description": categoryData.description,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": categoryData.products.length,
              "itemListElement": categoryData.products.map((product: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Product",
                  "name": product.partNumber,
                  "description": product.description,
                  "brand": {
                    "@type": "Brand",
                    "name": product.brand
                  },
                  "offers": {
                    "@type": "Offer",
                    "price": product.price?.replace('¥', ''),
                    "priceCurrency": "CNY",
                    "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                  }
                }
              }))
            }
          })
        }}
      />
    </>
  );
}