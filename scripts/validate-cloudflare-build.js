#!/usr/bin/env node
/**
 * Cloudflare部署验证脚本
 * 验证构建配置和图片处理，确保Cloudflare Pages部署成功
 */

const fs = require('fs');
const path = require('path');

// Cloudflare特定验证
function validateCloudflareConfiguration() {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    summary: {
      wrangler: false,
      imageHandling: false,
      nodeVersion: false,
      buildConfig: false
    }
  };

  console.log('☁️ Cloudflare部署配置验证\n');

  // 1. 验证wrangler.toml配置
  console.log('🔍 检查wrangler.toml配置...');
  try {
    const wranglerPath = path.join(process.cwd(), 'wrangler.toml');
    if (!fs.existsSync(wranglerPath)) {
      result.errors.push('Missing wrangler.toml file');
      result.isValid = false;
    } else {
      const wranglerContent = fs.readFileSync(wranglerPath, 'utf8');

      // 检查Pages项目必要配置
      const requiredConfigs = [
        'pages_build_output_dir = "out"',
        'compatibility_flags',
        'nodejs_compat',
        'SANITY_PROJECT_ID',
        'SANITY_DATASET'
      ];

      for (const config of requiredConfigs) {
        if (!wranglerContent.includes(config)) {
          result.warnings.push(`Missing or incomplete config: ${config}`);
        }
      }

      // 检查Pages项目不兼容的配置
      const incompatibleConfigs = [
        { pattern: /^build\s*=/, name: 'build command' },
        { pattern: /^main\s*=/, name: 'main script' },
        { pattern: /^workers_dev\s*=/, name: 'workers_dev' }
      ];

      for (const config of incompatibleConfigs) {
        if (config.pattern.test(wranglerContent)) {
          result.errors.push(`Incompatible configuration found: ${config.name} is not supported in Pages projects`);
          result.isValid = false;
        }
      }

      console.log('  ✅ wrangler.toml found and analyzed');
      result.summary.wrangler = true;
    }
  } catch (error) {
    result.errors.push(`Error reading wrangler.toml: ${error.message}`);
    result.isValid = false;
  }

  // 2. 验证图片处理配置
  console.log('\n🔍 检查图片处理配置...');
  try {
    // 检查safeImageUrl函数
    const clientPath = path.join(process.cwd(), 'src/lib/sanity/client.ts');
    if (fs.existsSync(clientPath)) {
      const clientContent = fs.readFileSync(clientPath, 'utf8');

      if (clientContent.includes('typeof source === \'string\'')) {
        console.log('  ✅ Static path detection implemented');
      } else {
        result.warnings.push('Missing static path detection in safeImageUrl');
      }

      if (clientContent.includes('ref.startsWith(\'image-\')')) {
        console.log('  ✅ Sanity asset _ref validation implemented');
      } else {
        result.warnings.push('Missing Sanity asset _ref validation');
      }

      result.summary.imageHandling = true;
    } else {
      result.errors.push('Missing src/lib/sanity/client.ts');
      result.isValid = false;
    }
  } catch (error) {
    result.errors.push(`Error checking image handling: ${error.message}`);
    result.isValid = false;
  }

  // 3. 验证Node.js版本要求
  console.log('\n🔍 检查Node.js版本要求...');
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    if (packageJson.engines && packageJson.engines.node) {
      const nodeVersion = packageJson.engines.node;
      if (nodeVersion.includes('20.11.0') || nodeVersion.includes('>=20.11')) {
        console.log(`  ✅ Node.js version requirement: ${nodeVersion}`);
        result.summary.nodeVersion = true;
      } else {
        result.warnings.push(`Node.js version may be too old: ${nodeVersion}`);
      }
    } else {
      result.warnings.push('No Node.js version specified in engines');
    }
  } catch (error) {
    result.errors.push(`Error checking Node.js version: ${error.message}`);
    result.isValid = false;
  }

  // 4. 检查fallback品牌数据
  console.log('\n🔍 检查fallback品牌数据...');
  try {
    const fallbackPath = path.join(process.cwd(), 'src/lib/data/fallback-brands.ts');
    if (fs.existsSync(fallbackPath)) {
      const fallbackContent = fs.readFileSync(fallbackPath, 'utf8');

      // 检查是否还有未注释的logo路径（排除已注释的）
      const logoMatches = fallbackContent.match(/^\s*logo: ['"]/gm);
      if (logoMatches && logoMatches.length > 0) {
        result.warnings.push(`Found ${logoMatches.length} uncommented logo paths in fallback data`);
      } else {
        console.log('  ✅ No uncommented logo paths found');
      }

      const commentedLogos = fallbackContent.match(/\/\/ logo:/g);
      if (commentedLogos) {
        console.log(`  ✅ ${commentedLogos.length} logo paths properly commented out`);
      }
    }
  } catch (error) {
    result.warnings.push(`Error checking fallback brand data: ${error.message}`);
  }

  // 5. 验证构建脚本
  console.log('\n🔍 检查构建脚本配置...');
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    if (packageJson.scripts) {
      const buildScript = packageJson.scripts.build;
      if (buildScript && buildScript.includes('clear-cache')) {
        console.log('  ✅ Build script includes cache clearing');
      } else {
        result.warnings.push('Build script may not clear cache properly');
      }

      if (packageJson.scripts['validate-cloudflare']) {
        console.log('  ✅ Cloudflare validation script available');
      }

      result.summary.buildConfig = true;
    }
  } catch (error) {
    result.warnings.push(`Error checking build configuration: ${error.message}`);
  }

  return result;
}

// 主验证函数
async function validateCloudflareDeployment() {
  try {
    console.log('☁️ Cloudflare Pages部署验证\n');

    const result = validateCloudflareConfiguration();

    // 显示验证结果
    console.log('\n' + '='.repeat(60));
    console.log('📊 Cloudflare部署验证报告');
    console.log('='.repeat(60));

    console.log('\n📋 验证状态:');
    console.log(`  Wrangler配置: ${result.summary.wrangler ? '✅ 通过' : '❌ 失败'}`);
    console.log(`  图片处理: ${result.summary.imageHandling ? '✅ 通过' : '❌ 失败'}`);
    console.log(`  Node.js版本: ${result.summary.nodeVersion ? '✅ 通过' : '❌ 失败'}`);
    console.log(`  构建配置: ${result.summary.buildConfig ? '✅ 通过' : '❌ 失败'}`);

    if (result.errors.length > 0) {
      console.log('\n❌ 发现错误:');
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️ 警告信息:');
      result.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }

    console.log('\n🔧 Cloudflare Pages优化建议:');
    console.log('  • 确保所有静态图片路径不会传递给Sanity处理器');
    console.log('  • 使用Node.js v20.11.0+以满足依赖要求');
    console.log('  • 启用nodejs_compat兼容性标志');
    console.log('  • 配置适当的环境变量用于生产构建');
    console.log('  • 避免使用Workers专用配置（如build命令）');
    console.log('  • 确保pages_build_output_dir指向正确的输出目录');

    console.log('\n' + '='.repeat(60));
    if (result.isValid && result.warnings.length === 0) {
      console.log('✅ Cloudflare部署验证通过！配置已优化。');
      console.log('🚀 可以安全部署到Cloudflare Pages。');
      process.exit(0);
    } else if (result.isValid && result.warnings.length > 0) {
      console.log('⚠️ Cloudflare部署验证基本通过，但有警告。');
      console.log('💡 建议解决警告后再部署以获得最佳效果。');
      process.exit(0);
    } else {
      console.log('❌ Cloudflare部署验证失败！');
      console.log('🛑 请修复错误后再尝试部署。');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ 验证过程中发生错误:', error);
    process.exit(1);
  }
}

// 主函数
async function main() {
  try {
    await validateCloudflareDeployment();
  } catch (error) {
    console.error('严重错误:', error);
    process.exit(1);
  }
}

// 执行验证
if (require.main === module) {
  main();
}

module.exports = { validateCloudflareDeployment };