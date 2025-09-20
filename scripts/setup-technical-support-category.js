const sanityClient = require('@sanity/client');

// Sanity client configuration
const client = sanityClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-01',
  token: process.env.SANITY_TOKEN, // 需要写入权限的token
  useCdn: false,
});

async function setupTechnicalSupportCategory() {
  try {
    console.log('🔍 Checking if technical-support category exists...');

    // 检查是否已存在technical-support分类
    const existingCategory = await client.fetch(
      `*[_type == "articleCategory" && slug.current == "technical-support"][0]`
    );

    if (existingCategory) {
      console.log('✅ Technical support category already exists:', existingCategory);
      return existingCategory;
    }

    console.log('📝 Creating technical-support category...');

    // 创建新的技术支持分类
    const newCategory = await client.create({
      _type: 'articleCategory',
      name: '技术支持',
      slug: {
        _type: 'slug',
        current: 'technical-support'
      },
      isVisible: true
    });

    console.log('✅ Technical support category created successfully:', newCategory);
    return newCategory;

  } catch (error) {
    console.error('❌ Error setting up technical support category:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  setupTechnicalSupportCategory()
    .then(() => {
      console.log('✅ Setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupTechnicalSupportCategory };