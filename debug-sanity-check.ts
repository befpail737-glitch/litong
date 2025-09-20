import { client } from './src/lib/sanity/client';

async function checkSanityData() {
  try {
    console.log('🔍 检查 Sanity 数据状态...');

    // 检查基本统计
    const stats = await client.fetch(`{
      "totalArticles": count(*[_type == "article"]),
      "publishedArticles": count(*[_type == "article" && isPublished == true]),
      "totalSolutions": count(*[_type == "solution"]),
      "publishedSolutions": count(*[_type == "solution" && isPublished == true]),
      "totalProducts": count(*[_type == "product"]),
      "activeProducts": count(*[_type == "product" && isActive == true]),
      "totalBrands": count(*[_type == "brandBasic"]),
      "activeBrands": count(*[_type == "brandBasic" && isActive == true])
    }`);

    console.log('\n📊 数据统计:');
    console.log(`  文章: ${stats.publishedArticles}/${stats.totalArticles} 已发布`);
    console.log(`  解决方案: ${stats.publishedSolutions}/${stats.totalSolutions} 已发布`);
    console.log(`  产品: ${stats.activeProducts}/${stats.totalProducts} 激活`);
    console.log(`  品牌: ${stats.activeBrands}/${stats.totalBrands} 激活`);

    // 检查文章样本
    const articles = await client.fetch(`*[_type == "article"][0...3] {
      _id,
      title,
      isPublished,
      relatedBrands[]->{name, "slug": slug.current},
      "slug": slug.current,
      content[0...1]
    }`);

    console.log('\n📄 文章样本:', articles.length);
    articles.forEach((article, i) => {
      console.log(`  ${i+1}. ${article.title || 'No title'} - 已发布: ${article.isPublished}`);
      if (article.relatedBrands?.length > 0) {
        console.log(`     关联品牌: ${article.relatedBrands.map(b => b.name).join(', ')}`);
      }
      if (article.content?.length > 0) {
        console.log(`     有内容: ${article.content.length} 个块`);
      }
    });

    // 检查解决方案样本
    const solutions = await client.fetch(`*[_type == "solution"][0...3] {
      _id,
      title,
      isPublished,
      primaryBrand->{name, "slug": slug.current},
      "slug": slug.current,
      description[0...1]
    }`);

    console.log('\n💡 解决方案样本:', solutions.length);
    solutions.forEach((solution, i) => {
      console.log(`  ${i+1}. ${solution.title || 'No title'} - 已发布: ${solution.isPublished}`);
      if (solution.primaryBrand) {
        console.log(`     主品牌: ${solution.primaryBrand.name}`);
      }
      if (solution.description?.length > 0) {
        console.log(`     有描述: ${solution.description.length} 个块`);
      }
    });

    // 检查产品样本
    const products = await client.fetch(`*[_type == "product"][0...3] {
      _id,
      title,
      partNumber,
      isActive,
      brand->{name, "slug": slug.current},
      "slug": slug.current,
      image
    }`);

    console.log('\n📦 产品样本:', products.length);
    products.forEach((product, i) => {
      console.log(`  ${i+1}. ${product.title || product.partNumber || 'No title'} - 激活: ${product.isActive}`);
      if (product.brand) {
        console.log(`     品牌: ${product.brand.name}`);
      }
      console.log(`     有图片: ${!!product.image}`);
    });

    // 检查品牌样本
    const brands = await client.fetch(`*[_type == "brandBasic"][0...5] {
      _id,
      name,
      "slug": slug.current,
      isActive,
      logo
    }`);

    console.log('\n🏢 品牌样本:', brands.length);
    brands.forEach((brand, i) => {
      console.log(`  ${i+1}. ${brand.name} (${brand.slug}) - 激活: ${brand.isActive} - 有logo: ${!!brand.logo}`);
    });

    console.log('\n✅ 数据检查完成');

  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
}

checkSanityData();