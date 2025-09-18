const { createClient } = require('@sanity/client');
const { groq } = require('next-sanity');

// 使用与应用相同的客户端配置
const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  perspective: 'published',
});

// 模拟getBrandProduct函数
async function getBrandProduct(brandSlug, productSlug) {
  const query = groq`
    *[_type == "product" &&
      slug.current == $productSlug &&
      brand->slug.current == $brandSlug &&
      isActive == true &&
      !(_id in path("drafts.**"))][0] {
      _id,
      title,
      "slug": slug.current,
      brand->{
        name,
        "slug": slug.current
      }
    }
  `;

  try {
    console.log(`🔍 [getBrandProduct] Searching for product ${productSlug} in brand ${brandSlug}`);
    const product = await client.fetch(query, { brandSlug, productSlug });

    if (product) {
      console.log(`✅ [getBrandProduct] Found product: ${product.title} for brand ${brandSlug}`);
    } else {
      console.log(`❌ [getBrandProduct] Product ${productSlug} not found for brand ${brandSlug}`);
    }

    return product || null;
  } catch (error) {
    console.error(`Error fetching brand product ${brandSlug}/${productSlug}:`, error);
    return null;
  }
}

// 模拟getBrandData函数
async function getBrandData(brandSlug) {
  // 首先尝试精确匹配
  let query = groq`
    *[_type == "brandBasic" && slug.current == $brandSlug && isActive == true && !(_id in path("drafts.**"))][0] {
      _id,
      name,
      "slug": slug.current
    }
  `;

  try {
    console.log(`🔍 [getBrandData] Searching for brand with slug: ${brandSlug}`);
    let brand = await client.fetch(query, { brandSlug });

    if (brand) {
      console.log(`✅ [getBrandData] Found brand: ${brand.name}`);
      return { brand };
    } else {
      console.log(`❌ [getBrandData] Brand not found for slug: ${brandSlug}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching brand ${brandSlug}:`, error);
    return null;
  }
}

// 测试不同的URL编码情况
async function testURLEncoding() {
  console.log('🔍 开始测试URL编码情况...\n');

  const testCases = [
    {
      name: '测试1: 原始slug',
      brandSlug: 'cree',
      productSlug: '55555'
    },
    {
      name: '测试2: URL编码的brand slug',
      brandSlug: decodeURIComponent('cree'),
      productSlug: '55555'
    },
    {
      name: '测试3: URL编码的product slug',
      brandSlug: 'cree',
      productSlug: decodeURIComponent('55555')
    },
    {
      name: '测试4: 两者都编码',
      brandSlug: decodeURIComponent('cree'),
      productSlug: decodeURIComponent('55555')
    },
    {
      name: '测试5: sic mosfet (包含空格)',
      brandSlug: 'cree',
      productSlug: 'sic mosfet'
    },
    {
      name: '测试6: sic mosfet URL编码',
      brandSlug: 'cree',
      productSlug: decodeURIComponent('sic%20mosfet')
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n${testCase.name}:`);
    console.log(`Brand slug: "${testCase.brandSlug}"`);
    console.log(`Product slug: "${testCase.productSlug}"`);

    // 测试brand查询
    const brandData = await getBrandData(testCase.brandSlug);

    if (brandData) {
      // 测试product查询
      const product = await getBrandProduct(testCase.brandSlug, testCase.productSlug);

      if (product) {
        console.log(`🎉 ${testCase.name} - 成功!`);
      } else {
        console.log(`❌ ${testCase.name} - Product查询失败`);
      }
    } else {
      console.log(`❌ ${testCase.name} - Brand查询失败`);
    }
  }

  // 特别测试: 模拟生产环境的params
  console.log('\n🎯 模拟生产环境的params:');

  // 模拟 params = { locale: 'zh-CN', slug: 'cree', id: '55555' }
  const prodParams = {
    locale: 'zh-CN',
    slug: 'cree',
    id: '55555'
  };

  console.log('模拟的params:', prodParams);

  // 按照实际页面组件的逻辑处理
  const decodedSlug = decodeURIComponent(prodParams.slug);
  console.log(`解码后的slug: "${decodedSlug}"`);

  const brandData = await getBrandData(decodedSlug);
  if (brandData) {
    const product = await getBrandProduct(decodedSlug, prodParams.id);
    console.log(`最终结果: ${product ? '✅ 成功' : '❌ 失败'}`);
  }
}

// 运行测试
if (require.main === module) {
  testURLEncoding()
    .then(() => {
      console.log('\n🎉 URL编码测试完成!');
      process.exit(0);
    })
    .catch(error => {
      console.error('测试失败:', error);
      process.exit(1);
    });
}

module.exports = { testURLEncoding };