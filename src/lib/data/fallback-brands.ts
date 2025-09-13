// Fallback品牌数据 - 当Sanity CMS不可用时使用
export interface FallbackBrand {
  _id: string;
  name: string;
  description?: string;
  website?: string;
  country?: string;
  headquarters?: string;
  established?: string;
  isActive: boolean;
  isFeatured?: boolean;
  slug?: string;
  logo?: string; // 静态logo路径
}

export const fallbackBrands: FallbackBrand[] = [
  {
    _id: 'fallback-stm',
    name: 'STMicroelectronics',
    description: '全球领先的半导体供应商，专注于微控制器、传感器和功率器件',
    website: 'https://www.st.com',
    country: '瑞士',
    headquarters: '日内瓦',
    established: '1987',
    isActive: true,
    isFeatured: true,
    slug: 'stmicroelectronics',
    logo: '/logos/stm.png'
  },
  {
    _id: 'fallback-ti',
    name: 'Texas Instruments',
    description: '模拟IC和嵌入式处理器制造商，提供创新的半导体解决方案',
    website: 'https://www.ti.com',
    country: '美国',
    headquarters: '达拉斯',
    established: '1930',
    isActive: true,
    isFeatured: true,
    slug: 'texas-instruments',
    logo: '/logos/ti.png'
  },
  {
    _id: 'fallback-espressif',
    name: 'Espressif Systems',
    description: 'WiFi和蓝牙芯片领先厂商，IoT解决方案的创新者',
    website: 'https://www.espressif.com',
    country: '中国',
    headquarters: '上海',
    established: '2008',
    isActive: true,
    isFeatured: true,
    slug: 'espressif',
    logo: '/logos/espressif.png'
  },
  {
    _id: 'fallback-infineon',
    name: 'Infineon Technologies',
    description: '功率半导体、汽车电子和安全解决方案的全球领导者',
    website: 'https://www.infineon.com',
    country: '德国',
    headquarters: '慕尼黑',
    established: '1999',
    isActive: true,
    isFeatured: true,
    slug: 'infineon',
    logo: '/logos/infineon.png'
  },
  {
    _id: 'fallback-nxp',
    name: 'NXP Semiconductors',
    description: '安全连接解决方案领域的全球领导者',
    website: 'https://www.nxp.com',
    country: '荷兰',
    headquarters: '埃因霍温',
    established: '2006',
    isActive: true,
    isFeatured: false,
    slug: 'nxp',
    logo: '/logos/nxp.png'
  },
  {
    _id: 'fallback-microchip',
    name: 'Microchip Technology',
    description: '微控制器、混合信号、模拟和Flash-IP解决方案提供商',
    website: 'https://www.microchip.com',
    country: '美国',
    headquarters: '钱德勒',
    established: '1989',
    isActive: true,
    isFeatured: false,
    slug: 'microchip',
    logo: '/logos/microchip.png'
  },
  {
    _id: 'fallback-adi',
    name: 'Analog Devices',
    description: '高性能模拟、混合信号和数字信号处理解决方案',
    website: 'https://www.analog.com',
    country: '美国',
    headquarters: '马萨诸塞州',
    established: '1965',
    isActive: true,
    isFeatured: false,
    slug: 'analog-devices',
    logo: '/logos/adi.png'
  },
  {
    _id: 'fallback-maxim',
    name: 'Maxim Integrated',
    description: '模拟和混合信号半导体产品设计制造商',
    website: 'https://www.maximintegrated.com',
    country: '美国',
    headquarters: '加利福尼亚州',
    established: '1983',
    isActive: true,
    isFeatured: false,
    slug: 'maxim',
    logo: '/logos/maxim.png'
  },
  {
    _id: 'fallback-nordic',
    name: 'Nordic Semiconductor',
    description: '超低功耗无线通信解决方案的领先供应商',
    website: 'https://www.nordicsemi.com',
    country: '挪威',
    headquarters: '特隆赫姆',
    established: '1983',
    isActive: true,
    isFeatured: false,
    slug: 'nordic',
    logo: '/logos/nordic.png'
  },
  {
    _id: 'fallback-cypress',
    name: 'Cypress Semiconductor',
    description: '可编程系统级芯片解决方案的创新领导者',
    website: 'https://www.cypress.com',
    country: '美国',
    headquarters: '加利福尼亚州',
    established: '1982',
    isActive: true,
    isFeatured: false,
    slug: 'cypress',
    logo: '/logos/cypress.png'
  },
  {
    _id: 'fallback-renesas',
    name: 'Renesas Electronics',
    description: '汽车、工业、基础设施和物联网应用的半导体解决方案',
    website: 'https://www.renesas.com',
    country: '日本',
    headquarters: '东京',
    established: '2010',
    isActive: true,
    isFeatured: false,
    slug: 'renesas',
    logo: '/logos/renesas.png'
  },
  {
    _id: 'fallback-on',
    name: 'ON Semiconductor',
    description: '智能电源和感知技术的领先供应商',
    website: 'https://www.onsemi.com',
    country: '美国',
    headquarters: '亚利桑那州',
    established: '1999',
    isActive: true,
    isFeatured: false,
    slug: 'on-semiconductor',
    logo: '/logos/onsemi.png'
  },
  {
    _id: 'fallback-lattice',
    name: 'Lattice Semiconductor',
    description: '低功耗可编程解决方案的领先供应商',
    website: 'https://www.latticesemi.com',
    country: '美国',
    headquarters: '加利福尼亚州',
    established: '1983',
    isActive: true,
    isFeatured: false,
    slug: 'lattice',
    logo: '/logos/lattice.png'
  },
  {
    _id: 'fallback-xilinx',
    name: 'AMD Xilinx',
    description: '自适应和智能计算领域的领导者',
    website: 'https://www.xilinx.com',
    country: '美国',
    headquarters: '加利福尼亚州',
    established: '1984',
    isActive: true,
    isFeatured: false,
    slug: 'xilinx',
    logo: '/logos/xilinx.png'
  },
  {
    _id: 'fallback-qualcomm',
    name: 'Qualcomm',
    description: '无线技术创新和5G解决方案的全球领导者',
    website: 'https://www.qualcomm.com',
    country: '美国',
    headquarters: '圣地亚哥',
    established: '1985',
    isActive: true,
    isFeatured: true,
    slug: 'qualcomm',
    logo: '/logos/qualcomm.png'
  },
  {
    _id: 'fallback-broadcom',
    name: 'Broadcom',
    description: '全球领先的半导体和基础设施软件解决方案供应商',
    website: 'https://www.broadcom.com',
    country: '美国',
    headquarters: '加利福尼亚州',
    established: '1991',
    isActive: true,
    isFeatured: false,
    slug: 'broadcom',
    logo: '/logos/broadcom.png'
  }
];

// 获取所有fallback品牌
export function getAllFallbackBrands(): FallbackBrand[] {
  return fallbackBrands.filter(brand => brand.isActive);
}

// 获取特色fallback品牌
export function getFeaturedFallbackBrands(): FallbackBrand[] {
  return fallbackBrands.filter(brand => brand.isActive && brand.isFeatured);
}

// 根据slug获取品牌
export function getFallbackBrandBySlug(slug: string): FallbackBrand | null {
  return fallbackBrands.find(brand => brand.slug === slug) || null;
}

// 品牌统计
export function getFallbackBrandStats() {
  const activeBrands = fallbackBrands.filter(brand => brand.isActive);
  const featuredBrands = activeBrands.filter(brand => brand.isFeatured);
  
  return {
    total: activeBrands.length,
    authorized: featuredBrands.length,
    totalProducts: activeBrands.length * 1000 // 估算产品数量
  };
}