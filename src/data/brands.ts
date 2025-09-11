export interface Brand {
  id: string
  name: string
  slug: string
  description: string
  logo?: string
  website: string
  founded: string
  headquarters: string
  categories: string[]
  featured: boolean
  products: {
    categories: string[]
    count: number
  }
  keyTechnologies: string[]
  marketPosition: string
  partnership: 'authorized_distributor' | 'preferred_partner' | 'official_reseller'
}

export const brands: Brand[] = [
  {
    id: 'stmicroelectronics',
    name: 'STMicroelectronics',
    slug: 'stmicroelectronics',
    description: '全球领先的半导体公司，专注于为各种电子应用提供半导体解决方案。',
    website: 'https://www.st.com',
    founded: '1987',
    headquarters: '瑞士日内瓦',
    categories: ['微控制器', '处理器', '传感器', '功率器件', 'MEMS'],
    featured: true,
    products: {
      categories: ['MCU', 'MPU', 'Sensors', 'Power Management', 'Automotive'],
      count: 15000
    },
    keyTechnologies: ['ARM Cortex', 'MEMS传感器', '功率MOSFET', 'SiC器件'],
    marketPosition: '全球十大半导体公司',
    partnership: 'authorized_distributor'
  },
  {
    id: 'texas-instruments',
    name: 'Texas Instruments',
    slug: 'texas-instruments',
    description: '全球领先的模拟IC和数字信号处理器制造商，为各行业提供半导体技术。',
    website: 'https://www.ti.com',
    founded: '1930',
    headquarters: '美国德克萨斯州达拉斯',
    categories: ['模拟IC', 'DSP', '微控制器', '处理器', '接口IC'],
    featured: true,
    products: {
      categories: ['Analog', 'MCU', 'Processors', 'Wireless', 'Power Management'],
      count: 80000
    },
    keyTechnologies: ['MSP430', 'C2000', 'Sitara处理器', '高精度ADC'],
    marketPosition: '全球第三大半导体公司',
    partnership: 'authorized_distributor'
  },
  {
    id: 'analog-devices',
    name: 'Analog Devices',
    slug: 'analog-devices',
    description: '高性能模拟、混合信号和数字信号处理集成电路设计、制造和营销的全球领导者。',
    website: 'https://www.analog.com',
    founded: '1965',
    headquarters: '美国马萨诸塞州威明顿',
    categories: ['数据转换器', '放大器', '射频IC', '时钟管理', '接口IC'],
    featured: true,
    products: {
      categories: ['Data Converters', 'Amplifiers', 'RF/Microwave', 'Power Management'],
      count: 12000
    },
    keyTechnologies: ['高精度ADC/DAC', '射频收发器', '工业以太网', '隔离技术'],
    marketPosition: '模拟芯片市场领导者',
    partnership: 'preferred_partner'
  },
  {
    id: 'infineon',
    name: 'Infineon Technologies',
    slug: 'infineon',
    description: '全球领先的半导体解决方案供应商，专注于汽车、工业功率控制和安全应用。',
    website: 'https://www.infineon.com',
    founded: '1999',
    headquarters: '德国慕尼黑',
    categories: ['功率半导体', '微控制器', '传感器', '安全芯片', '射频器件'],
    featured: true,
    products: {
      categories: ['Power Semiconductors', 'MCU', 'Sensors', 'Security', 'RF'],
      count: 8000
    },
    keyTechnologies: ['SiC功率器件', 'AURIX微控制器', '雷达传感器', '安全芯片'],
    marketPosition: '功率半导体市场领导者',
    partnership: 'authorized_distributor'
  },
  {
    id: 'nxp',
    name: 'NXP Semiconductors',
    slug: 'nxp',
    description: '全球领先的安全连接解决方案供应商，为更智慧、更安全的世界创造解决方案。',
    website: 'https://www.nxp.com',
    founded: '2006',
    headquarters: '荷兰埃因霍温',
    categories: ['处理器', '微控制器', '连接IC', 'NFC芯片', '汽车芯片'],
    featured: true,
    products: {
      categories: ['Processors', 'MCU', 'Connectivity', 'Security', 'Automotive'],
      count: 10000
    },
    keyTechnologies: ['i.MX处理器', 'LPC微控制器', 'NFC技术', '汽车网关'],
    marketPosition: '汽车半导体市场第一',
    partnership: 'official_reseller'
  },
  {
    id: 'microchip',
    name: 'Microchip Technology',
    slug: 'microchip',
    description: '领先的混合信号、模拟和Flash-IP解决方案供应商，提供低风险的产品开发。',
    website: 'https://www.microchip.com',
    founded: '1989',
    headquarters: '美国亚利桑那州钱德勒',
    categories: ['微控制器', '模拟IC', '存储器', '接口IC', '时钟管理'],
    featured: true,
    products: {
      categories: ['MCU', 'Analog', 'Memory', 'Interface', 'Security'],
      count: 15000
    },
    keyTechnologies: ['PIC微控制器', 'AVR微控制器', 'EEPROM', '加密芯片'],
    marketPosition: '8位微控制器市场领导者',
    partnership: 'authorized_distributor'
  },
  {
    id: 'espressif',
    name: 'Espressif Systems',
    slug: 'espressif',
    description: '专业的无线通信芯片和解决方案供应商，致力于物联网应用。',
    website: 'https://www.espressif.com',
    founded: '2008',
    headquarters: '中国上海',
    categories: ['无线SoC', 'Wi-Fi芯片', '蓝牙芯片', '物联网模组', 'AI芯片'],
    featured: true,
    products: {
      categories: ['Wi-Fi SoC', 'Bluetooth', 'IoT Modules', 'AI Accelerators'],
      count: 50
    },
    keyTechnologies: ['ESP32系列', 'Wi-Fi 6', '蓝牙5.0', 'AI加速器'],
    marketPosition: 'IoT芯片市场重要厂商',
    partnership: 'official_reseller'
  },
  {
    id: 'qualcomm',
    name: 'Qualcomm',
    slug: 'qualcomm',
    description: '全球领先的无线通信技术研发公司，5G、4G LTE、处理器和IoT解决方案的领导者。',
    website: 'https://www.qualcomm.com',
    founded: '1985',
    headquarters: '美国加利福尼亚州圣地亚哥',
    categories: ['移动处理器', '射频芯片', '5G调制解调器', '物联网芯片'],
    featured: false,
    products: {
      categories: ['Mobile Processors', 'RF Front-end', '5G Modems', 'IoT'],
      count: 3000
    },
    keyTechnologies: ['骁龙处理器', '5G调制解调器', 'RF360', 'Adreno GPU'],
    marketPosition: '移动芯片市场领导者',
    partnership: 'preferred_partner'
  },
  {
    id: 'broadcom',
    name: 'Broadcom Inc.',
    slug: 'broadcom',
    description: '全球领先的半导体和基础设施软件解决方案供应商。',
    website: 'https://www.broadcom.com',
    founded: '1991',
    headquarters: '美国加利福尼亚州圣何塞',
    categories: ['射频芯片', '有线通信IC', '存储控制器', '光纤通信'],
    featured: false,
    products: {
      categories: ['RF/Microwave', 'Wired Infrastructure', 'Storage', 'Industrial'],
      count: 5000
    },
    keyTechnologies: ['Wi-Fi芯片', '以太网PHY', 'SAS控制器', '光纤收发器'],
    marketPosition: '射频芯片市场重要供应商',
    partnership: 'official_reseller'
  },
  {
    id: 'maxim-integrated',
    name: 'Maxim Integrated',
    slug: 'maxim-integrated',
    description: '高性能模拟和混合信号产品供应商，现为ADI公司的一部分。',
    website: 'https://www.maximintegrated.com',
    founded: '1983',
    headquarters: '美国加利福尼亚州圣何塞',
    categories: ['电源管理', '接口IC', '放大器', '传感器接口', 'RTC'],
    featured: false,
    products: {
      categories: ['Power Management', 'Interface', 'Amplifiers', 'Sensors'],
      count: 8000
    },
    keyTechnologies: ['开关稳压器', '电池管理', '温度传感器', 'USB控制器'],
    marketPosition: '模拟IC市场重要厂商',
    partnership: 'authorized_distributor'
  },
  {
    id: 'on-semiconductor',
    name: 'ON Semiconductor',
    slug: 'on-semiconductor',
    description: '推动节能创新的半导体供应商，帮助客户减少全球能源使用。',
    website: 'https://www.onsemi.com',
    founded: '1999',
    headquarters: '美国亚利桑那州凤凰城',
    categories: ['功率器件', '模拟IC', '传感器', '连接器件', 'SiC器件'],
    featured: false,
    products: {
      categories: ['Power', 'Analog', 'Sensors', 'Connectivity', 'SiC'],
      count: 12000
    },
    keyTechnologies: ['MOSFET', 'IGBT', '图像传感器', 'SiC二极管'],
    marketPosition: '功率器件市场重要供应商',
    partnership: 'preferred_partner'
  },
  {
    id: 'cypress',
    name: 'Cypress Semiconductor',
    slug: 'cypress',
    description: '嵌入式系统解决方案的领先供应商，现为Infineon公司的一部分。',
    website: 'https://www.cypress.com',
    founded: '1982',
    headquarters: '美国加利福尼亚州圣何塞',
    categories: ['微控制器', '无线连接', '存储器', 'USB控制器', 'PSoC'],
    featured: false,
    products: {
      categories: ['MCU', 'Wireless', 'Memory', 'USB', 'PSoC'],
      count: 6000
    },
    keyTechnologies: ['PSoC可编程系统', 'Wi-Fi芯片', 'NOR闪存', 'USB-C控制器'],
    marketPosition: '可编程系统芯片领导者',
    partnership: 'official_reseller'
  }
];

export const getFeaturedBrands = (): Brand[] => {
  return brands.filter(brand => brand.featured);
};

export const getBrandBySlug = (slug: string): Brand | undefined => {
  return brands.find(brand => brand.slug === slug);
};

export const getBrandsByCategory = (category: string): Brand[] => {
  return brands.filter(brand =>
    brand.categories.some(cat =>
      cat.toLowerCase().includes(category.toLowerCase())
    )
  );
};

export const getAllBrands = (): Brand[] => {
  return brands;
};

export const getBrandStats = () => {
  return {
    total: brands.length,
    featured: brands.filter(b => b.featured).length,
    authorized: brands.filter(b => b.partnership === 'authorized_distributor').length,
    totalProducts: brands.reduce((sum, brand) => sum + brand.products.count, 0)
  };
};
