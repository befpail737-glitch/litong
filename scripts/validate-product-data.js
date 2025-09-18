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

// 验证品牌-产品组合数据一致性
async function validateProductData() {
  console.log('🔍 开始验证产品数据一致性...\n');

  try {
    // 1. 获取品牌-产品组合（与 getBrandProductCombinations 相同的查询）
    console.log('📋 步骤1: 获取品牌-产品组合...');
    const combinationsQuery = groq`
      *[_type == "product" && (isActive == true || !defined(isActive)) && defined(slug.current) && defined(brand->slug.current)] | order(_createdAt desc) [0...50] {
        "productSlug": slug.current,
        "brandSlug": brand->slug.current
      }
    `;

    const combinations = await client.fetch(combinationsQuery);
    console.log(`✅ 找到 ${combinations.length} 个品牌-产品组合\n`);

    // 2. 验证每个组合是否能通过 getBrandProduct 查询找到
    console.log('🔍 步骤2: 验证每个组合的数据一致性...');
    const productDetailQuery = groq`
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

    const results = {
      total: combinations.length,
      valid: 0,
      invalid: 0,
      errors: []
    };

    for (const combo of combinations) {
      try {
        const product = await client.fetch(productDetailQuery, {
          brandSlug: combo.brandSlug,
          productSlug: combo.productSlug
        });

        if (product) {
          results.valid++;
          console.log(`✅ ${combo.brandSlug}/${combo.productSlug} - 找到: ${product.title}`);
        } else {
          results.invalid++;
          results.errors.push(`❌ ${combo.brandSlug}/${combo.productSlug} - 组合存在但产品查询返回null`);
          console.log(`❌ ${combo.brandSlug}/${combo.productSlug} - 查询无结果`);
        }
      } catch (error) {
        results.invalid++;
        results.errors.push(`💥 ${combo.brandSlug}/${combo.productSlug} - 查询错误: ${error.message}`);
        console.log(`💥 ${combo.brandSlug}/${combo.productSlug} - 错误: ${error.message}`);
      }
    }

    // 3. 输出验证结果
    console.log('\n📊 验证结果汇总:');
    console.log(`总计: ${results.total}`);
    console.log(`有效: ${results.valid}`);
    console.log(`无效: ${results.invalid}`);
    console.log(`成功率: ${((results.valid / results.total) * 100).toFixed(2)}%\n`);

    if (results.errors.length > 0) {
      console.log('❌ 发现的问题:');
      results.errors.forEach(error => console.log(error));
    }

    // 4. 特别测试用户关心的产品
    console.log('\n🎯 特别测试用户关心的产品:');
    const testProducts = [
      { brandSlug: 'cree', productSlug: '55555' },
      { brandSlug: 'cree', productSlug: '11111' },
      { brandSlug: 'cree', productSlug: 'sic mosfet' }
    ];

    for (const test of testProducts) {
      try {
        const product = await client.fetch(productDetailQuery, test);
        if (product) {
          console.log(`✅ ${test.brandSlug}/${test.productSlug} - 存在: ${product.title}`);
        } else {
          console.log(`❌ ${test.brandSlug}/${test.productSlug} - 不存在`);
        }
      } catch (error) {
        console.log(`💥 ${test.brandSlug}/${test.productSlug} - 错误: ${error.message}`);
      }
    }

    return results;

  } catch (error) {
    console.error('验证过程中发生错误:', error);
    throw error;
  }
}

// 运行验证
if (require.main === module) {
  validateProductData()
    .then(results => {
      console.log('\n🎉 数据验证完成!');
      process.exit(results.invalid > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('验证失败:', error);
      process.exit(1);
    });
}

module.exports = { validateProductData };