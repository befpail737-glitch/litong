const sanityClient = require('@sanity/client');

// Sanity client configuration
const client = sanityClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-01',
  token: process.env.SANITY_TOKEN, // 需要写入权限的token
  useCdn: false,
});

// 示例富文本产品描述数据
const sampleRichTextDescription = [
  {
    _type: 'block',
    children: [{
      _type: 'span',
      text: 'STM32F407VGT6是STMicroelectronics推出的高性能ARM Cortex-M4微控制器，专为嵌入式应用设计。'
    }],
    style: 'normal'
  },
  {
    _type: 'block',
    children: [{
      _type: 'span',
      text: '主要特性'
    }],
    style: 'h2'
  },
  {
    _type: 'block',
    children: [{
      _type: 'span',
      text: '高性能ARM Cortex-M4内核，主频高达168MHz'
    }],
    listItem: 'bullet',
    style: 'normal'
  },
  {
    _type: 'block',
    children: [{
      _type: 'span',
      text: '1MB Flash存储器和192KB SRAM'
    }],
    listItem: 'bullet',
    style: 'normal'
  },
  {
    _type: 'block',
    children: [{
      _type: 'span',
      text: '丰富的外设接口：USB、CAN、I2C、SPI、UART等'
    }],
    listItem: 'bullet',
    style: 'normal'
  },
  {
    _type: 'block',
    children: [{
      _type: 'span',
      text: '内置浮点运算单元(FPU)'
    }],
    listItem: 'bullet',
    style: 'normal'
  },
  {
    _type: 'block',
    children: [{
      _type: 'span',
      text: '技术规格'
    }],
    style: 'h2'
  },
  {
    _type: 'table',
    title: '主要技术参数',
    hasHeader: true,
    rows: [
      {
        cells: ['参数', '规格', '单位']
      },
      {
        cells: ['内核', 'ARM Cortex-M4', '-']
      },
      {
        cells: ['主频', '168', 'MHz']
      },
      {
        cells: ['Flash存储器', '1024', 'KB']
      },
      {
        cells: ['SRAM', '192', 'KB']
      },
      {
        cells: ['工作电压', '1.8-3.6', 'V']
      },
      {
        cells: ['工作温度', '-40~+85', '°C']
      },
      {
        cells: ['封装', 'LQFP100', '-']
      }
    ]
  },
  {
    _type: 'block',
    children: [{
      _type: 'span',
      text: '应用领域'
    }],
    style: 'h2'
  },
  {
    _type: 'block',
    children: [{
      _type: 'span',
      text: '该微控制器广泛应用于',
      marks: []
    }, {
      _type: 'span',
      text: '工业自动化',
      marks: ['strong']
    }, {
      _type: 'span',
      text: '、',
      marks: []
    }, {
      _type: 'span',
      text: '物联网设备',
      marks: ['strong']
    }, {
      _type: 'span',
      text: '、',
      marks: []
    }, {
      _type: 'span',
      text: '医疗设备',
      marks: ['strong']
    }, {
      _type: 'span',
      text: '和',
      marks: []
    }, {
      _type: 'span',
      text: '消费电子',
      marks: ['strong']
    }, {
      _type: 'span',
      text: '等领域。',
      marks: []
    }],
    style: 'normal'
  },
  {
    _type: 'block',
    children: [{
      _type: 'span',
      text: '重要提示'
    }],
    style: 'h3'
  },
  {
    _type: 'block',
    children: [{
      _type: 'span',
      text: '注意：',
      marks: [{
        _type: 'color',
        hex: '#DC2626'
      }, 'strong']
    }, {
      _type: 'span',
      text: '使用前请仔细阅读产品数据手册，确保符合您的应用要求。如需技术支持，请访问',
      marks: []
    }, {
      _type: 'span',
      text: 'STM官方网站',
      marks: [{
        _type: 'link',
        href: 'https://www.st.com',
        target: '_blank'
      }]
    }, {
      _type: 'span',
      text: '获取最新信息。',
      marks: []
    }],
    style: 'normal'
  }
];

// 示例产品数据
const sampleProduct = {
  _type: 'product',
  partNumber: 'STM32F407VGT6',
  title: 'STM32F407VGT6 ARM Cortex-M4微控制器',
  slug: {
    _type: 'slug',
    current: 'stm32f407vgt6'
  },
  description: sampleRichTextDescription,
  shortDescription: 'STM32F407VGT6是一款高性能32位ARM Cortex-M4微控制器，主频168MHz，集成1MB Flash和192KB SRAM，适用于各种嵌入式应用。',
  specifications: [
    {
      name: '内核架构',
      value: 'ARM Cortex-M4',
      unit: '',
      category: 'basic',
      order: 1
    },
    {
      name: '主频',
      value: '168',
      unit: 'MHz',
      category: 'basic',
      order: 2
    },
    {
      name: 'Flash存储器',
      value: '1024',
      unit: 'KB',
      category: 'basic',
      order: 3
    },
    {
      name: 'SRAM',
      value: '192',
      unit: 'KB',
      category: 'basic',
      order: 4
    },
    {
      name: '工作电压',
      value: '1.8-3.6',
      unit: 'V',
      category: 'electrical',
      order: 5
    },
    {
      name: '工作温度',
      value: '-40~+85',
      unit: '°C',
      category: 'environmental',
      order: 6
    }
  ],
  pricing: {
    currency: 'CNY',
    tiers: [
      {
        quantity: 1,
        price: 45.50,
        unit: '个'
      },
      {
        quantity: 10,
        price: 42.00,
        unit: '个'
      },
      {
        quantity: 100,
        price: 38.50,
        unit: '个'
      }
    ],
    moq: 1,
    leadTime: '3-5个工作日'
  },
  inventory: {
    quantity: 1000,
    status: 'in_stock',
    warehouse: '深圳仓库',
    lastUpdated: new Date().toISOString()
  },
  isActive: true,
  isFeatured: true,
  isNew: false,
  seoTitle: 'STM32F407VGT6 ARM Cortex-M4微控制器 - 高性能32位MCU',
  seoDescription: 'STM32F407VGT6微控制器，168MHz主频，1MB Flash，192KB SRAM，适用于工业自动化、物联网等应用。现货供应，快速发货。',
  seoKeywords: ['STM32F407VGT6', 'ARM Cortex-M4', '微控制器', 'MCU', 'STMicroelectronics', '嵌入式']
};

async function createSampleProductWithRichText() {
  try {
    console.log('🔍 Checking for existing brands and categories...');

    // 获取STM品牌和产品分类
    const [brands, categories] = await Promise.all([
      client.fetch(`*[_type == "brandBasic" && (name match "STM*" || name match "*microelectronics*")] { _id, name }`),
      client.fetch(`*[_type == "productCategory" && (name match "*微控制器*" || name match "*MCU*" || name match "*处理器*")] { _id, name }`)
    ]);

    console.log('Found brands:', brands.map(b => b.name).join(', '));
    console.log('Found categories:', categories.map(c => c.name).join(', '));

    // 查找或创建STM品牌
    let stmBrand = brands.find(b => b.name.toLowerCase().includes('stm') || b.name.toLowerCase().includes('microelectronics'));
    if (!stmBrand) {
      console.log('📝 Creating STMicroelectronics brand...');
      stmBrand = await client.create({
        _type: 'brandBasic',
        name: 'STMicroelectronics',
        slug: {
          _type: 'slug',
          current: 'stmicroelectronics'
        },
        description: 'STMicroelectronics是全球领先的半导体公司，专注于微控制器、传感器和功率器件的设计与制造。',
        website: 'https://www.st.com',
        country: '瑞士',
        headquarters: '日内瓦',
        established: '1987',
        isActive: true,
        isFeatured: true
      });
      console.log('✅ Created STMicroelectronics brand');
    }

    // 查找或创建微控制器分类
    let mcuCategory = categories.find(c =>
      c.name.includes('微控制器') ||
      c.name.toLowerCase().includes('mcu') ||
      c.name.includes('处理器')
    );
    if (!mcuCategory) {
      console.log('📝 Creating MCU category...');
      mcuCategory = await client.create({
        _type: 'productCategory',
        name: '微控制器',
        slug: {
          _type: 'slug',
          current: 'microcontrollers'
        },
        description: '微控制器(MCU)产品，包括各种架构和性能级别的处理器芯片',
        level: 1,
        isVisible: true,
        sortOrder: 1
      });
      console.log('✅ Created microcontroller category');
    }

    // 检查是否已存在相同的产品
    const existingProduct = await client.fetch(
      `*[_type == "product" && partNumber == $partNumber][0]`,
      { partNumber: sampleProduct.partNumber }
    );

    if (existingProduct) {
      console.log(`ℹ️ Product ${sampleProduct.partNumber} already exists, skipping creation...`);
      return existingProduct;
    }

    // 创建完整的产品数据
    const productWithRefs = {
      ...sampleProduct,
      brand: {
        _type: 'reference',
        _ref: stmBrand._id
      },
      category: {
        _type: 'reference',
        _ref: mcuCategory._id
      }
    };

    console.log('📝 Creating sample product with rich text description...');
    const createdProduct = await client.create(productWithRefs);

    console.log('✅ Successfully created product:', createdProduct.title);
    console.log('📝 Product ID:', createdProduct._id);
    console.log('🔗 Product URL: /zh-CN/products/' + createdProduct.slug.current);

    return createdProduct;

  } catch (error) {
    console.error('❌ Error creating sample product:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  createSampleProductWithRichText()
    .then(() => {
      console.log('✅ Sample product creation complete');
      console.log('\n📖 Next steps:');
      console.log('1. Visit Sanity Studio to review the created product');
      console.log('2. Test the rich text editing in the product description field');
      console.log('3. Visit the product page on the frontend to see the rendered result');
      console.log('4. Refer to PRODUCT_RICH_TEXT_GUIDE.md for usage instructions');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Sample product creation failed:', error);
      process.exit(1);
    });
}

module.exports = { createSampleProductWithRichText };