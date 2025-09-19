const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function testBrandArticleRelation() {
  console.log('🔍 深度测试品牌-文章关联关系...');

  try {
    // Test specific article 33333
    console.log('\n🎯 深度检查文章 33333:');
    const article33333Detail = await client.fetch(`
      *[_type == "article" && slug.current == "33333"][0] {
        _id,
        title,
        "slug": slug.current,
        isPublished,
        relatedBrands,
        "relatedBrandDetails": relatedBrands[]->{
          _id,
          name,
          "slug": slug.current
        },
        "relatedBrandIds": relatedBrands[]._ref
      }
    `);

    console.log('文章详情:', JSON.stringify(article33333Detail, null, 2));

    // Test the relation check query that was failing
    console.log('\n🧪 测试关联检查查询:');

    const relationTest1 = await client.fetch(`
      *[_type == "article" && slug.current == "33333"][0] {
        title,
        "hasIxys": count(relatedBrands[slug.current == "ixys"]) > 0
      }
    `);
    console.log('方法1 - 嵌套查询:', relationTest1);

    const relationTest2 = await client.fetch(`
      *[_type == "article" && slug.current == "33333"][0] {
        title,
        "hasIxys": "ixys" in relatedBrands[]->slug.current
      }
    `);
    console.log('方法2 - 数组包含:', relationTest2);

    // Check IXYS brand reference
    console.log('\n🏢 检查IXYS品牌引用:');
    const ixysBrandRef = await client.fetch(`
      *[_type == "brandBasic" && slug.current == "ixys"][0] {
        _id,
        name,
        "slug": slug.current
      }
    `);
    console.log('IXYS品牌引用:', ixysBrandRef);

    // Check if article 33333 has IXYS in its relatedBrands
    if (article33333Detail && ixysBrandRef) {
      const hasIxysRef = article33333Detail.relatedBrandIds?.includes(ixysBrandRef._id);
      console.log(`文章33333是否包含IXYS引用 (${ixysBrandRef._id}):`, hasIxysRef ? '✅ 是' : '❌ 否');
      console.log('文章的relatedBrandIds:', article33333Detail.relatedBrandIds);
    }

    // Test all articles and their actual brand relationships
    console.log('\n📋 所有文章的品牌关联检查:');
    const allArticleRelations = await client.fetch(`
      *[_type == "article" && isPublished == true] {
        "articleSlug": slug.current,
        "articleTitle": title,
        "brandRelations": relatedBrands[]->{
          _id,
          name,
          "slug": slug.current
        }
      }
    `);

    allArticleRelations.forEach((article, i) => {
      console.log(`${i+1}. 文章: ${article.articleTitle} (${article.articleSlug})`);
      article.brandRelations?.forEach(brand => {
        console.log(`   -> 关联品牌: ${brand.name} (${brand.slug}) [${brand._id}]`);
      });
    });

  } catch (error) {
    console.error('❌ 关联关系测试失败:', error);
  }
}

testBrandArticleRelation();