#!/usr/bin/env node
/**
 * 验证所有品牌子目录是否正确生成
 * 用于确保产品列表页、解决方案列表页、技术支持列表页都存在
 */

const fs = require('fs');
const path = require('path');

const BUILD_OUTPUT_DIR = path.join(__dirname, '..', 'out');
const LOCALES = ['zh-CN', 'en'];
const REQUIRED_SUBDIRS = ['products', 'solutions', 'support'];

function checkBrandSubdirectories() {
  console.log('🔍 开始验证品牌子目录...');

  const results = {
    total: 0,
    complete: 0,
    incomplete: 0,
    missing: [],
    summary: {}
  };

  for (const locale of LOCALES) {
    const brandsDir = path.join(BUILD_OUTPUT_DIR, locale, 'brands');

    if (!fs.existsSync(brandsDir)) {
      console.warn(`⚠️ 品牌目录不存在: ${brandsDir}`);
      continue;
    }

    console.log(`\n📂 检查 ${locale} 语言的品牌目录...`);

    const brandEntries = fs.readdirSync(brandsDir, { withFileTypes: true });
    const brandDirs = brandEntries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    console.log(`📋 找到 ${brandDirs.length} 个品牌目录`);

    for (const brandDir of brandDirs) {
      const brandPath = path.join(brandsDir, brandDir);
      const brandName = decodeURIComponent(brandDir);

      results.total++;

      // 检查必需的子目录
      const missingSubdirs = [];
      const existingSubdirs = [];

      for (const subdir of REQUIRED_SUBDIRS) {
        const subdirPath = path.join(brandPath, subdir);
        if (fs.existsSync(subdirPath)) {
          existingSubdirs.push(subdir);
        } else {
          missingSubdirs.push(subdir);
        }
      }

      const isComplete = missingSubdirs.length === 0;

      if (isComplete) {
        results.complete++;
        console.log(`✅ ${brandName}: 完整 (${existingSubdirs.join(', ')})`);
      } else {
        results.incomplete++;
        console.log(`❌ ${brandName}: 缺少 ${missingSubdirs.join(', ')} (已有: ${existingSubdirs.join(', ') || '无'})`);

        results.missing.push({
          locale,
          brand: brandName,
          brandDir,
          missing: missingSubdirs,
          existing: existingSubdirs
        });
      }
    }

    results.summary[locale] = {
      total: brandDirs.length,
      complete: brandDirs.filter(brand => {
        const brandPath = path.join(brandsDir, brand);
        return REQUIRED_SUBDIRS.every(subdir =>
          fs.existsSync(path.join(brandPath, subdir))
        );
      }).length
    };
  }

  return results;
}

function generateReport(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 品牌子目录验证报告');
  console.log('='.repeat(60));

  console.log(`\n总计: ${results.total} 个品牌目录`);
  console.log(`✅ 完整: ${results.complete} 个 (${((results.complete / results.total) * 100).toFixed(1)}%)`);
  console.log(`❌ 不完整: ${results.incomplete} 个 (${((results.incomplete / results.total) * 100).toFixed(1)}%)`);

  // 按语言显示统计
  console.log('\n📋 按语言统计:');
  for (const [locale, stats] of Object.entries(results.summary)) {
    console.log(`  ${locale}: ${stats.complete}/${stats.total} 完整`);
  }

  // 显示缺失详情
  if (results.missing.length > 0) {
    console.log('\n❌ 缺失子目录的品牌:');

    // 按品牌分组
    const missingByBrand = {};
    for (const item of results.missing) {
      if (!missingByBrand[item.brand]) {
        missingByBrand[item.brand] = [];
      }
      missingByBrand[item.brand].push(item);
    }

    for (const [brand, items] of Object.entries(missingByBrand)) {
      console.log(`\n  🏢 ${brand}:`);
      for (const item of items) {
        console.log(`    ${item.locale}: 缺少 ${item.missing.join(', ')}`);
      }
    }

    // 生成修复建议
    console.log('\n🔧 修复建议:');
    console.log('1. 检查 generateStaticParams 中的品牌slug限制是否一致');
    console.log('2. 验证 Sanity 中品牌数据的完整性');
    console.log('3. 检查构建日志中是否有数据获取错误');
    console.log('4. 考虑增加 fallback 机制确保所有品牌都有子目录');
  } else {
    console.log('\n🎉 所有品牌都有完整的子目录！');
  }

  return results;
}

function main() {
  try {
    if (!fs.existsSync(BUILD_OUTPUT_DIR)) {
      console.error(`❌ 构建输出目录不存在: ${BUILD_OUTPUT_DIR}`);
      console.error('请先运行 npm run build');
      process.exit(1);
    }

    const results = checkBrandSubdirectories();
    generateReport(results);

    // 设置退出码
    if (results.incomplete > 0) {
      console.log('\n⚠️ 发现不完整的品牌目录，请检查构建配置');
      process.exit(1);
    } else {
      console.log('\n✅ 所有品牌子目录验证通过！');
      process.exit(0);
    }

  } catch (error) {
    console.error('❌ 验证过程中发生错误:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkBrandSubdirectories, generateReport };