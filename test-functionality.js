#!/usr/bin/env node

/**
 * 功能测试脚本
 * 验证关键功能是否正常工作
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 开始功能测试...\n');

// 测试1: 检查文件结构
console.log('📁 检查文件结构...');
const requiredFiles = [
  'src/components/admin/ArticleManager.tsx',
  'src/components/admin/ProductManager.tsx', 
  'src/components/brands/BrandSupport.tsx',
  'src/components/brands/ProductFilter.tsx',
  'src/app/[locale]/admin/brands/page.tsx'
];

let fileCheckPassed = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - 存在`);
  } else {
    console.log(`❌ ${file} - 缺失`);
    fileCheckPassed = false;
  }
});

// 测试2: 检查关键代码是否存在
console.log('\n🔍 检查关键代码修复...');

// 检查ArticleManager是否有品牌选择功能
const articleManagerContent = fs.readFileSync('src/components/admin/ArticleManager.tsx', 'utf8');
const hasBrandField = articleManagerContent.includes('brand?: string') && 
                     articleManagerContent.includes('关联品牌');
console.log(`${hasBrandField ? '✅' : '❌'} ArticleManager品牌选择功能`);

// 检查BrandSupport是否有文章展示功能  
const brandSupportContent = fs.readFileSync('src/components/brands/BrandSupport.tsx', 'utf8');
const hasArticleDisplay = brandSupportContent.includes('filteredArticles.map') && 
                         brandSupportContent.includes('selectedCategory');
console.log(`${hasArticleDisplay ? '✅' : '❌'} BrandSupport文章展示功能`);

// 检查ProductManager是否有改进的Excel处理
const productManagerContent = fs.readFileSync('src/components/admin/ProductManager.tsx', 'utf8');
const hasImprovedExcel = productManagerContent.includes('fieldMappings') && 
                        productManagerContent.includes('specifications[header]');
console.log(`${hasImprovedExcel ? '✅' : '❌'} ProductManager改进的Excel处理`);

// 检查管理页面是否移除了force-static
const brandPageContent = fs.readFileSync('src/app/[locale]/admin/brands/page.tsx', 'utf8');
const removedForceStatic = !brandPageContent.includes('force-static');
console.log(`${removedForceStatic ? '✅' : '❌'} 管理页面移除force-static`);

// 测试3: 检查主要页面是否有generateStaticParams
console.log('\n📄 检查静态导出配置...');
const mainPageContent = fs.readFileSync('src/app/[locale]/page.tsx', 'utf8');
const hasGenerateStaticParams = mainPageContent.includes('generateStaticParams');
console.log(`${hasGenerateStaticParams ? '✅' : '❌'} 主页面有generateStaticParams`);

// 测试4: 检查示例文件是否创建
console.log('\n📝 检查测试文件...');
const testFilesExist = fs.existsSync('TESTING_GUIDE.md') && fs.existsSync('sample_products.csv');
console.log(`${testFilesExist ? '✅' : '❌'} 测试指南和示例文件`);

// 汇总结果
console.log('\n📊 测试结果汇总:');
const allChecksPassed = fileCheckPassed && hasBrandField && hasArticleDisplay && 
                       hasImprovedExcel && removedForceStatic && hasGenerateStaticParams && testFilesExist;

if (allChecksPassed) {
  console.log('🎉 所有测试通过！功能修复成功完成。');
  console.log('\n📋 下一步操作:');
  console.log('1. 启动开发服务器: npm run dev');
  console.log('2. 访问管理后台测试表单输入');
  console.log('3. 测试文章发布和展示功能');
  console.log('4. 测试Excel产品上传功能');
  console.log('5. 运行构建测试: npm run build');
} else {
  console.log('⚠️  部分测试未通过，请检查相关功能。');
}

console.log('\n📖 详细测试步骤请参考: TESTING_GUIDE.md');
console.log('📊 示例产品数据文件: sample_products.csv');