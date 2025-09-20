const sanityClient = require('@sanity/client');

// Sanity client configuration
const client = sanityClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

console.log('🔍 诊断后台内容显示问题...\n');

async function diagnoseContentVisibility() {
  try {
    // 1. 检查数据库连接
    console.log('1️⃣ 检查Sanity数据库连接...');
    const projectInfo = await client.request({
      url: '/projects/oquvb2bs',
      method: 'GET'
    }).catch(() => null);

    if (projectInfo) {
      console.log('✅ 数据库连接正常');
    } else {
      console.log('⚠️ 无法获取项目信息，但连接可能正常');
    }

    // 2. 检查产品数据
    console.log('\n2️⃣ 检查产品数据...');

    // 所有产品（不过滤）
    const allProducts = await client.fetch(`
      *[_type == "product"] {
        _id,
        title,
        partNumber,
        isActive,
        isPublished,
        _createdAt,
        "brand": brand->name
      } | order(_createdAt desc)[0...10]
    `);

    console.log(`📦 总共找到 ${allProducts.length} 个产品`);
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title || '无标题'}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   型号: ${product.partNumber || '无型号'}`);
      console.log(`   品牌: ${product.brand || '无品牌'}`);
      console.log(`   isActive: ${product.isActive}`);
      console.log(`   isPublished: ${product.isPublished}`);
      console.log(`   创建时间: ${product._createdAt}`);
      console.log('');
    });

    // 激活的产品
    const activeProducts = await client.fetch(`
      *[_type == "product" && isActive == true] {
        _id,
        title,
        partNumber
      }
    `);
    console.log(`✅ 符合 isActive == true 条件的产品: ${activeProducts.length} 个`);

    // 3. 检查解决方案文章
    console.log('\n3️⃣ 检查解决方案文章...');

    const allSolutions = await client.fetch(`
      *[_type == "article" && articleType == "solution"] {
        _id,
        title,
        isActive,
        isPublished,
        _createdAt
      } | order(_createdAt desc)[0...5]
    `);

    console.log(`📝 总共找到 ${allSolutions.length} 个解决方案文章`);
    allSolutions.forEach((solution, index) => {
      console.log(`${index + 1}. ${solution.title || '无标题'}`);
      console.log(`   ID: ${solution._id}`);
      console.log(`   isActive: ${solution.isActive}`);
      console.log(`   isPublished: ${solution.isPublished}`);
      console.log(`   创建时间: ${solution._createdAt}`);
      console.log('');
    });

    const activeSolutions = await client.fetch(`
      *[_type == "article" && articleType == "solution" && isActive == true]
    `);
    console.log(`✅ 符合条件的解决方案文章: ${activeSolutions.length} 个`);

    // 4. 检查技术支持文章
    console.log('\n4️⃣ 检查技术支持文章...');

    const allSupportArticles = await client.fetch(`
      *[_type == "article" && articleType == "support"] {
        _id,
        title,
        isActive,
        isPublished,
        _createdAt
      } | order(_createdAt desc)[0...5]
    `);

    console.log(`🛠️ 总共找到 ${allSupportArticles.length} 个技术支持文章`);
    allSupportArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title || '无标题'}`);
      console.log(`   ID: ${article._id}`);
      console.log(`   isActive: ${article.isActive}`);
      console.log(`   isPublished: ${article.isPublished}`);
      console.log(`   创建时间: ${article._createdAt}`);
      console.log('');
    });

    // 5. 检查品牌数据
    console.log('\n5️⃣ 检查品牌数据...');

    const allBrands = await client.fetch(`
      *[_type == "brandBasic"] {
        _id,
        name,
        isActive,
        _createdAt
      } | order(_createdAt desc)[0...5]
    `);

    console.log(`🏢 总共找到 ${allBrands.length} 个品牌`);
    allBrands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name || '无名称'}`);
      console.log(`   ID: ${brand._id}`);
      console.log(`   isActive: ${brand.isActive}`);
      console.log(`   创建时间: ${brand._createdAt}`);
      console.log('');
    });

    // 6. 检查图片和PDF资源
    console.log('\n6️⃣ 检查图片和PDF资源...');

    const imageAssets = await client.fetch(`
      *[_type == "sanity.imageAsset"] {
        _id,
        originalFilename,
        mimeType,
        size,
        _createdAt
      } | order(_createdAt desc)[0...5]
    `);

    console.log(`🖼️ 总共找到 ${imageAssets.length} 个图片资源`);
    imageAssets.forEach((image, index) => {
      console.log(`${index + 1}. ${image.originalFilename || '无文件名'}`);
      console.log(`   ID: ${image._id}`);
      console.log(`   类型: ${image.mimeType}`);
      console.log(`   大小: ${(image.size / 1024).toFixed(2)} KB`);
      console.log(`   上传时间: ${image._createdAt}`);
      console.log('');
    });

    const fileAssets = await client.fetch(`
      *[_type == "sanity.fileAsset"] {
        _id,
        originalFilename,
        mimeType,
        size,
        _createdAt
      } | order(_createdAt desc)[0...5]
    `);

    console.log(`📄 总共找到 ${fileAssets.length} 个文件资源`);
    fileAssets.forEach((file, index) => {
      console.log(`${index + 1}. ${file.originalFilename || '无文件名'}`);
      console.log(`   ID: ${file._id}`);
      console.log(`   类型: ${file.mimeType}`);
      console.log(`   大小: ${(file.size / 1024).toFixed(2)} KB`);
      console.log(`   上传时间: ${file._createdAt}`);
      console.log('');
    });

    // 7. 分析问题
    console.log('\n7️⃣ 问题分析和建议...');

    const inactiveProducts = allProducts.filter(p => !p.isActive);
    const unpublishedProducts = allProducts.filter(p => !p.isPublished);

    if (inactiveProducts.length > 0) {
      console.log(`❌ 发现 ${inactiveProducts.length} 个产品 isActive 不为 true:`);
      inactiveProducts.forEach(p => {
        console.log(`   - ${p.title}: isActive = ${p.isActive}`);
      });
    }

    if (unpublishedProducts.length > 0) {
      console.log(`❌ 发现 ${unpublishedProducts.length} 个产品 isPublished 不为 true:`);
      unpublishedProducts.forEach(p => {
        console.log(`   - ${p.title}: isPublished = ${p.isPublished}`);
      });
    }

    const inactiveSolutions = allSolutions.filter(s => !s.isActive);
    if (inactiveSolutions.length > 0) {
      console.log(`❌ 发现 ${inactiveSolutions.length} 个解决方案文章 isActive 不为 true`);
    }

    const inactiveBrands = allBrands.filter(b => !b.isActive);
    if (inactiveBrands.length > 0) {
      console.log(`❌ 发现 ${inactiveBrands.length} 个品牌 isActive 不为 true`);
    }

    console.log('\n📋 修复建议:');
    console.log('1. 在Sanity Studio中设置产品的 isActive 和 isPublished 为 true');
    console.log('2. 设置文章的 isActive 为 true');
    console.log('3. 设置品牌的 isActive 为 true');
    console.log('4. 或者修改前端查询条件，使其不那么严格');
    console.log('5. 检查前端缓存是否需要清理');

  } catch (error) {
    console.error('❌ 诊断过程中出现错误:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  diagnoseContentVisibility()
    .then(() => {
      console.log('\n✅ 诊断完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 诊断失败:', error);
      process.exit(1);
    });
}

module.exports = { diagnoseContentVisibility };