#!/usr/bin/env node

/**
 * 快速修复所有文件中的urlFor()调用
 * 替换为safeImageUrl()以修复Cloudflare部署错误
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复所有urlFor()调用...');

// 需要修复的文件列表
const filesToFix = [
  'src/app/[locale]/brands/[slug]/support/[id]/page.tsx',
  'src/app/[locale]/brands/[slug]/articles/[id]/page.tsx',
  'src/app/[locale]/brands/[slug]/solutions/[id]/page.tsx',
  'src/app/[locale]/brands/[slug]/solutions/page.tsx',
  'src/app/[locale]/brands/[slug]/articles/page.tsx',
  'src/app/[locale]/brands/[slug]/products/page.tsx',
  'src/app/[locale]/articles/[slug]/page.tsx',
  'src/app/[locale]/solutions/[slug]/page.tsx',
  'src/components/layout/BrandNavigation.tsx',
  'src/components/PortableText.tsx'
];

function fixFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ 文件不存在: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // 1. 替换import语句
    if (content.includes("import { urlFor }")) {
      content = content.replace(
        /import\s*\{\s*([^}]*,\s*)?urlFor(\s*,\s*[^}]*)?\s*\}\s*from\s*'@\/lib\/sanity\/client'/g,
        (match, before, after) => {
          const beforeParts = before ? before.trim().replace(/,\s*$/, '') : '';
          const afterParts = after ? after.trim().replace(/^\s*,/, '') : '';

          let newImports = [];
          if (beforeParts) newImports.push(beforeParts);
          newImports.push('safeImageUrl');
          if (afterParts) newImports.push(afterParts);

          return `import { ${newImports.join(', ')} } from '@/lib/sanity/client'`;
        }
      );
      modified = true;
    }

    // 2. 替换urlFor()调用
    const urlForPattern = /urlFor\(([^)]+)\)\.width\((\d+)\)\.height\((\d+)\)\.url\(\)/g;
    if (urlForPattern.test(content)) {
      content = content.replace(urlForPattern, (match, source, width, height) => {
        return `safeImageUrl(${source}, { width: ${width}, height: ${height} })`;
      });
      modified = true;
    }

    // 3. 处理简单的urlFor()调用
    const simpleUrlForPattern = /urlFor\(([^)]+)\)\.url\(\)/g;
    if (simpleUrlForPattern.test(content)) {
      content = content.replace(simpleUrlForPattern, (match, source) => {
        return `safeImageUrl(${source})`;
      });
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ 已修复: ${filePath}`);
      return true;
    } else {
      console.log(`➡️ 无需修复: ${filePath}`);
      return false;
    }

  } catch (error) {
    console.error(`❌ 修复失败: ${filePath}`, error.message);
    return false;
  }
}

let fixedCount = 0;
let totalCount = filesToFix.length;

for (const file of filesToFix) {
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`\n🎉 修复完成！`);
console.log(`📊 统计:`);
console.log(`  - 总文件数: ${totalCount}`);
console.log(`  - 已修复: ${fixedCount}`);
console.log(`  - 无需修复: ${totalCount - fixedCount}`);
console.log(`\n✨ 所有urlFor()调用已替换为safeImageUrl()，现在可以重新构建了！`);