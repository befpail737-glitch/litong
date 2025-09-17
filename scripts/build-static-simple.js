#!/usr/bin/env node

/**
 * 简化的静态构建脚本 - 专为CI/CD环境优化
 * 减少内存使用和构建时间
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始简化构建流程...');

const buildEnv = {
  ...process.env,
  NODE_ENV: 'production',
  NEXT_TELEMETRY_DISABLED: '1',
  NEXT_BUILD_LINT: 'false',
  NODE_OPTIONS: '--max-old-space-size=4096'
};

try {
  console.log('\n🏗️ 执行Next.js构建...');

  // 添加图片处理相关的环境变量
  const extendedBuildEnv = {
    ...buildEnv,
    NEXT_IMAGE_FALLBACK_ENABLED: 'true',
    SANITY_IMAGE_ERROR_HANDLING: 'fallback'
  };

  execSync('next build', {
    stdio: 'inherit',
    env: extendedBuildEnv,
    timeout: 600000 // 10分钟超时，给更多时间处理图片问题
  });

  console.log('\n🔧 快速静态文件生成...');

  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) {
    console.error('❌ 构建失败：out目录不存在');
    process.exit(1);
  }

  // 快速验证
  const indexExists = fs.existsSync(path.join(outDir, 'index.html'));
  console.log(`✅ 构建完成 - 根文件存在: ${indexExists}`);

  console.log('🎉 简化构建流程完成！');

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}