// 直接连接 Sanity 检查数据的脚本
const https = require('https');

const SANITY_PROJECT_ID = 'oquvb2bs';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2023-05-01';

function makeQuery(query) {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodedQuery}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function checkTechnicalSupport() {
  try {
    console.log('🔍 检查力通网站技术支持系统状态...\n');

    // 1. 检查文章分类
    console.log('1. 检查文章分类:');
    const categoriesQuery = '*[_type == "articleCategory"] { _id, name, "slug": slug.current, isVisible }';
    const categories = await makeQuery(categoriesQuery);

    if (categories.result && categories.result.length > 0) {
      console.log(`   ✅ 找到 ${categories.result.length} 个分类:`);
      categories.result.forEach((cat, idx) => {
        console.log(`   ${idx + 1}. ${cat.name} (${cat.slug}) - ${cat.isVisible ? '可见' : '隐藏'}`);
      });

      const techSupportCategory = categories.result.find(cat => cat.slug === 'technical-support');
      if (techSupportCategory) {
        console.log('   ✅ 技术支持分类存在');
      } else {
        console.log('   ❌ 技术支持分类不存在');
      }
    } else {
      console.log('   ❌ 没有找到任何文章分类');
    }

    // 2. 检查技术支持文章
    console.log('\n2. 检查技术支持文章:');
    const supportArticlesQuery = '*[_type == "article" && articleType == "support"] { _id, title, "slug": slug.current, isPublished, "category": category->name }';
    const supportArticles = await makeQuery(supportArticlesQuery);

    if (supportArticles.result && supportArticles.result.length > 0) {
      console.log(`   ✅ 找到 ${supportArticles.result.length} 篇技术支持文章:`);
      supportArticles.result.forEach((article, idx) => {
        console.log(`   ${idx + 1}. ${article.title} - ${article.isPublished ? '已发布' : '草稿'} (分类: ${article.category || '未分类'})`);
      });
    } else {
      console.log('   ❌ 没有找到技术支持文章');
    }

    // 3. 检查所有文章的图片状态
    console.log('\n3. 检查文章图片状态:');
    const imageArticlesQuery = '*[_type == "article"][0...10] { _id, title, "hasImage": defined(image), "imageUrl": image.asset->url, "contentHasImages": length(content[_type == "image"]) > 0 }';
    const imageArticles = await makeQuery(imageArticlesQuery);

    if (imageArticles.result && imageArticles.result.length > 0) {
      console.log(`   检查了 ${imageArticles.result.length} 篇文章的图片状态:`);
      let withImages = 0;
      let withoutImages = 0;

      imageArticles.result.forEach((article, idx) => {
        const hasAnyImage = article.hasImage || article.contentHasImages;
        if (hasAnyImage) {
          withImages++;
          console.log(`   ✅ ${idx + 1}. ${article.title} - 有图片`);
        } else {
          withoutImages++;
          console.log(`   ❌ ${idx + 1}. ${article.title} - 无图片`);
        }
      });

      console.log(`   总结: ${withImages} 篇有图片, ${withoutImages} 篇无图片`);
    } else {
      console.log('   ❌ 没有找到任何文章');
    }

    // 4. 检查品牌数据
    console.log('\n4. 检查品牌数据:');
    const brandsQuery = '*[_type == "brandBasic" && isActive == true][0...5] { _id, name, "slug": slug.current, "hasLogo": defined(logo) }';
    const brands = await makeQuery(brandsQuery);

    if (brands.result && brands.result.length > 0) {
      console.log(`   ✅ 找到 ${brands.result.length} 个活跃品牌:`);
      brands.result.forEach((brand, idx) => {
        console.log(`   ${idx + 1}. ${brand.name} (${brand.slug}) - ${brand.hasLogo ? '有Logo' : '无Logo'}`);
      });
    } else {
      console.log('   ❌ 没有找到活跃品牌');
    }

    console.log('\n✅ 技术支持系统检查完成');

  } catch (error) {
    console.error('❌ 检查过程中出现错误:', error.message);

    console.log('\n🔧 建议的修复步骤:');
    console.log('1. 检查 Sanity Studio 是否正常运行');
    console.log('2. 确认项目 ID 和数据集配置正确');
    console.log('3. 创建技术支持分类和文章');
    console.log('4. 检查图片上传功能');
  }
}

checkTechnicalSupport();