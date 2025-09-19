const { createClient } = require('@sanity/client');

// Create a direct client to test Sanity connection
const client = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function diagnoseArticles() {
  console.log('🔍 检查文章(articles)数据...');

  try {
    // Check if article document type exists
    console.log('\n📊 文章数据统计:');
    const articleStats = await client.fetch(`{
      "totalArticles": count(*[_type == "article"]),
      "publishedArticles": count(*[_type == "article" && isPublished == true]),
      "articlesWithSlugs": count(*[_type == "article" && defined(slug.current)]),
      "articlesWithBrands": count(*[_type == "article" && defined(relatedBrands)]),
    }`);
    console.log(articleStats);

    // Get sample articles if they exist
    console.log('\n🔍 示例文章:');
    const articles = await client.fetch(`
      *[_type == "article"][0...10] {
        _id,
        title,
        "slug": slug.current,
        isPublished,
        "relatedBrands": relatedBrands[]->name,
        "brandSlugs": relatedBrands[]->slug.current,
        excerpt,
        _createdAt
      }
    `);
    console.log('Found articles:', articles?.length || 0);
    articles?.forEach((a, i) => {
      console.log(`  ${i+1}. ${a.title || 'Untitled'} (${a.slug || 'no-slug'}) - Published: ${a.isPublished} - Brands: [${a.relatedBrands?.join(', ') || 'none'}]`);
    });

    // Check for article ID "33333" specifically
    console.log('\n🎯 检查特定文章ID "33333":');
    const article33333 = await client.fetch(`
      *[_type == "article" && (slug.current == "33333" || _id match "*33333*")][0] {
        _id,
        title,
        "slug": slug.current,
        isPublished,
        "relatedBrands": relatedBrands[]->name,
        "brandSlugs": relatedBrands[]->slug.current,
        excerpt
      }
    `);

    if (article33333) {
      console.log('✅ 找到文章 33333:', article33333);
    } else {
      console.log('❌ 未找到文章 33333');
    }

    // Check what content types exist
    console.log('\n📋 所有文档类型:');
    const docTypes = await client.fetch(`
      array::unique(*[]._type)
    `);
    console.log('Document types:', docTypes);

    // Check if "33333" exists as any document type
    console.log('\n🔍 检查 "33333" 作为任何文档类型:');
    const doc33333 = await client.fetch(`
      *[(slug.current == "33333" || _id match "*33333*" || partNumber == "33333" || title == "33333")][0...3] {
        _id,
        _type,
        title,
        partNumber,
        "slug": slug.current,
        "brand": brand->name,
        "brandSlug": brand->slug.current
      }
    `);

    if (doc33333?.length > 0) {
      console.log('✅ 找到包含 "33333" 的文档:');
      doc33333.forEach((doc, i) => {
        console.log(`  ${i+1}. Type: ${doc._type}, Title: ${doc.title || doc.partNumber}, Brand: ${doc.brand} (${doc.brandSlug})`);
      });
    } else {
      console.log('❌ 未找到包含 "33333" 的文档');
    }

    // Test the getArticle query function
    console.log('\n🧪 测试 getArticle 查询函数:');
    try {
      const articleQuery = `
        *[_type == "article" && slug.current == $slug && isPublished == true][0] {
          _id,
          title,
          "slug": slug.current,
          excerpt,
          content,
          image,
          author->{
            name,
            "slug": slug.current,
            avatar
          },
          relatedBrands[]->{
            _id,
            name,
            "slug": slug.current,
            logo
          },
          category->{
            name,
            "slug": slug.current
          },
          tags,
          readTime,
          difficulty,
          publishedAt,
          isPublished,
          isFeatured
        }
      `;

      const testArticle = await client.fetch(articleQuery, { slug: '33333' });
      if (testArticle) {
        console.log('✅ getArticle查询成功:', testArticle.title);
      } else {
        console.log('❌ getArticle查询返回null');
      }
    } catch (error) {
      console.log('❌ getArticle查询出错:', error.message);
    }

  } catch (error) {
    console.error('❌ 文章诊断失败:', error);
  }
}

diagnoseArticles();