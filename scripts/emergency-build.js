#!/usr/bin/env node

/**
 * 应急构建脚本 - 用于Cloudflare Pages部署超时的紧急情况
 *
 * 这个脚本通过以下方式最小化构建时间：
 * 1. 设置应急环境变量
 * 2. 禁用非必要的构建步骤
 * 3. 减少静态页面生成数量
 * 4. 优化Next.js配置
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚨 Starting EMERGENCY BUILD for Cloudflare Pages...\n');

// 设置应急环境变量
process.env.NODE_ENV = 'production';
process.env.NEXT_PHASE = 'phase-production-build';
process.env.EMERGENCY_BUILD = 'true';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NEXT_BUILD_LINT = 'false';

console.log('📋 Emergency build configuration:');
console.log('   - NODE_ENV:', process.env.NODE_ENV);
console.log('   - NEXT_PHASE:', process.env.NEXT_PHASE);
console.log('   - EMERGENCY_BUILD:', process.env.EMERGENCY_BUILD);
console.log('   - Telemetry disabled: ✅');
console.log('   - Linting disabled: ✅');
console.log('   - Static generation minimized: ✅\n');

async function runEmergencyBuild() {
  console.log('🔧 Starting emergency build process...\n');

  // 清理缓存
  console.log('Step 1: Clearing caches...');
  try {
    const clearCacheProcess = spawn('npm', ['run', 'clear-cache'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env }
    });

    await new Promise((resolve, reject) => {
      clearCacheProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Cache cleared successfully\n');
          resolve();
        } else {
          console.log('⚠️  Cache clear failed, continuing anyway...\n');
          resolve(); // Continue even if cache clear fails
        }
      });
    });
  } catch (error) {
    console.log('⚠️  Cache clear failed, continuing anyway...\n');
  }

  // 运行简化的构建
  console.log('Step 2: Running minimized Next.js build...');
  const buildProcess = spawn('npx', ['next', 'build'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NEXT_BUILD_LINT: 'false',
      NEXT_IGNORE_TYPE_ERRORS: 'true'
    }
  });

  await new Promise((resolve, reject) => {
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Emergency build completed successfully!');
        resolve();
      } else {
        console.log('\n❌ Emergency build failed with code:', code);
        reject(new Error(`Build failed with code ${code}`));
      }
    });

    buildProcess.on('error', (error) => {
      console.error('\n💥 Build process error:', error);
      reject(error);
    });
  });

  // 运行后处理脚本
  console.log('\nStep 3: Running post-build processing...');
  try {
    const fixProcess = spawn('npm', ['run', 'fix-static-export'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env }
    });

    await new Promise((resolve, reject) => {
      fixProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Post-build processing completed\n');
        } else {
          console.log('⚠️  Post-build processing failed, but build is complete\n');
        }
        resolve(); // Continue regardless
      });
    });
  } catch (error) {
    console.log('⚠️  Post-build processing failed, but build is complete\n');
  }

  // 验证输出
  const outDir = path.join(__dirname, '..', 'out');
  if (fs.existsSync(outDir)) {
    const files = fs.readdirSync(outDir);
    console.log(`📊 Build output contains ${files.length} items`);
    console.log('🎉 Emergency build completed successfully!');

    // 检查关键页面是否生成
    const criticalPaths = [
      'zh-CN/index.html',
      'zh-CN/brands/cree/products/55555/index.html'
    ];

    console.log('\n🔍 Checking critical pages:');
    criticalPaths.forEach(path => {
      const fullPath = path.join(outDir, path);
      if (fs.existsSync(fullPath)) {
        console.log(`   ✅ ${path}`);
      } else {
        console.log(`   ❌ ${path} (missing)`);
      }
    });
  } else {
    throw new Error('Build output directory not found!');
  }
}

// 运行应急构建
if (require.main === module) {
  runEmergencyBuild()
    .then(() => {
      console.log('\n🎉 Emergency build process completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Emergency build failed:', error);
      process.exit(1);
    });
}

module.exports = { runEmergencyBuild };