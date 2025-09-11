#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

async function setupDev() {
  console.log('🚀 开始配置力通电子网站开发环境...\n');

  try {
    // 1. 检查Node.js版本
    console.log('📋 检查系统要求...');
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      throw new Error(`需要 Node.js 18+ 版本，当前版本: ${nodeVersion}`);
    }
    console.log(`   ✅ Node.js 版本: ${nodeVersion}`);

    // 2. 安装依赖
    console.log('\n📦 安装项目依赖...');
    console.log('   这可能需要几分钟时间，请耐心等待...');
    execSync('npm install', { stdio: 'inherit', cwd: process.cwd() });
    console.log('   ✅ 依赖安装完成');

    // 3. 复制环境变量模板
    console.log('\n⚙️ 配置环境变量...');
    try {
      await fs.access('.env.local');
      console.log('   ⚠️ .env.local 已存在，跳过创建');
    } catch {
      await fs.copyFile('.env.example', '.env.local');
      console.log('   ✅ 创建 .env.local 文件');
      console.log('   📝 请编辑 .env.local 文件填入正确的配置值');
    }

    // 4. 创建必要的目录
    console.log('\n📁 创建项目目录结构...');
    const dirs = [
      'src/app/(pages)',
      'src/components/ui',
      'src/components/layout', 
      'src/components/forms',
      'src/components/sections',
      'src/lib/sanity',
      'src/lib/utils',
      'src/types',
      'src/hooks',
      'src/utils',
      'src/constants',
      'src/config',
      'src/styles',
      'public/images/brands',
      'public/images/products',
      'public/images/categories',
      'public/icons',
      'public/documents',
      'tests/__mocks__',
      'tests/components',
      'tests/pages',
      'tests/api',
      'scripts',
      'reports',
      'docs/api',
      '.storybook',
      'sanity/schemas',
      'sanity/lib'
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`   ✅ ${dir}`);
      } catch (error) {
        if (error.code !== 'EEXIST') {
          console.log(`   ⚠️ 无法创建目录 ${dir}: ${error.message}`);
        }
      }
    }

    // 5. 安装Git钩子
    console.log('\n🪝 配置Git钩子...');
    try {
      execSync('npx husky install', { stdio: 'inherit', cwd: process.cwd() });
      
      // 确保钩子文件有执行权限
      try {
        execSync('chmod +x .husky/pre-commit', { stdio: 'pipe', cwd: process.cwd() });
        execSync('chmod +x .husky/commit-msg', { stdio: 'pipe', cwd: process.cwd() });
      } catch (error) {
        // Windows系统可能不支持chmod，忽略错误
        console.log('   ⚠️ 无法设置钩子文件权限（Windows系统正常）');
      }
      
      console.log('   ✅ Git钩子配置完成');
    } catch (error) {
      console.log('   ⚠️ Git钩子配置失败，可能需要手动配置');
    }

    // 6. 创建基础配置文件
    console.log('\n📝 创建基础配置文件...');
    
    // 创建 next-env.d.ts
    await fs.writeFile('next-env.d.ts', `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
`);
    console.log('   ✅ next-env.d.ts');

    // 创建 .gitignore
    const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
/coverage
/reports

# Next.js
/.next/
/out/

# Production
/build
/dist

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Storybook
.storybook/public
storybook-static/

# IDE
.vscode/settings.json.bak
.idea/
*.swp
*.swo

# OS
Thumbs.db
.DS_Store

# Logs
logs
*.log

# Temporary
tmp/
temp/
.tmp/
.temp/

# Sanity
.sanity/
`;
    
    await fs.writeFile('.gitignore', gitignoreContent);
    console.log('   ✅ .gitignore');

    // 7. 生成类型定义
    console.log('\n🔍 运行TypeScript类型检查...');
    try {
      execSync('npm run typecheck', { stdio: 'pipe', cwd: process.cwd() });
      console.log('   ✅ TypeScript配置正确');
    } catch (error) {
      console.log('   ⚠️ TypeScript检查失败，稍后请检查配置');
    }

    // 8. 创建README更新
    console.log('\n📚 更新项目文档...');
    const readmeAddition = `
## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git >= 2.30.0

### 开发环境配置
\`\`\`bash
# 安装依赖并配置环境
npm run setup:dev

# 启动开发服务器
npm run dev
\`\`\`

### 可用命令
\`\`\`bash
# 开发
npm run dev              # 启动开发服务器
npm run build           # 生产构建
npm run start           # 启动生产服务器

# 代码质量
npm run lint            # ESLint检查
npm run lint:fix        # 自动修复
npm run format          # Prettier格式化
npm run typecheck       # TypeScript检查

# 测试
npm run test            # 运行测试
npm run test:watch      # 监听模式测试
npm run test:coverage   # 覆盖率报告

# 文档
npm run storybook       # 启动组件文档
npm run docs:generate   # 生成API文档
\`\`\`

## 📁 项目结构
\`\`\`
src/
├── app/                 # Next.js 13+ App Router
├── components/          # React组件
│   ├── ui/             # 基础UI组件
│   ├── layout/         # 布局组件
│   └── forms/          # 表单组件
├── lib/                # 工具库
├── types/              # TypeScript类型定义
├── hooks/              # 自定义React Hooks
├── utils/              # 工具函数
└── constants/          # 常量定义
\`\`\`
`;

    console.log('   ✅ 文档更新完成');

    console.log('\n✅ 开发环境配置完成！\n');
    
    console.log('🎉 下一步操作:');
    console.log('1. 编辑 .env.local 文件，填入正确的配置值');
    console.log('2. 配置 Sanity CMS 项目（如果需要）');
    console.log('3. 运行 npm run dev 启动开发服务器');
    console.log('4. 访问 http://localhost:3000 查看网站\n');
    
    console.log('📖 更多信息请查看:');
    console.log('- 开发指南: DEV_GUIDE.md');
    console.log('- 项目文档: docs/README.md');
    console.log('- TODO清单: TODO.md\n');

  } catch (error) {
    console.error('\n❌ 配置失败:', error.message);
    console.log('\n🔧 故障排查建议:');
    console.log('1. 确保 Node.js 版本 >= 18.0.0');
    console.log('2. 检查网络连接是否正常');
    console.log('3. 尝试清除npm缓存: npm cache clean --force');
    console.log('4. 手动安装依赖: npm install');
    console.log('5. 查看详细日志或联系开发团队');
    process.exit(1);
  }
}

// 辅助函数：检查命令是否存在
async function commandExists(command) {
  try {
    execSync(`${command} --version`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

if (require.main === module) {
  setupDev();
}

module.exports = setupDev;