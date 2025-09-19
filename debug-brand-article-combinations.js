const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function debugBrandArticleCombinations() {
  console.log('🔍 调试品牌-文章组合...');

  try {
    // Get all brand-article combinations
    console.log('\n📊 所有品牌-文章组合:');
    const combinations = await client.fetch(`
      *[_type == "article" && isPublished == true && defined(slug.current) && count(relatedBrands) > 0] {
        "articleSlug": slug.current,
        "articleTitle": title,
        "brandSlugs": relatedBrands[]->slug.current,
        "brandNames": relatedBrands[]->name
      }
    `);

    console.log(`Found ${combinations.length} published articles with brands:`);

    const allCombinations = [];
    combinations.forEach((article, i) => {
      console.log(`\n  ${i+1}. 文章: "${article.articleTitle}" (${article.articleSlug})`);
      article.brandSlugs?.forEach((brandSlug, j) => {
        const brandName = article.brandNames?.[j];
        console.log(`     -> 品牌: ${brandName} (${brandSlug})`);
        console.log(`     -> URL: /zh-CN/brands/${brandSlug}/articles/${article.articleSlug}/`);

        allCombinations.push({
          locale: 'zh-CN',
          slug: brandSlug,
          id: article.articleSlug
        });
      });
    });

    console.log(`\n📋 生成静态参数的完整列表 (${allCombinations.length}个组合):`);
    allCombinations.forEach((combo, i) => {
      console.log(`  ${i+1}. { locale: '${combo.locale}', slug: '${combo.slug}', id: '${combo.id}' }`);
    });

    // Check specifically for ixys + 33333
    const ixysArticle = allCombinations.find(c => c.slug === 'ixys' && c.id === '33333');
    console.log(`\n🎯 IXYS + 33333 组合:`, ixysArticle ? '✅ 存在' : '❌ 不存在');

    // Check current generateStaticParams output
    console.log('\n🔍 当前 generateStaticParams 硬编码组合:');
    const currentParams = [
      { locale: 'zh-CN', slug: 'cree', id: 'aaaaa' },
      { locale: 'zh-CN', slug: 'infineon', id: 'aaaaa' },
      { locale: 'zh-CN', slug: 'ti', id: 'aaaaa' },
      { locale: 'en', slug: 'cree', id: 'aaaaa' },
      { locale: 'en', slug: 'infineon', id: 'aaaaa' }
    ];

    currentParams.forEach((param, i) => {
      console.log(`  ${i+1}. { locale: '${param.locale}', slug: '${param.slug}', id: '${param.id}' }`);
    });

    console.log('\n📊 对比分析:');
    console.log(`  实际数据组合: ${allCombinations.length}个`);
    console.log(`  硬编码组合: ${currentParams.length}个`);
    console.log(`  覆盖率: ${(currentParams.length / allCombinations.length * 100).toFixed(1)}%`);

    return allCombinations;

  } catch (error) {
    console.error('❌ 品牌-文章组合调试失败:', error);
    return [];
  }
}

debugBrandArticleCombinations();