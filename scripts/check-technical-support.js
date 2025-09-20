// 使用项目现有的 Sanity 客户端检查技术支持设置
const path = require('path');

// 动态导入项目的 Sanity 客户端
async function checkTechnicalSupport() {
  try {
    // 设置环境变量
    if (!process.env.SANITY_API_TOKEN) {
      process.env.SANITY_API_TOKEN = process.env.SANITY_TOKEN || 'skHT9TklqZwqy4UmgBOtfV0N8PEqkX0AJlYBqULbEJRcHrfHAOFjI8zDM9I5gU7VNWlO2tQkP4aBcDeFgH3IjKlMnOpQrStUvWxYz';
    }

    console.log('🔍 Checking technical support system...');

    // 导入项目的 Sanity 客户端
    const clientPath = path.join(__dirname, '../src/lib/sanity/client.ts');
    console.log('📁 Importing client from:', clientPath);

    // 由于 TypeScript 模块导入问题，我们将使用 Node.js 原生的方式检查
    const { execSync } = require('child_process');

    // 检查技术支持分类
    console.log('\n1. 检查技术支持分类...');
    try {
      const categoriesCheck = execSync('npx tsx scripts/sanity-query.ts "articleCategory"', {
        cwd: process.cwd(),
        encoding: 'utf8',
        timeout: 30000
      });
      console.log('分类查询结果:', categoriesCheck);
    } catch (error) {
      console.log('分类查询失败，可能需要创建技术支持分类');
    }

    // 检查技术支持文章
    console.log('\n2. 检查技术支持文章...');
    try {
      const articlesCheck = execSync('npx tsx scripts/sanity-query.ts "article" "support"', {
        cwd: process.cwd(),
        encoding: 'utf8',
        timeout: 30000
      });
      console.log('技术支持文章查询结果:', articlesCheck);
    } catch (error) {
      console.log('技术支持文章查询失败，可能需要创建');
    }

    // 检查图片问题
    console.log('\n3. 检查图片问题...');
    try {
      const imagesCheck = execSync('npx tsx scripts/sanity-query.ts "article" "images"', {
        cwd: process.cwd(),
        encoding: 'utf8',
        timeout: 30000
      });
      console.log('图片检查结果:', imagesCheck);
    } catch (error) {
      console.log('图片检查失败');
    }

    console.log('\n✅ 技术支持系统检查完成');

  } catch (error) {
    console.error('❌ 检查过程中出现错误:', error.message);

    // 提供手动检查建议
    console.log('\n📝 手动检查步骤:');
    console.log('1. 启动 Sanity Studio: npm run sanity:dev');
    console.log('2. 检查文章分类中是否有"技术支持"分类');
    console.log('3. 检查是否有 articleType 为 "support" 的文章');
    console.log('4. 检查文章中的图片是否显示正常');
  }
}

if (require.main === module) {
  checkTechnicalSupport()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('检查失败:', error);
      process.exit(1);
    });
}

module.exports = { checkTechnicalSupport };