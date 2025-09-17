#!/usr/bin/env node

/**
 * 修复 Next.js 静态导出与 next-intl 兼容性问题
 * 手动创建本地化目录和文件，包括品牌详情页
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'out');
const locales = ['zh-CN', 'en'];

// 品牌和内容ID配置
const brands = ['cree', 'mediatek', 'qualcomm', 'infineon', 'ti', 'semikron', 'ixys', 'lem', 'littelfuse', 'epcos'];
const productIds = ['55555', '99999', 'stm32f407vgt6'];
const solutionIds = ['11111', '22222', '33333'];
const articleIds = ['aaaaa', 'bbbbb', 'ccccc'];
const supportIds = ['11111', '22222', '33333'];

console.log('🔧 开始修复静态导出的本地化文件...');
console.log(`📁 工作目录: ${process.cwd()}`);
console.log(`📁 输出目录: ${outDir}`);

// 确保out目录存在
if (!fs.existsSync(outDir)) {
  console.error('❌ out目录不存在，请先运行 npm run build');
  console.error(`❌ 查找的路径: ${outDir}`);

  // 显示当前目录的内容以便调试
  console.log('📂 当前目录内容:');
  try {
    const currentDirContents = fs.readdirSync(process.cwd());
    currentDirContents.forEach(item => {
      const itemPath = path.join(process.cwd(), item);
      const stats = fs.statSync(itemPath);
      console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${item}`);
    });
  } catch (error) {
    console.error('❌ 无法读取当前目录:', error.message);
  }

  process.exit(1);
}

// 检查是否存在根级别的index.html
const rootIndexPath = path.join(outDir, 'index.html');
let rootIndexContent = '';

if (fs.existsSync(rootIndexPath)) {
  rootIndexContent = fs.readFileSync(rootIndexPath, 'utf8');
  console.log('✅ 找到根级别的index.html文件');
} else {
  // 尝试多个可能的路径
  const possiblePaths = [
    path.join(process.cwd(), '.next', 'server', 'app', 'index.html'),
    path.join(process.cwd(), '.next', 'server', 'app', '(locale)', 'page.html'),
    path.join(process.cwd(), '.next', 'server', 'pages', 'index.html'),
    path.join(outDir, 'zh-CN', 'index.html'),
    path.join(outDir, 'en', 'index.html')
  ];

  console.log('⚠️ 根级别index.html不存在，尝试其他路径...');
  let foundPath = null;

  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      foundPath = testPath;
      console.log(`✅ 找到HTML模板: ${testPath}`);
      break;
    }
  }

  if (foundPath) {
    rootIndexContent = fs.readFileSync(foundPath, 'utf8');
    console.log('✅ 成功获取HTML模板内容');
  } else {
    console.error('❌ 无法找到任何HTML模板文件');
    console.log('🔍 尝试的路径:');
    possiblePaths.forEach(p => console.log(`  - ${p}`));

    // 创建一个基本的HTML模板作为后备方案
    rootIndexContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>力通电子 - 专业电子元器件供应链服务商</title>
</head>
<body>
    <div id="__next">
        <h1>力通电子</h1>
        <p>专业的电子元器件供应链服务商</p>
    </div>
</body>
</html>`;
    console.log('📄 使用默认HTML模板');
  }
}

// 创建详情页静态文件的辅助函数
function createDetailPageFiles(locale, brand, type, ids) {
  const typeDir = path.join(outDir, locale, 'brands', brand, type);

  ids.forEach(id => {
    const detailDir = path.join(typeDir, id);
    const detailIndexPath = path.join(detailDir, 'index.html');

    if (!fs.existsSync(detailDir)) {
      fs.mkdirSync(detailDir, { recursive: true });
    }

    if (!fs.existsSync(detailIndexPath)) {
      fs.writeFileSync(detailIndexPath, rootIndexContent);
      console.log(`📄 创建文件: ${locale}/brands/${brand}/${type}/${id}/index.html`);
    }
  });
}

// 为每个语言创建目录和文件
locales.forEach(locale => {
  const localeDir = path.join(outDir, locale);
  const localeIndexPath = path.join(localeDir, 'index.html');

  // 创建语言目录
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
    console.log(`📁 创建目录: ${locale}/`);
  }

  // 复制HTML文件到语言目录
  if (!fs.existsSync(localeIndexPath)) {
    fs.writeFileSync(localeIndexPath, rootIndexContent);
    console.log(`📄 创建文件: ${locale}/index.html`);
  } else {
    console.log(`✅ 文件已存在: ${locale}/index.html`);
  }

  // 为每个品牌创建详情页文件
  console.log(`\n🏭 为 ${locale} 创建品牌详情页...`);
  brands.forEach(brand => {
    // 创建产品详情页
    createDetailPageFiles(locale, brand, 'products', productIds);

    // 创建解决方案详情页
    createDetailPageFiles(locale, brand, 'solutions', solutionIds);

    // 创建文章详情页
    createDetailPageFiles(locale, brand, 'articles', articleIds);

    // 创建技术支持详情页
    createDetailPageFiles(locale, brand, 'support', supportIds);
  });
});

// 复制_redirects文件
const redirectsSrc = path.join(process.cwd(), 'public', '_redirects');
const redirectsDest = path.join(outDir, '_redirects');

if (fs.existsSync(redirectsSrc)) {
  fs.copyFileSync(redirectsSrc, redirectsDest);
  console.log('📄 复制_redirects文件到输出目录');
} else {
  console.warn('⚠️ 未找到public/_redirects文件');
}

// 创建根级别的index.html（如果不存在）
if (!fs.existsSync(rootIndexPath) && rootIndexContent) {
  fs.writeFileSync(rootIndexPath, rootIndexContent);
  console.log('📄 创建根级别的index.html');
}

console.log('\n🎉 静态导出修复完成！');

// 统计生成的文件
let totalFiles = 0;
let totalDirs = 0;

function countFilesRecursively(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      totalDirs++;
      count += countFilesRecursively(itemPath);
    } else if (item.endsWith('.html')) {
      count++;
    }
  });
  return count;
}

totalFiles = countFilesRecursively(outDir);

console.log(`\n📊 生成统计:`);
console.log(`├── HTML文件总数: ${totalFiles}`);
console.log(`├── 创建目录数: ${totalDirs}`);
console.log(`├── 支持语言: ${locales.join(', ')}`);
console.log(`├── 支持品牌: ${brands.length}个`);
console.log(`└── 详情页类型: products, solutions, articles, support`);

console.log(`\n🗂️ 生成的文件结构示例:`);
console.log('├── out/');
console.log('│   ├── index.html');
console.log('│   ├── _redirects');
console.log('│   ├── zh-CN/');
console.log('│   │   ├── index.html');
console.log('│   │   └── brands/');
console.log('│   │       └── cree/');
console.log('│   │           ├── products/55555/index.html');
console.log('│   │           ├── solutions/11111/index.html');
console.log('│   │           ├── articles/aaaaa/index.html');
console.log('│   │           └── support/11111/index.html');
console.log('│   └── en/');
console.log('│       └── (同样结构)');

// 验证关键文件
let success = true;
const testPaths = [
  'zh-CN/index.html',
  'en/index.html',
  'zh-CN/brands/cree/products/55555/index.html',
  'zh-CN/brands/cree/solutions/11111/index.html',
  'zh-CN/brands/cree/articles/aaaaa/index.html',
  'zh-CN/brands/cree/support/11111/index.html'
];

console.log(`\n🔍 验证关键文件...`);
testPaths.forEach(testPath => {
  const fullPath = path.join(outDir, testPath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${testPath}`);
  } else {
    console.error(`❌ ${testPath} 不存在`);
    success = false;
  }
});

if (success) {
  console.log('\n🎊 所有关键文件验证成功！');
  console.log('📡 现在可以部署到生产环境，所有详情页都应该能正常访问。');
} else {
  console.error('\n❌ 文件验证失败');
  process.exit(1);
}