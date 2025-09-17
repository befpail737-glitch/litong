#!/usr/bin/env node

/**
 * 修复 Next.js 静态导出与 next-intl 兼容性问题
 * 手动创建本地化目录和文件
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'out');
const locales = ['zh-CN', 'en'];

console.log('🔧 开始修复静态导出的本地化文件...');

// 确保out目录存在
if (!fs.existsSync(outDir)) {
  console.error('❌ out目录不存在，请先运行 npm run build');
  process.exit(1);
}

// 检查是否存在根级别的index.html
const rootIndexPath = path.join(outDir, 'index.html');
let rootIndexContent = '';

if (fs.existsSync(rootIndexPath)) {
  rootIndexContent = fs.readFileSync(rootIndexPath, 'utf8');
  console.log('✅ 找到根级别的index.html文件');
} else {
  // 如果没有根级别的index.html，尝试从.next/server获取
  const serverIndexPath = path.join(process.cwd(), '.next', 'server', 'app', 'index.html');
  if (fs.existsSync(serverIndexPath)) {
    rootIndexContent = fs.readFileSync(serverIndexPath, 'utf8');
    console.log('✅ 从server目录获取index.html内容');
  } else {
    console.error('❌ 无法找到index.html文件');
    process.exit(1);
  }
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

  // 复制HTML文件
  if (!fs.existsSync(localeIndexPath)) {
    fs.writeFileSync(localeIndexPath, rootIndexContent);
    console.log(`📄 创建文件: ${locale}/index.html`);
  } else {
    console.log(`✅ 文件已存在: ${locale}/index.html`);
  }
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

console.log('🎉 静态导出修复完成！');
console.log('');
console.log('生成的文件结构:');
console.log('├── out/');
console.log('│   ├── index.html');
console.log('│   ├── _redirects');
locales.forEach(locale => {
  console.log(`│   ├── ${locale}/`);
  console.log(`│   │   └── index.html`);
});

// 验证文件
let success = true;
locales.forEach(locale => {
  const localeIndexPath = path.join(outDir, locale, 'index.html');
  if (!fs.existsSync(localeIndexPath)) {
    console.error(`❌ 验证失败: ${locale}/index.html 不存在`);
    success = false;
  }
});

if (success) {
  console.log('✅ 所有本地化文件验证成功！');
} else {
  console.error('❌ 文件验证失败');
  process.exit(1);
}