// 模拟Sanity客户端，用于开发测试
// 在实际部署时需要安装 @sanity/client @sanity/image-url

// 模拟数据
const mockProducts = [
  {
    _id: '1',
    partNumber: 'STM32H743VIT6',
    name: 'STM32H743VIT6 Microcontroller',
    brand: 'STMicroelectronics',
    category: { _id: '1', name: 'Microcontrollers', slug: 'microcontrollers' },
    subcategory: { _id: '1', name: 'ARM Cortex-M7', slug: 'arm-cortex-m7' },
    description: '32-bit ARM Cortex-M7 microcontroller with 2MB Flash and 1MB SRAM',
    package: 'LQFP-176',
    specifications: [
      { parameter: 'Core', value: 'ARM Cortex-M7', unit: '' },
      { parameter: 'Frequency', value: '480', unit: 'MHz' },
      { parameter: 'Flash', value: '2', unit: 'MB' },
      { parameter: 'RAM', value: '1', unit: 'MB' }
    ],
    features: ['High-performance CPU', 'Rich connectivity', 'Low power consumption'],
    applications: ['Industrial automation', 'Motor control', 'IoT applications'],
    pricing: { price: 25.50, currency: 'USD' },
    stock: 1500,
    leadTime: '2-3 weeks',
    tags: ['ARM', 'Microcontroller', 'High Performance']
  },
  {
    _id: '2',
    partNumber: 'TPS54360DDAR',
    name: 'TPS54360 Switching Regulator',
    brand: 'Texas Instruments',
    category: { _id: '2', name: 'Power Management', slug: 'power-management' },
    subcategory: { _id: '2', name: 'DC-DC Converters', slug: 'dc-dc-converters' },
    description: '3.5V to 60V, 3.5A Synchronous Step-Down Converter',
    package: 'SOIC-8',
    specifications: [
      { parameter: 'Input Voltage', value: '3.5-60', unit: 'V' },
      { parameter: 'Output Current', value: '3.5', unit: 'A' },
      { parameter: 'Efficiency', value: '95', unit: '%' }
    ],
    features: ['High efficiency', 'Wide input voltage range', 'Integrated MOSFETs'],
    applications: ['Industrial', 'Automotive', 'Telecom'],
    pricing: { price: 3.20, currency: 'USD' },
    stock: 2800,
    leadTime: '1-2 weeks',
    tags: ['DC-DC', 'Power', 'High Efficiency']
  }
];

const mockCategories = [
  {
    _id: '1',
    name: 'Microcontrollers',
    nameEn: 'Microcontrollers',
    slug: { current: 'microcontrollers' },
    description: 'ARM-based microcontrollers for embedded applications',
    sort: 1
  },
  {
    _id: '2',
    name: 'Power Management',
    nameEn: 'Power Management',
    slug: { current: 'power-management' },
    description: 'Power management ICs and modules',
    sort: 2
  },
  {
    _id: '3',
    name: 'Analog & Mixed Signal',
    nameEn: 'Analog & Mixed Signal',
    slug: { current: 'analog-mixed-signal' },
    description: 'Analog and mixed-signal ICs',
    sort: 3
  }
];

const mockArticles = [
  {
    _id: '1',
    title: 'STM32选型指南：如何选择合适的微控制器',
    slug: { current: 'stm32-selection-guide' },
    type: 'selection-guide',
    category: 'microcontrollers',
    summary: '详细介绍STM32系列微控制器的选型要点，帮助工程师做出正确的选择。',
    author: { name: 'FAE团队', title: 'Technical Team' },
    tags: ['STM32', '选型', '微控制器'],
    publishedAt: '2024-11-15T00:00:00Z',
    readTime: 8,
    difficulty: 'intermediate',
    isFeatured: true
  },
  {
    _id: '2',
    title: '电源管理IC应用笔记：TPS54360使用详解',
    slug: { current: 'tps54360-application-note' },
    type: 'application-note',
    category: 'power-management',
    summary: '详细介绍TPS54360的应用电路设计和使用注意事项。',
    author: { name: '李工程师', title: 'Power Engineer' },
    tags: ['TPS54360', '电源管理', '降压转换器'],
    publishedAt: '2024-11-12T00:00:00Z',
    readTime: 12,
    difficulty: 'advanced',
    isFeatured: false
  }
];

const mockSolutions = [
  {
    _id: 'stm32f4-analysis',
    title: 'STM32F4系列微控制器深度解析',
    titleEn: 'STM32F4 Series Microcontroller Deep Analysis',
    summary: '本文深入分析STM32F4系列微控制器的特性、应用场景和开发技巧，为工程师提供全面的技术指导。',
    content: `# STM32F4系列微控制器深度解析

STM32F4系列微控制器是STMicroelectronics推出的基于ARM Cortex-M4内核的高性能32位微控制器，具有出色的处理能力和丰富的外设资源。

## 主要特性

### 1. 高性能内核
- ARM Cortex-M4 内核，主频高达180MHz
- 浮点运算单元(FPU)，支持单精度浮点运算
- DSP指令集，适合数字信号处理应用

### 2. 存储资源
- Flash存储器：512KB到2MB不等
- SRAM：192KB到256KB
- 支持外部存储器接口

### 3. 丰富的外设
- 多达17个定时器
- 最多3个SPI接口
- 最多4个USART/UART接口
- 2个CAN接口
- USB OTG接口

## 应用场景

STM32F4系列广泛应用于：

1. **工业自动化**
   - PLC控制系统
   - 电机控制
   - 传感器数据采集

2. **消费电子**
   - 音频处理设备
   - 人机界面(HMI)
   - 智能家居设备

3. **通信设备**
   - 网关设备
   - 协议转换器
   - 数据采集器`,
    category: 'technical',
    tags: ['STM32', '微控制器', '嵌入式', 'ARM'],
    author: '立通电子技术团队',
    publishDate: new Date().toISOString(),
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    slug: { current: 'stm32f4-analysis' }
  }
];

// 模拟Sanity客户端
export const client = {
  fetch: async (query: string, params?: any) => {
    // 简单的查询解析和模拟响应
    if (query.includes('_type == "product"')) {
      return mockProducts;
    }
    if (query.includes('_type == "productCategory"')) {
      return mockCategories;
    }
    if (query.includes('_type == "article"')) {
      return mockArticles;
    }
    if (query.includes('_type == "solution"')) {
      return mockSolutions;
    }
    return [];
  },
  transaction: () => ({
    create: (mutation: any) => ({ commit: async () => [{ _id: Date.now().toString() }] }),
    commit: async () => [{ _id: Date.now().toString() }]
  })
};

export function urlFor(source: any) {
  return {
    url: () => '/placeholder-image.jpg',
    width: (w: number) => ({ url: () => '/placeholder-image.jpg' }),
    height: (h: number) => ({ url: () => '/placeholder-image.jpg' })
  };
}

// 导出所有查询函数
export async function getProducts(limit?: number) {
  const products = mockProducts;
  return limit ? products.slice(0, limit) : products;
}

export async function getProduct(partNumber: string) {
  return mockProducts.find(p => p.partNumber === partNumber) || null;
}

export async function getProductsByCategory(categorySlug: string, limit?: number) {
  const products = mockProducts.filter(p => 
    p.category.slug === categorySlug || p.subcategory.slug === categorySlug
  );
  return limit ? products.slice(0, limit) : products;
}

export async function getProductCategories() {
  return mockCategories;
}

export async function getArticles(type?: string, limit?: number) {
  let articles = mockArticles;
  if (type) {
    articles = articles.filter(a => a.type === type);
  }
  return limit ? articles.slice(0, limit) : articles;
}

export async function getArticle(slug: string) {
  return mockArticles.find(a => a.slug.current === slug) || null;
}

export async function searchProducts(searchTerm: string, filters?: any) {
  return mockProducts.filter(p => 
    p.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

export async function importProductsFromExcel(products: any[]) {
  // 模拟导入成功
  return products.map((_, index) => ({ _id: `imported_${Date.now()}_${index}` }));
}

export async function getSolutions(category?: string, limit?: number) {
  let solutions = mockSolutions;
  if (category && category !== 'all') {
    solutions = solutions.filter(s => s.category === category);
  }
  return limit ? solutions.slice(0, limit) : solutions;
}

export async function getSolution(slug: string) {
  return mockSolutions.find(s => s.slug.current === slug) || null;
}