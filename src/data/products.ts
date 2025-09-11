export interface Product {
  id: string
  partNumber: string
  title: string
  shortDescription: string
  description?: string
  image?: string
  datasheet?: string
  brand: {
    id: string
    name: string
    slug: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  specifications: {
    [key: string]: string | number
  }
  pricing: {
    tiers: Array<{
      quantity: number
      price: number
    }>
    currency: 'CNY' | 'USD'
  }
  inventory: {
    status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued'
    quantity?: number
  }
  package: string
  tags: string[]
  isNew?: boolean
  isFeatured?: boolean
  isActive: boolean
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  parentId?: string
  children?: ProductCategory[]
}

export const productCategories: ProductCategory[] = [
  {
    id: 'microcontrollers',
    name: '微控制器',
    slug: 'microcontrollers',
    description: '8位、16位、32位微控制器产品',
    children: [
      { id: 'mcu-8bit', name: '8位MCU', slug: '8bit-mcu', description: '8位微控制器' },
      { id: 'mcu-16bit', name: '16位MCU', slug: '16bit-mcu', description: '16位微控制器' },
      { id: 'mcu-32bit', name: '32位MCU', slug: '32bit-mcu', description: '32位微控制器' }
    ]
  },
  {
    id: 'processors',
    name: '处理器',
    slug: 'processors',
    description: '应用处理器和数字信号处理器',
    children: [
      { id: 'application-processors', name: '应用处理器', slug: 'application-processors', description: 'ARM Cortex-A系列应用处理器' },
      { id: 'dsp', name: '数字信号处理器', slug: 'dsp', description: '数字信号处理器' }
    ]
  },
  {
    id: 'wireless',
    name: '无线通信',
    slug: 'wireless',
    description: 'WiFi、蓝牙、LoRa等无线通信芯片',
    children: [
      { id: 'wifi-chips', name: 'WiFi芯片', slug: 'wifi-chips', description: 'WiFi通信芯片' },
      { id: 'bluetooth-chips', name: '蓝牙芯片', slug: 'bluetooth-chips', description: '蓝牙通信芯片' },
      { id: 'lora-chips', name: 'LoRa芯片', slug: 'lora-chips', description: 'LoRa长距离通信芯片' }
    ]
  },
  {
    id: 'sensors',
    name: '传感器',
    slug: 'sensors',
    description: '温度、压力、运动等各类传感器',
    children: [
      { id: 'temperature-sensors', name: '温度传感器', slug: 'temperature-sensors', description: '温度检测传感器' },
      { id: 'pressure-sensors', name: '压力传感器', slug: 'pressure-sensors', description: '压力检测传感器' },
      { id: 'motion-sensors', name: '运动传感器', slug: 'motion-sensors', description: '加速度、陀螺仪等运动传感器' }
    ]
  },
  {
    id: 'power-management',
    name: '电源管理',
    slug: 'power-management',
    description: 'DC-DC转换器、LDO、电池管理等',
    children: [
      { id: 'dcdc-converters', name: 'DC-DC转换器', slug: 'dcdc-converters', description: '开关稳压器' },
      { id: 'ldo-regulators', name: 'LDO稳压器', slug: 'ldo-regulators', description: '线性稳压器' },
      { id: 'battery-management', name: '电池管理', slug: 'battery-management', description: '电池充电和管理IC' }
    ]
  }
]

export const mockProducts: Product[] = [
  {
    id: '1',
    partNumber: 'STM32F401RET6',
    title: 'STM32F401RET6 ARM Cortex-M4 微控制器',
    shortDescription: '84MHz ARM Cortex-M4 内核，512KB Flash，96KB SRAM',
    description: 'STM32F401RET6是一款基于高性能ARM Cortex-M4 32位RISC内核的微控制器，工作频率高达84 MHz。该系列具有高速嵌入式存储器（Flash存储器高达512 Kbytes，SRAM高达96 Kbytes），以及连接到两条APB总线的各种增强型I/O和外设。',
    image: '/images/products/stm32f401.jpg',
    brand: {
      id: 'stmicroelectronics',
      name: 'STMicroelectronics',
      slug: 'stmicroelectronics'
    },
    category: {
      id: 'mcu-32bit',
      name: '32位MCU',
      slug: '32bit-mcu'
    },
    specifications: {
      '内核': 'ARM Cortex-M4',
      '频率': '84MHz',
      'Flash': '512KB',
      'SRAM': '96KB',
      '工作电压': '1.7V-3.6V',
      '工作温度': '-40°C~85°C',
      '封装': 'LQFP64',
      'GPIO': 51,
      'ADC': '12-bit, 16通道',
      '定时器': '11个'
    },
    pricing: {
      tiers: [
        { quantity: 1, price: 25.50 },
        { quantity: 10, price: 23.80 },
        { quantity: 100, price: 21.20 },
        { quantity: 1000, price: 18.90 }
      ],
      currency: 'CNY'
    },
    inventory: {
      status: 'in_stock',
      quantity: 5000
    },
    package: 'LQFP64',
    tags: ['ARM', 'Cortex-M4', 'MCU', '32位', 'STM32', '工业级'],
    isNew: true,
    isFeatured: true,
    isActive: true,
  },
  {
    id: '2',
    partNumber: 'STM32F103C8T6',
    title: 'STM32F103C8T6 ARM Cortex-M3 微控制器',
    shortDescription: '72MHz ARM Cortex-M3 内核，64KB Flash，20KB SRAM',
    description: 'STM32F103C8T6是一款基于ARM Cortex-M3内核的32位微控制器，主频72MHz，内置64KB Flash和20KB SRAM。广泛应用于消费电子、工业控制、医疗设备等领域。',
    brand: {
      id: 'stmicroelectronics',
      name: 'STMicroelectronics',
      slug: 'stmicroelectronics'
    },
    category: {
      id: 'mcu-32bit',
      name: '32位MCU',
      slug: '32bit-mcu'
    },
    specifications: {
      '内核': 'ARM Cortex-M3',
      '频率': '72MHz',
      'Flash': '64KB',
      'SRAM': '20KB',
      '工作电压': '2.0V-3.6V',
      '工作温度': '-40°C~85°C',
      '封装': 'LQFP48',
      'GPIO': 37,
      'ADC': '12-bit, 10通道',
      '定时器': '4个'
    },
    pricing: {
      tiers: [
        { quantity: 1, price: 18.80 },
        { quantity: 10, price: 17.20 },
        { quantity: 100, price: 15.60 },
        { quantity: 1000, price: 14.20 }
      ],
      currency: 'CNY'
    },
    inventory: {
      status: 'in_stock',
      quantity: 8000
    },
    package: 'LQFP48',
    tags: ['ARM', 'Cortex-M3', 'MCU', '32位', 'STM32', '经典款'],
    isActive: true,
  },
  {
    id: '3',
    partNumber: 'ESP32-WROOM-32',
    title: 'ESP32-WROOM-32 WiFi+蓝牙模块',
    shortDescription: '双核240MHz，WiFi+蓝牙，4MB Flash',
    description: 'ESP32-WROOM-32是一个功能强大、用途广泛的WiFi+蓝牙模块，采用ESP32系列芯片ESP32-D0WDQ6。该模块集成了天线和RF巴伦、功率放大器、低噪声接收放大器、滤波器、电源管理模块等功能。',
    brand: {
      id: 'espressif',
      name: 'Espressif Systems',
      slug: 'espressif'
    },
    category: {
      id: 'wifi-chips',
      name: 'WiFi芯片',
      slug: 'wifi-chips'
    },
    specifications: {
      '内核': 'Xtensa LX6双核',
      '频率': '240MHz',
      'Flash': '4MB',
      'SRAM': '520KB',
      'WiFi': '802.11 b/g/n',
      '蓝牙': 'v4.2 BR/EDR/BLE',
      '工作电压': '3.0V-3.6V',
      '工作温度': '-40°C~85°C',
      'GPIO': 34,
      'ADC': '12-bit SAR, 18通道'
    },
    pricing: {
      tiers: [
        { quantity: 1, price: 32.50 },
        { quantity: 10, price: 29.80 },
        { quantity: 100, price: 26.50 },
        { quantity: 1000, price: 23.80 }
      ],
      currency: 'CNY'
    },
    inventory: {
      status: 'in_stock',
      quantity: 3000
    },
    package: '模组',
    tags: ['ESP32', 'WiFi', '蓝牙', 'IoT', '双核', '无线通信'],
    isFeatured: true,
    isActive: true,
  },
  {
    id: '4',
    partNumber: 'TI-LM2596S-ADJ',
    title: 'LM2596S-ADJ 可调输出开关稳压器',
    shortDescription: '3A输出电流，可调输出电压，高效率DC-DC转换器',
    description: 'LM2596系列稳压器是单片集成电路，能够提供3A的驱动电流，同时具有优良的线性和负载调整特性。这些器件在固定输出版本中可提供3.3V、5V、12V等输出电压，可调版本可以输出小于37V的电压。',
    brand: {
      id: 'texas-instruments',
      name: 'Texas Instruments',
      slug: 'texas-instruments'
    },
    category: {
      id: 'dcdc-converters',
      name: 'DC-DC转换器',
      slug: 'dcdc-converters'
    },
    specifications: {
      '输入电压': '4V-40V',
      '输出电压': '1.2V-37V可调',
      '输出电流': '3A',
      '效率': '最高92%',
      '开关频率': '150kHz',
      '工作温度': '-40°C~125°C',
      '封装': 'TO-263-5',
      '调整率': '±0.5%',
      '纹波': '<100mV'
    },
    pricing: {
      tiers: [
        { quantity: 1, price: 8.50 },
        { quantity: 10, price: 7.80 },
        { quantity: 100, price: 6.90 },
        { quantity: 1000, price: 5.80 }
      ],
      currency: 'CNY'
    },
    inventory: {
      status: 'in_stock',
      quantity: 2000
    },
    package: 'TO-263-5',
    tags: ['电源管理', 'DC-DC', '开关稳压器', '可调输出', '高效率', 'TI'],
    isActive: true,
  },
  {
    id: '5',
    partNumber: 'BME280',
    title: 'BME280 数字温湿度气压传感器',
    shortDescription: '高精度温度、湿度、气压三合一传感器',
    description: 'BME280是一款针对移动应用而开发的环境传感器，可同时测量温度、湿度和气压。该传感器采用I2C或SPI数字接口，具有高精度和低功耗的特点。',
    brand: {
      id: 'bosch',
      name: 'Bosch',
      slug: 'bosch'
    },
    category: {
      id: 'sensors',
      name: '传感器',
      slug: 'sensors'
    },
    specifications: {
      '工作电压': '1.71V-3.6V',
      '接口': 'I2C/SPI',
      '温度范围': '-40°C~85°C',
      '温度精度': '±1°C',
      '湿度范围': '0-100%RH',
      '湿度精度': '±3%RH',
      '气压范围': '300-1100hPa',
      '气压精度': '±1hPa',
      '功耗': '3.4µA@1Hz',
      '封装': 'LGA-8'
    },
    pricing: {
      tiers: [
        { quantity: 1, price: 45.80 },
        { quantity: 10, price: 42.50 },
        { quantity: 100, price: 38.90 },
        { quantity: 1000, price: 35.20 }
      ],
      currency: 'CNY'
    },
    inventory: {
      status: 'in_stock',
      quantity: 1500
    },
    package: 'LGA-8',
    tags: ['传感器', '温度', '湿度', '气压', '三合一', 'I2C', 'SPI', '低功耗'],
    isNew: true,
    isActive: true,
  }
]

export const searchProducts = (
  products: Product[],
  query: string,
  filters: {
    brand?: string
    category?: string
    priceRange?: [number, number]
    inStock?: boolean
  } = {}
): Product[] => {
  let filteredProducts = products.filter(product => product.isActive)

  // Text search
  if (query.trim()) {
    const searchTerm = query.toLowerCase()
    filteredProducts = filteredProducts.filter(product => 
      product.partNumber.toLowerCase().includes(searchTerm) ||
      product.title.toLowerCase().includes(searchTerm) ||
      product.shortDescription.toLowerCase().includes(searchTerm) ||
      product.brand.name.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  // Brand filter
  if (filters.brand) {
    filteredProducts = filteredProducts.filter(product => 
      product.brand.slug === filters.brand
    )
  }

  // Category filter
  if (filters.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.slug === filters.category
    )
  }

  // Price range filter
  if (filters.priceRange) {
    const [minPrice, maxPrice] = filters.priceRange
    filteredProducts = filteredProducts.filter(product => {
      const price = product.pricing.tiers[0]?.price || 0
      return price >= minPrice && price <= maxPrice
    })
  }

  // In stock filter
  if (filters.inStock) {
    filteredProducts = filteredProducts.filter(product => 
      product.inventory.status === 'in_stock'
    )
  }

  return filteredProducts
}

export const getProductsByBrand = (brandSlug: string): Product[] => {
  return mockProducts.filter(product => 
    product.brand.slug === brandSlug && product.isActive
  )
}

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return mockProducts.filter(product => 
    product.category.slug === categorySlug && product.isActive
  )
}

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(product => 
    product.isFeatured && product.isActive
  )
}

export const getNewProducts = (): Product[] => {
  return mockProducts.filter(product => 
    product.isNew && product.isActive
  )
}

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id && product.isActive)
}

export const getProductByPartNumber = (partNumber: string): Product | undefined => {
  return mockProducts.find(product => 
    product.partNumber === partNumber && product.isActive
  )
}

export const getProductStats = () => {
  const activeProducts = mockProducts.filter(p => p.isActive)
  const inStockProducts = activeProducts.filter(p => p.inventory.status === 'in_stock')
  const brands = new Set(activeProducts.map(p => p.brand.slug))
  const categories = new Set(activeProducts.map(p => p.category.slug))
  
  return {
    total: activeProducts.length,
    inStock: inStockProducts.length,
    brands: brands.size,
    categories: categories.size,
    featured: activeProducts.filter(p => p.isFeatured).length,
    new: activeProducts.filter(p => p.isNew).length
  }
}