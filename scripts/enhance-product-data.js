/**
 * 产品数据增强脚本
 * 为现有产品添加详细的技术规格、特性和描述
 */

const { createClient } = require('@sanity/client');

// Sanity 客户端配置
const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

// 增强的产品数据映射
const productEnhancements = {
  // Cree/Wolfspeed 产品增强
  '11111': {
    name: 'C3M0065090D SiC MOSFET',
    partNumber: 'C3M0065090D',
    description: '650V, 90mΩ Silicon Carbide Power MOSFET, TO-247-3封装，专为高效率电源转换而设计',
    shortDescription: '650V 90mΩ SiC MOSFET，具有卓越的开关性能和热管理能力',
    specifications: {
      '电压额定值': '650V',
      'RDS(on)': '90mΩ @ VGS = 18V',
      '连续漏电流': '22A @ TC = 25°C',
      '脉冲漏电流': '88A',
      '栅极电压': '±25V',
      '封装类型': 'TO-247-3',
      '工作温度': '-55°C to +175°C',
      '热阻抗': '1.4°C/W (junction-to-case)'
    },
    features: [
      '超低开关损耗',
      '快速开关速度',
      '低栅极电荷',
      '雪崩能量额定值',
      '简单的栅极驱动要求',
      'MSL等级1（无限制货架寿命）'
    ],
    applications: [
      '服务器和数据中心电源',
      '工业电机驱动',
      '太阳能逆变器',
      '电动汽车充电桩',
      'UPS不间断电源'
    ],
    datasheet: '/datasheets/cree/C3M0065090D.pdf',
    category: 'power-semiconductors',
    subCategory: 'sic-mosfets'
  },

  '55555': {
    name: 'C2M0080120D SiC MOSFET',
    partNumber: 'C2M0080120D',
    description: '1200V, 80mΩ Silicon Carbide Power MOSFET，专为高压大功率应用设计',
    shortDescription: '1200V 80mΩ SiC MOSFET，提供出色的效率和可靠性',
    specifications: {
      '电压额定值': '1200V',
      'RDS(on)': '80mΩ @ VGS = 18V',
      '连续漏电流': '25A @ TC = 25°C',
      '脉冲漏电流': '100A',
      '栅极电压': '±25V',
      '封装类型': 'TO-247-3',
      '工作温度': '-55°C to +175°C',
      '热阻抗': '1.2°C/W (junction-to-case)'
    },
    features: [
      '1200V高压能力',
      '极低的开关损耗',
      '高温稳定性',
      '快速体二极管恢复',
      '低栅极电荷',
      '无反向恢复电流'
    ],
    applications: [
      '光伏逆变器',
      '电动汽车牵引逆变器',
      '工业电机控制',
      '高频开关电源',
      '风力发电变流器'
    ],
    datasheet: '/datasheets/cree/C2M0080120D.pdf',
    category: 'power-semiconductors',
    subCategory: 'sic-mosfets'
  },

  // LEM 传感器产品增强
  'la25-p': {
    name: 'LA 25-P 电流传感器',
    partNumber: 'LA 25-P',
    description: '紧凑型PCB安装电流传感器，基于霍尔效应原理，用于DC、AC和脉冲电流测量',
    shortDescription: '±25A 闭环霍尔效应电流传感器',
    specifications: {
      '标称电流': '25A',
      '最大电流': '50A',
      '测量范围': '0 to ±50A',
      '精度': '±0.5%',
      '偏移': '±0.2mA',
      '线性度': '< 0.1%',
      '响应时间': '< 1µs',
      '电源电压': '±15V ±5%',
      '工作温度': '-25°C to +85°C',
      '封装': 'PCB安装',
      '绝缘电压': '2.5kV rms/50Hz/1min'
    },
    features: [
      '紧凑设计',
      '优异的精度',
      '宽频带响应',
      '低功耗',
      '电流隔离',
      '免疫外部磁场干扰'
    ],
    applications: [
      '变频器',
      '开关电源',
      '电机控制',
      '焊接设备',
      '不间断电源',
      '电池管理系统'
    ],
    datasheet: '/datasheets/lem/LA25-P.pdf',
    category: 'sensors',
    subCategory: 'current-sensors'
  },

  'la35-p': {
    name: 'LA 35-P 电流传感器',
    partNumber: 'LA 35-P',
    description: '中等功率应用的PCB安装电流传感器，提供精确的电流测量和优异的线性度',
    shortDescription: '±35A 闭环霍尔效应电流传感器',
    specifications: {
      '标称电流': '35A',
      '最大电流': '70A',
      '测量范围': '0 to ±70A',
      '精度': '±0.5%',
      '偏移': '±0.3mA',
      '线性度': '< 0.1%',
      '响应时间': '< 1µs',
      '电源电压': '±15V ±5%',
      '工作温度': '-25°C to +85°C',
      '封装': 'PCB安装',
      '绝缘电压': '2.5kV rms/50Hz/1min'
    },
    features: [
      '35A标称电流',
      '高精度测量',
      '快速响应',
      '紧凑封装',
      '宽工作温度范围',
      '长期稳定性'
    ],
    applications: [
      '工业驱动器',
      'AC/DC转换器',
      '电动工具',
      '充电器',
      '逆变器',
      '电流监控系统'
    ],
    datasheet: '/datasheets/lem/LA35-P.pdf',
    category: 'sensors',
    subCategory: 'current-sensors'
  },

  // Electronicon 电容器增强
  '99999': {
    name: 'E62 系列 AC滤波电容器',
    partNumber: 'E62.Q71-104E10',
    description: '高性能交流滤波电容器，专为工业应用中的功率因数校正和谐波滤波设计',
    shortDescription: '100µF 1000V AC滤波电容器，金属化聚丙烯薄膜',
    specifications: {
      '电容值': '100µF',
      '额定电压': '1000V AC',
      '频率': '50/60Hz',
      '介质': '金属化聚丙烯薄膜',
      '容差': '±5%',
      '介质损耗': '≤ 0.05%',
      '绝缘电阻': '≥ 30000MΩ·µF',
      '工作温度': '-40°C to +85°C',
      '安装方式': '螺栓固定',
      '防护等级': 'IP20'
    },
    features: [
      '自愈性能',
      '低损耗',
      '高稳定性',
      '长寿命设计',
      '阻燃外壳',
      '内置放电电阻'
    ],
    applications: [
      '功率因数校正',
      '谐波滤波',
      '电机启动',
      '变频器DC滤波',
      '感应加热设备',
      '风力发电'
    ],
    datasheet: '/datasheets/electronicon/E62-series.pdf',
    category: 'passive-components',
    subCategory: 'ac-capacitors'
  },

  '33333': {
    name: 'E53 系列 DC支撑电容器',
    partNumber: 'E53.F8-683K25',
    description: '高可靠性DC支撑电容器，采用金属化聚丙烯薄膜介质，适用于逆变器直流环节',
    shortDescription: '6800µF 2500V DC支撑电容器',
    specifications: {
      '电容值': '6800µF',
      '额定电压': '2500V DC',
      '介质': '金属化聚丙烯薄膜',
      '容差': '±10%',
      '介质损耗': '≤ 0.05%',
      '绝缘电阻': '≥ 5000MΩ·µF',
      '工作温度': '-40°C to +85°C',
      '安装方式': '螺栓固定',
      '冷却方式': '自然对流/强制风冷'
    },
    features: [
      '高能量密度',
      '优异的自愈特性',
      '低ESR值',
      '长期稳定性',
      '内置温度监控',
      '过压保护'
    ],
    applications: [
      '光伏逆变器',
      '风力发电变流器',
      '电动汽车充电桩',
      'UPS系统',
      '电机驱动器',
      '工业电源'
    ],
    datasheet: '/datasheets/electronicon/E53-series.pdf',
    category: 'passive-components',
    subCategory: 'dc-capacitors'
  },

  // TI 运算放大器增强
  'opa2134pa': {
    name: 'OPA2134 双路音频运算放大器',
    partNumber: 'OPA2134PA',
    description: '高性能、低噪声、双路JFET输入运算放大器，专为专业音频和高精度应用设计',
    shortDescription: '高性能双路音频运算放大器，低噪声JFET输入',
    specifications: {
      '运放数量': '双路',
      '输入类型': 'JFET',
      '电源电压': '±4.5V to ±18V',
      '输入偏置电流': '5pA (典型值)',
      '输入失调电压': '150µV (最大值)',
      '增益带宽积': '8MHz',
      '转换速率': '20V/µs',
      '输入噪声电压': '8nV/√Hz @ 1kHz',
      '工作温度': '-40°C to +85°C',
      '封装': 'PDIP-8'
    },
    features: [
      '超低噪声性能',
      'JFET输入高阻抗',
      '优异的音频性能',
      '宽电源电压范围',
      '单位增益稳定',
      '低失真'
    ],
    applications: [
      '专业音频设备',
      '高精度数据采集',
      '医疗仪器',
      '测试测量设备',
      '传感器信号调理',
      '高保真音响'
    ],
    datasheet: '/datasheets/ti/OPA2134.pdf',
    category: 'analog-ics',
    subCategory: 'operational-amplifiers'
  },

  // STM32 微控制器增强
  'stm32f407vgt6': {
    name: 'STM32F407VGT6 微控制器',
    partNumber: 'STM32F407VGT6',
    description: '基于ARM Cortex-M4F内核的高性能微控制器，具有DSP和FPU功能',
    shortDescription: '168MHz ARM Cortex-M4F微控制器，1MB Flash',
    specifications: {
      '内核': 'ARM Cortex-M4F',
      '最高频率': '168MHz',
      'Flash存储器': '1024KB',
      'SRAM': '192KB',
      '工作电压': '1.8V to 3.6V',
      'I/O端口': '114个',
      '定时器': '17个',
      'ADC': '3x 12位',
      'DAC': '2x 12位',
      '通信接口': 'SPI, I²C, UART, USB, CAN, Ethernet',
      '封装': 'LQFP-100',
      '工作温度': '-40°C to +85°C'
    },
    features: [
      'ARM Cortex-M4F内核',
      '单精度FPU',
      'DSP指令集',
      '丰富的外设',
      '以太网MAC',
      'USB OTG',
      '加密硬件加速器',
      '低功耗模式'
    ],
    applications: [
      '工业控制',
      '电机控制',
      '医疗设备',
      '消费电子',
      '物联网网关',
      '音频处理',
      '图形界面',
      '通信设备'
    ],
    datasheet: '/datasheets/st/STM32F407.pdf',
    category: 'microcontrollers',
    subCategory: 'arm-cortex-m4'
  },

  // Semikron IGBT模块增强
  'SKKT106/16E': {
    name: 'SKKT106/16E 双路IGBT模块',
    partNumber: 'SKKT106/16E',
    description: '1600V/100A双路IGBT功率模块，采用第四代IGBT技术，具有优异的开关特性',
    shortDescription: '1600V 100A 双路IGBT模块',
    specifications: {
      '电压等级': '1600V',
      '电流等级': '100A',
      '配置': '双路IGBT + 反并联二极管',
      'VCE(sat)': '2.1V @ IC=100A',
      '开关时间': 'toff = 0.2µs',
      '工作温度': '-40°C to +125°C',
      '绝缘电压': '2.5kV AC/1min',
      '封装': 'TOP3 (TO-247)',
      '热阻抗': '0.35K/W (junction-to-case)'
    },
    features: [
      '第四代IGBT技术',
      '低导通损耗',
      '快速开关',
      '优异的短路耐受能力',
      '温度稳定性',
      '可靠的焊接连接'
    ],
    applications: [
      '电机驱动器',
      '逆变器',
      'UPS系统',
      '焊接设备',
      '感应加热',
      '开关电源'
    ],
    datasheet: '/datasheets/semikron/SKKT106-16E.pdf',
    category: 'power-semiconductors',
    subCategory: 'igbt-modules'
  }
};

// 品牌信息增强
const brandEnhancements = {
  cree: {
    name: 'Wolfspeed (formerly Cree)',
    description: '全球领先的碳化硅(SiC)和氮化镓(GaN)功率半导体解决方案提供商，专注于高效能源转换技术',
    website: 'https://www.wolfspeed.com',
    country: '美国',
    headquarters: '美国北卡罗来纳州达勒姆',
    established: '1987',
    keyProducts: ['SiC MOSFET', 'SiC二极管', 'GaN器件', 'RF功率器件'],
    certifications: ['ISO 9001', 'ISO 14001', 'IATF 16949']
  },
  lem: {
    name: 'LEM',
    description: '电流和电压测量解决方案的全球领导者，为工业、汽车和能源领域提供创新的传感器产品',
    website: 'https://www.lem.com',
    country: '瑞士',
    headquarters: '瑞士日内瓦',
    established: '1972',
    keyProducts: ['电流传感器', '电压传感器', '功率测量模块', '电能质量监测'],
    certifications: ['ISO 9001', 'ISO 14001', 'IATF 16949']
  },
  Electronicon: {
    name: 'ELECTRONICON Kondensatoren',
    description: '专业电容器制造商，为电力电子、可再生能源和工业应用提供高品质的电容器解决方案',
    website: 'https://www.electronicon.com',
    country: '德国',
    headquarters: '德国盖拉',
    established: '1990',
    keyProducts: ['AC电容器', 'DC支撑电容器', '滤波电容器', '功率因数校正电容器'],
    certifications: ['ISO 9001', 'UL', 'VDE']
  },
  ti: {
    name: 'Texas Instruments',
    description: '全球领先的半导体设计制造公司，专注于模拟IC和嵌入式处理器解决方案',
    website: 'https://www.ti.com',
    country: '美国',
    headquarters: '美国德克萨斯州达拉斯',
    established: '1930',
    keyProducts: ['运算放大器', '电源管理IC', '微控制器', '数字信号处理器'],
    certifications: ['ISO 9001', 'ISO 14001', 'IATF 16949']
  },
  stmicroelectronics: {
    name: 'STMicroelectronics',
    description: '全球领先的半导体解决方案供应商，为物联网、智能驾驶、工业和消费电子提供创新产品',
    website: 'https://www.st.com',
    country: '荷兰',
    headquarters: '荷兰阿姆斯特丹',
    established: '1987',
    keyProducts: ['微控制器', '传感器', 'MEMS', '功率器件'],
    certifications: ['ISO 9001', 'ISO 14001', 'IATF 16949']
  },
  semikron: {
    name: 'SEMIKRON',
    description: '功率电子领域的先驱，为工业驱动、可再生能源和电动出行提供可靠的功率模块和系统',
    website: 'https://www.semikron.com',
    country: '德国',
    headquarters: '德国纽伦堡',
    established: '1951',
    keyProducts: ['IGBT模块', '功率集成模块', '驱动器', '功率电子系统'],
    certifications: ['ISO 9001', 'ISO 14001', 'IATF 16949']
  }
};

/**
 * 增强单个产品数据
 */
async function enhanceProduct(productId, enhancements) {
  try {
    console.log(`🔧 正在增强产品: ${productId}`);

    const patch = client.patch(productId);

    // 更新产品信息
    Object.entries(enhancements).forEach(([field, value]) => {
      if (field !== 'specifications') {
        patch.set({ [field]: value });
      }
    });

    // 特殊处理specifications对象
    if (enhancements.specifications) {
      patch.set({ specifications: enhancements.specifications });
    }

    const result = await patch.commit();
    console.log(`✅ 产品 ${productId} 增强完成`);
    return result;
  } catch (error) {
    console.error(`❌ 增强产品 ${productId} 失败:`, error);
    return null;
  }
}

/**
 * 增强品牌数据
 */
async function enhanceBrand(brandSlug, enhancements) {
  try {
    console.log(`🔧 正在增强品牌: ${brandSlug}`);

    // 查找品牌
    const brandQuery = `*[_type == "brandBasic" && slug.current == $slug][0]`;
    const brand = await client.fetch(brandQuery, { slug: brandSlug });

    if (!brand) {
      console.warn(`⚠️ 品牌未找到: ${brandSlug}`);
      return null;
    }

    const patch = client.patch(brand._id);

    // 更新品牌信息
    Object.entries(enhancements).forEach(([field, value]) => {
      patch.set({ [field]: value });
    });

    const result = await patch.commit();
    console.log(`✅ 品牌 ${brandSlug} 增强完成`);
    return result;
  } catch (error) {
    console.error(`❌ 增强品牌 ${brandSlug} 失败:`, error);
    return null;
  }
}

/**
 * 主函数：执行所有数据增强
 */
async function main() {
  console.log('🚀 开始产品和品牌数据增强...');

  try {
    // 获取需要增强的产品
    const productsQuery = `*[_type == "product" && slug.current in $slugs] {
      _id,
      "slug": slug.current,
      name,
      partNumber
    }`;

    const productSlugs = Object.keys(productEnhancements);
    const products = await client.fetch(productsQuery, { slugs: productSlugs });

    console.log(`📊 找到 ${products.length} 个产品需要增强`);

    // 增强产品数据
    for (const product of products) {
      const enhancements = productEnhancements[product.slug];
      if (enhancements) {
        await enhanceProduct(product._id, enhancements);
      }
    }

    // 增强品牌数据
    for (const [brandSlug, brandData] of Object.entries(brandEnhancements)) {
      await enhanceBrand(brandSlug, brandData);
    }

    console.log('✅ 所有数据增强完成！');

  } catch (error) {
    console.error('❌ 数据增强过程中出现错误:', error);
    process.exit(1);
  }
}

// 仅在直接运行时执行
if (require.main === module) {
  main();
}

module.exports = {
  enhanceProduct,
  enhanceBrand,
  productEnhancements,
  brandEnhancements
};