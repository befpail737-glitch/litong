// 品牌静态数据配置 - 用于fallback和前端展示
// 这些数据来自原先的硬编码，现在作为配置管理

export interface StaticBrandData {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  website: string;
  founded: string;
  headquarters: string;
  categories: string[];
  featured: boolean;
  products: {
    categories: string[];
    count: number;
  };
  keyTechnologies: string[];
  marketPosition: string;
  partnership: 'authorized_distributor' | 'preferred_partner' | 'official_reseller';
}

// 核心品牌配置数据 - 从Sanity CMS不可用时的备用数据
export const CORE_BRAND_DATA: StaticBrandData[] = [
  {
    id: 'cree',
    name: 'Cree',
    slug: 'cree',
    description: 'LED照明和碳化硅功率器件的创新者',
    website: 'https://www.cree.com',
    founded: '1987',
    headquarters: '美国北卡罗来纳州',
    categories: ['LED', 'SiC器件', '功率电子'],
    featured: true,
    products: {
      categories: ['LED', 'SiC MOSFET', 'SiC Diode'],
      count: 500
    },
    keyTechnologies: ['碳化硅', 'LED技术', '宽禁带半导体'],
    marketPosition: 'SiC功率器件领导者',
    partnership: 'authorized_distributor'
  },
  {
    id: 'infineon',
    name: 'Infineon',
    slug: 'infineon',
    description: '功率半导体、汽车电子和安全解决方案的全球领导者',
    website: 'https://www.infineon.com',
    founded: '1999',
    headquarters: '德国慕尼黑',
    categories: ['功率半导体', '汽车电子', '安全芯片'],
    featured: true,
    products: {
      categories: ['MOSFET', 'IGBT', 'MCU', 'Security'],
      count: 8000
    },
    keyTechnologies: ['IGBT', 'CoolMOS', 'AURIX MCU'],
    marketPosition: '全球功率半导体第一',
    partnership: 'authorized_distributor'
  },
  {
    id: 'ti',
    name: 'Texas Instruments',
    slug: 'ti',
    description: '全球领先的模拟IC和数字信号处理器制造商',
    website: 'https://www.ti.com',
    founded: '1930',
    headquarters: '美国德克萨斯州达拉斯',
    categories: ['模拟IC', 'DSP', '微控制器'],
    featured: true,
    products: {
      categories: ['Analog', 'MCU', 'DSP', 'Power Management'],
      count: 12000
    },
    keyTechnologies: ['模拟信号链', 'C2000 MCU', 'DSP处理器'],
    marketPosition: '模拟IC市场领导者',
    partnership: 'authorized_distributor'
  },
  {
    id: 'stmicroelectronics',
    name: 'STMicroelectronics',
    slug: 'stmicroelectronics',
    description: '全球领先的半导体公司，专注于各种电子应用的半导体解决方案',
    website: 'https://www.st.com',
    founded: '1987',
    headquarters: '瑞士日内瓦',
    categories: ['微控制器', '传感器', '功率器件'],
    featured: true,
    products: {
      categories: ['MCU', 'Sensors', 'Power', 'Automotive'],
      count: 15000
    },
    keyTechnologies: ['STM32', 'MEMS传感器', 'SiC器件'],
    marketPosition: '全球十大半导体公司',
    partnership: 'authorized_distributor'
  },
  {
    id: 'lem',
    name: 'LEM',
    slug: 'lem',
    description: '电流和电压测量解决方案的市场领导者',
    website: 'https://www.lem.com',
    founded: '1972',
    headquarters: '瑞士日内瓦',
    categories: ['电流传感器', '电压传感器', '功率测量'],
    featured: false,
    products: {
      categories: ['Current Sensors', 'Voltage Sensors', 'Power Meters'],
      count: 200
    },
    keyTechnologies: ['霍尔效应', 'Rogowski线圈', '磁通门技术'],
    marketPosition: '电流传感器市场领导者',
    partnership: 'authorized_distributor'
  },
  {
    id: 'qualcomm',
    name: 'Qualcomm',
    slug: 'qualcomm',
    description: '无线技术创新和5G解决方案的全球领导者',
    website: 'https://www.qualcomm.com',
    founded: '1985',
    headquarters: '美国圣地亚哥',
    categories: ['移动处理器', '5G芯片', '无线通信'],
    featured: true,
    products: {
      categories: ['Snapdragon', '5G Modem', 'WiFi', 'Bluetooth'],
      count: 1000
    },
    keyTechnologies: ['5G', 'AI处理', '移动计算'],
    marketPosition: '移动芯片市场领导者',
    partnership: 'official_reseller'
  },
  {
    id: 'mediatek',
    name: 'MediaTek',
    slug: 'mediatek',
    description: '全球无晶圆厂半导体公司，专注于无线通信及数字多媒体解决方案',
    website: 'https://www.mediatek.com',
    founded: '1997',
    headquarters: '中国台湾新竹',
    categories: ['移动处理器', 'WiFi芯片', '智能电视芯片'],
    featured: false,
    products: {
      categories: ['Dimensity', 'Helio', 'WiFi', 'Smart TV'],
      count: 800
    },
    keyTechnologies: ['Dimensity 5G', 'AIoT平台', '智能连接'],
    marketPosition: '全球第四大芯片设计公司',
    partnership: 'preferred_partner'
  }
];

// 获取核心品牌slug列表
export function getCoreBrandSlugs(): string[] {
  return CORE_BRAND_DATA.map(brand => brand.slug);
}

// 获取特色品牌数据
export function getFeaturedBrandData(): StaticBrandData[] {
  return CORE_BRAND_DATA.filter(brand => brand.featured);
}

// 根据slug获取品牌数据
export function getBrandDataBySlug(slug: string): StaticBrandData | null {
  return CORE_BRAND_DATA.find(brand => brand.slug === slug) || null;
}

// 获取品牌统计信息
export function getBrandStats() {
  const total = CORE_BRAND_DATA.length;
  const featured = CORE_BRAND_DATA.filter(brand => brand.featured).length;
  const totalProducts = CORE_BRAND_DATA.reduce((sum, brand) => sum + brand.products.count, 0);

  return {
    total,
    featured,
    totalProducts,
    averageProducts: Math.round(totalProducts / total)
  };
}