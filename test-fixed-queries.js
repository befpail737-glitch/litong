const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function testFixedQueries() {
  console.log('🧪 测试修复后的品牌文章查询...');

  try {
    // Test 1: 验证特定的IXYS + 33333组合
    console.log('\n🎯 测试 IXYS + 33333 组合:');

    // 1.1 检查品牌数据
    const ixysBrand = await client.fetch(`
      *[_type == "brandBasic" && (slug.current == "ixys" || name match "IXYS*")][0] {
        _id,
        name,
        "slug": slug.current,
        isActive
      }
    `);

    console.log('IXYS品牌数据:', ixysBrand ? `✅ ${ixysBrand.name} (${ixysBrand.slug})` : '❌ 未找到');

    // 1.2 检查文章数据
    const article33333 = await client.fetch(`
      *[_type == "article" && slug.current == "33333"][0] {
        _id,
        title,
        "slug": slug.current,
        isPublished,
        relatedBrands[]->{
          _id,
          name,
          "slug": slug.current
        }
      }
    `);

    console.log('文章33333数据:', article33333 ? `✅ ${article33333.title} (${article33333.slug})` : '❌ 未找到');

    if (article33333) {
      console.log('关联品牌:', article33333.relatedBrands?.map(b => `${b.name}(${b.slug})`).join(', '));

      // 检查文章是否真的关联到IXYS
      const isIxysRelated = article33333.relatedBrands?.some(b =>
        b.slug === 'ixys' || b.name.toLowerCase().includes('ixys')
      );
      console.log('是否关联IXYS:', isIxysRelated ? '✅ 是' : '❌ 否');
    }

    // Test 2: 测试所有品牌-文章组合
    console.log('\n📊 所有品牌-文章组合验证:');
    const allCombinations = await client.fetch(`
      *[_type == "article" && isPublished == true && defined(slug.current) && count(relatedBrands) > 0] {
        "articleSlug": slug.current,
        "articleTitle": title,
        "brandCombinations": relatedBrands[]-> {
          name,
          "slug": slug.current,
          isActive
        }
      }
    `);

    let validCombinations = 0;
    let totalCombinations = 0;

    allCombinations.forEach((article, i) => {
      console.log(`\n  ${i+1}. 文章: "${article.articleTitle}" (${article.articleSlug})`);

      article.brandCombinations?.forEach(brand => {
        totalCombinations++;
        if (brand.isActive) {
          validCombinations++;
          console.log(`     ✅ /zh-CN/brands/${brand.slug}/articles/${article.articleSlug}/`);
        } else {
          console.log(`     ❌ /zh-CN/brands/${brand.slug}/articles/${article.articleSlug}/ (品牌未激活)`);
        }
      });
    });

    console.log(`\n📈 验证总结:`);
    console.log(`  总组合数: ${totalCombinations}`);
    console.log(`  有效组合: ${validCombinations}`);
    console.log(`  有效率: ${(validCombinations / totalCombinations * 100).toFixed(1)}%`);

    // Test 3: 测试关键URL的数据完整性
    console.log('\n🔍 关键URL数据完整性测试:');
    const keyUrls = [
      { brand: 'ixys', article: '33333' },
      { brand: 'ixys', article: '111111111' },
      { brand: 'cree', article: 'aaaaa' },
      { brand: 'cree', article: '11111' }
    ];

    for (const url of keyUrls) {
      console.log(`\n  测试: /zh-CN/brands/${url.brand}/articles/${url.article}/`);

      // 检查品牌
      const brand = await client.fetch(`
        *[_type == "brandBasic" && slug.current == $brandSlug][0] {
          name, "slug": slug.current, isActive
        }
      `, { brandSlug: url.brand });

      // 检查文章
      const article = await client.fetch(`
        *[_type == "article" && slug.current == $articleSlug][0] {
          title, "slug": slug.current, isPublished,
          "hasThisBrand": count(relatedBrands[slug.current == $brandSlug]) > 0
        }
      `, { articleSlug: url.article, brandSlug: url.brand });

      const brandStatus = brand ? (brand.isActive ? '✅ 品牌激活' : '⚠️ 品牌未激活') : '❌ 品牌不存在';
      const articleStatus = article ? (article.isPublished ? '✅ 文章已发布' : '⚠️ 文章未发布') : '❌ 文章不存在';
      const relationStatus = article?.hasThisBrand ? '✅ 关联正确' : '❌ 无关联';

      console.log(`    品牌: ${brandStatus}`);
      console.log(`    文章: ${articleStatus}`);
      console.log(`    关联: ${relationStatus}`);

      const overallStatus = brand?.isActive && article?.isPublished && article?.hasThisBrand;
      console.log(`    结果: ${overallStatus ? '✅ 应该可以访问' : '❌ 可能404'}`);
    }

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

testFixedQueries();