/**
 * 分析Sanity中的产品数据，验证硬编码ID的存在性
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function analyzeProductData() {
  console.log('🔍 分析Sanity CMS产品数据...\n');

  try {
    // 获取所有产品数据
    const productsQuery = `*[_type == "product"] {
      _id,
      title,
      "slug": slug.current,
      model,
      isActive,
      isFeatured,
      "brand": brand->name,
      "brandSlug": brand->slug.current,
      category,
      _createdAt,
      _updatedAt
    } | order(title asc)`;

    const products = await client.fetch(productsQuery);
    console.log(`📊 总产品数: ${products.length}`);

    // 分析硬编码的产品ID
    const hardcodedIds = ['55555', '99999', 'stm32f407vgt6', '11111', 'c4d02120a', 'sic mosfet'];

    console.log('\n🔧 检查硬编码产品ID的存在性:');
    const existingIds = [];
    const missingIds = [];

    hardcodedIds.forEach(id => {
      const found = products.find(p => p.slug === id);
      if (found) {
        existingIds.push({
          id,
          product: found
        });
        console.log(`✅ ${id}: 存在 - "${found.title}" (品牌: ${found.brand || 'N/A'})`);
      } else {
        missingIds.push(id);
        console.log(`❌ ${id}: 不存在`);
      }
    });

    // 分析品牌关联
    console.log('\n📋 品牌关联分析:');
    const brandProductMap = {};
    products.forEach(product => {
      if (product.brandSlug && product.isActive !== false) {
        if (!brandProductMap[product.brandSlug]) {
          brandProductMap[product.brandSlug] = [];
        }
        brandProductMap[product.brandSlug].push({
          slug: product.slug,
          title: product.title,
          model: product.model
        });
      }
    });

    Object.keys(brandProductMap).forEach(brandSlug => {
      const productCount = brandProductMap[brandSlug].length;
      console.log(`   - ${brandSlug}: ${productCount} 个产品`);
      if (productCount <= 3) {
        console.log(`     产品: ${brandProductMap[brandSlug].map(p => p.slug).join(', ')}`);
      }
    });

    // CREE品牌特别分析
    console.log('\n🎯 CREE品牌产品详细分析:');
    const creeProducts = brandProductMap['cree'] || [];
    if (creeProducts.length > 0) {
      console.log(`CREE共有 ${creeProducts.length} 个产品:`);
      creeProducts.forEach(product => {
        console.log(`   - ${product.slug}: "${product.title}" (型号: ${product.model || 'N/A'})`);
      });
    } else {
      console.log('❌ 没有找到CREE品牌的产品');
    }

    // 活跃产品统计
    const activeProducts = products.filter(p => p.isActive !== false);
    const inactiveProducts = products.filter(p => p.isActive === false);

    console.log('\n📊 产品状态统计:');
    console.log(`   - 活跃产品: ${activeProducts.length}`);
    console.log(`   - 非活跃产品: ${inactiveProducts.length}`);
    console.log(`   - 推荐产品: ${products.filter(p => p.isFeatured === true).length}`);

    // 生成建议的品牌-产品组合
    console.log('\n💡 建议的品牌-产品组合 (用于静态生成):');
    const suggestions = [];
    Object.keys(brandProductMap).forEach(brandSlug => {
      const products = brandProductMap[brandSlug].slice(0, 3); // 每个品牌最多3个产品
      products.forEach(product => {
        suggestions.push({
          brandSlug,
          productSlug: product.slug,
          title: product.title
        });
      });
    });

    console.log(`建议生成 ${suggestions.length} 个品牌-产品组合:`);
    suggestions.slice(0, 10).forEach(combo => {
      console.log(`   - /brands/${combo.brandSlug}/products/${combo.productSlug}`);
    });
    if (suggestions.length > 10) {
      console.log(`   ... 以及其他 ${suggestions.length - 10} 个组合`);
    }

    return {
      totalProducts: products.length,
      hardcodedIds: {
        existing: existingIds,
        missing: missingIds
      },
      brandProductMap,
      creeProducts,
      activeProducts: activeProducts.length,
      suggestions
    };

  } catch (error) {
    console.error('❌ 分析产品数据时出错:', error);
    throw error;
  }
}

// 运行分析
if (require.main === module) {
  analyzeProductData()
    .then(result => {
      console.log('\n✅ 产品数据分析完成');
      if (result.hardcodedIds.missing.length > 0) {
        console.log(`\n⚠️  发现 ${result.hardcodedIds.missing.length} 个缺失的硬编码产品ID`);
        process.exit(1);
      } else {
        console.log('\n🎉 所有硬编码产品ID都存在于CMS中');
        process.exit(0);
      }
    })
    .catch(error => {
      console.error('脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = { analyzeProductData };