#!/usr/bin/env node

/**
 * Cloudflare Pages专用构建脚本
 * 确保在CI/CD环境中能够正确构建和部署
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始Cloudflare Pages构建流程...');
console.log('🌍 环境信息:');
console.log(`  - Node版本: ${process.version}`);
console.log(`  - 工作目录: ${process.cwd()}`);
console.log(`  - 环境: ${process.env.NODE_ENV || 'development'}`);

try {
  console.log('\n📦 安装依赖...');
  execSync('npm ci --prefer-offline --no-audit', { stdio: 'inherit' });

  console.log('\n🧹 清理缓存...');
  execSync('npm run clear-cache', { stdio: 'inherit' });

  console.log('\n🏗️ 构建项目（优化模式）...');
  const buildEnv = {
    ...process.env,
    NODE_ENV: 'production',
    NEXT_TELEMETRY_DISABLED: '1',
    NEXT_BUILD_LINT: 'false'
  };
  execSync('next build', { stdio: 'inherit', env: buildEnv });

  console.log('\n🔧 修复静态导出...');
  execSync('npm run fix-static-export', { stdio: 'inherit' });

  // 验证构建结果
  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) {
    throw new Error('构建失败：out目录不存在');
  }

  // 统计生成的文件
  function countFiles(dir) {
    if (!fs.existsSync(dir)) return 0;
    let count = 0;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        count += countFiles(itemPath);
      } else if (item.endsWith('.html')) {
        count++;
      }
    }
    return count;
  }

  const htmlFileCount = countFiles(outDir);
  console.log(`\n📊 构建完成统计:`);
  console.log(`  - HTML文件总数: ${htmlFileCount}`);
  console.log(`  - 输出目录: ${outDir}`);

  // 验证关键文件
  const keyFiles = [
    'index.html',
    '_redirects',
    'zh-CN/index.html',
    'en/index.html',
    'zh-CN/brands/cree/products/55555/index.html',
    'zh-CN/brands/cree/support/11111/index.html'
  ];

  console.log('\n🔍 验证关键文件:');
  let allFilesExist = true;
  for (const file of keyFiles) {
    const filePath = path.join(outDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} - 缺失`);
      allFilesExist = false;
    }
  }

  if (allFilesExist) {
    console.log('\n🎉 Cloudflare Pages构建成功完成！');
    console.log('📡 所有静态文件已准备就绪，可以部署到生产环境。');
  } else {
    throw new Error('构建验证失败：部分关键文件缺失');
  }

} catch (error) {
  console.error('\n❌ Cloudflare Pages构建失败:');
  console.error(error.message);

  // 显示调试信息
  console.log('\n🔍 调试信息:');
  try {
    const currentDirContents = fs.readdirSync(process.cwd());
    console.log('📂 根目录内容:');
    currentDirContents.forEach(item => {
      const itemPath = path.join(process.cwd(), item);
      const stats = fs.statSync(itemPath);
      console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${item}`);
    });
  } catch (debugError) {
    console.error('❌ 无法获取调试信息:', debugError.message);
  }

  process.exit(1);
}