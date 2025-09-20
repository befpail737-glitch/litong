const { setupTechnicalSupportCategory } = require('./setup-technical-support-category');
const { createSampleSupportArticles } = require('./create-sample-support-articles');

async function setupTechnicalSupport() {
  try {
    console.log('🚀 Starting technical support setup...');

    // 1. 设置技术支持分类
    console.log('\n📝 Step 1: Setting up technical support category...');
    await setupTechnicalSupportCategory();

    // 2. 创建示例技术支持文章
    console.log('\n📝 Step 2: Creating sample technical support articles...');
    await createSampleSupportArticles();

    console.log('\n✅ Technical support setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Visit Sanity Studio to review and edit the articles');
    console.log('2. Create additional technical support articles as needed');
    console.log('3. Test the support pages on the frontend');

  } catch (error) {
    console.error('❌ Technical support setup failed:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  setupTechnicalSupport()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupTechnicalSupport };