const fs = require('fs');

// 简单的 wrangler.toml 配置验证
function validateWranglerConfig() {
  console.log('🔍 验证 wrangler.toml 配置文件...');

  try {
    const configContent = fs.readFileSync('./wrangler.toml', 'utf8');

    // 检查基本配置项
    const checks = [
      { name: '项目名称', pattern: /name\s*=\s*"litong-electronics"/, required: true },
      { name: '兼容性日期', pattern: /compatibility_date\s*=\s*"2024-01-01"/, required: true },
      { name: '输出目录', pattern: /pages_build_output_dir\s*=\s*"out"/, required: true },
      { name: '兼容性标志', pattern: /compatibility_flags\s*=/, required: true },
      { name: '生产环境配置', pattern: /\[env\.production\]/, required: true },
      { name: '开发环境配置', pattern: /\[env\.development\]/, required: true },
      { name: '顶层vars节', pattern: /^\[vars\]/m, required: false, shouldNotExist: true }
    ];

    let errors = [];
    let warnings = [];

    checks.forEach(check => {
      const matches = configContent.match(check.pattern);

      if (check.shouldNotExist && matches) {
        errors.push(`❌ 不应该存在: ${check.name}`);
      } else if (check.required && !matches) {
        errors.push(`❌ 缺少必需配置: ${check.name}`);
      } else if (matches) {
        console.log(`✅ ${check.name}: 正确`);
      }
    });

    // 检查生产环境变量
    const prodSection = configContent.match(/\[env\.production\]([\s\S]*?)(?=\[env\.development\]|$)/);
    if (prodSection) {
      const prodVars = [
        'NODE_ENV',
        'NEXT_PUBLIC_SITE_URL',
        'SANITY_PROJECT_ID',
        'SANITY_DATASET',
        'EMERGENCY_BUILD'
      ];

      prodVars.forEach(varName => {
        if (prodSection[1].includes(varName)) {
          console.log(`✅ 生产环境变量 ${varName}: 存在`);
        } else {
          warnings.push(`⚠️ 生产环境变量 ${varName}: 缺失`);
        }
      });
    }

    // 显示结果
    console.log('\n📊 验证结果:');
    if (errors.length === 0) {
      console.log('✅ 配置文件语法正确！');
    } else {
      console.log('❌ 发现错误:');
      errors.forEach(error => console.log(`  ${error}`));
    }

    if (warnings.length > 0) {
      console.log('⚠️ 警告:');
      warnings.forEach(warning => console.log(`  ${warning}`));
    }

    console.log('\n🔍 配置文件结构:');
    const lines = configContent.split('\n');
    let sectionCount = 0;
    lines.forEach((line, i) => {
      if (line.match(/^\[.*\]/)) {
        sectionCount++;
        console.log(`  ${sectionCount}. 行 ${i + 1}: ${line.trim()}`);
      }
    });

    return { valid: errors.length === 0, errors, warnings };

  } catch (error) {
    console.error('❌ 配置文件读取失败:', error.message);
    return { valid: false, errors: [error.message], warnings: [] };
  }
}

// 运行验证
const result = validateWranglerConfig();

if (result.valid) {
  console.log('\n🎉 wrangler.toml 配置已准备好用于 Cloudflare Pages 部署！');
  process.exit(0);
} else {
  console.log('\n🚨 请修复配置文件错误后重试');
  process.exit(1);
}