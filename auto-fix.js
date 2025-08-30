#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 立通电子 - 自动修复脚本');
console.log('====================================');

const fixes = [];

// 修复函数
function addFix(name, status, details = '') {
  fixes.push({ name, status, details, timestamp: new Date().toLocaleTimeString() });
  const statusIcon = status === 'success' ? '✅' : status === 'error' ? '❌' : '⚠️';
  console.log(`${statusIcon} ${name} ${details ? '- ' + details : ''}`);
}

// 1. 检查并修复 package.json 依赖
function checkPackageJson() {
  try {
    const packagePath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // 检查必需的依赖
    const requiredDeps = {
      '@sanity/client': '^6.10.0',
      '@sanity/vision': '^3.25.0',
      'next-sanity': '^7.1.4',
      'sanity': '^3.25.0'
    };
    
    const requiredDevDeps = {
      '@sanity/cli': '^3.25.0'
    };
    
    let needsUpdate = false;
    
    // 检查生产依赖
    for (const [dep, version] of Object.entries(requiredDeps)) {
      if (!packageJson.dependencies[dep]) {
        packageJson.dependencies[dep] = version;
        needsUpdate = true;
      }
    }
    
    // 检查开发依赖
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }
    
    for (const [dep, version] of Object.entries(requiredDevDeps)) {
      if (!packageJson.devDependencies[dep]) {
        packageJson.devDependencies[dep] = version;
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      addFix('package.json 依赖', 'success', '已更新缺失的依赖');
    } else {
      addFix('package.json 依赖', 'success', '所有依赖都已正确配置');
    }
  } catch (error) {
    addFix('package.json 依赖', 'error', error.message);
  }
}

// 2. 检查并修复路由冲突
function checkRouteConflicts() {
  try {
    const brandsPath = path.join(__dirname, 'src/app/[locale]/brands');
    
    // 检查是否存在冲突的动态路由
    const conflictPaths = [
      path.join(brandsPath, '[slug]'),
      path.join(brandsPath, '[brandSlug]/products/[category]')
    ];
    
    let conflictsFound = false;
    
    for (const conflictPath of conflictPaths) {
      if (fs.existsSync(conflictPath)) {
        // 如果存在冲突路由，删除它
        fs.rmSync(conflictPath, { recursive: true, force: true });
        conflictsFound = true;
      }
    }
    
    if (conflictsFound) {
      addFix('路由冲突', 'success', '已删除冲突的动态路由');
    } else {
      addFix('路由冲突', 'success', '未发现路由冲突');
    }
  } catch (error) {
    addFix('路由冲突', 'error', error.message);
  }
}

// 3. 检查并创建缺失的环境配置
function checkEnvConfig() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envExample = `# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=oquvb2bs
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_sanity_token_here

# Site Configuration  
NEXT_PUBLIC_SITE_URL=http://localhost:3001
`;

    if (!fs.existsSync(envPath)) {
      fs.writeFileSync(envPath, envExample);
      addFix('环境配置', 'success', '已创建 .env.local 文件');
    } else {
      addFix('环境配置', 'success', '.env.local 文件已存在');
    }
  } catch (error) {
    addFix('环境配置', 'error', error.message);
  }
}

// 4. 检查并修复 TypeScript 配置
function checkTypescriptConfig() {
  try {
    const tsConfigPath = path.join(__dirname, 'tsconfig.json');
    
    if (fs.existsSync(tsConfigPath)) {
      const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
      
      // 确保包含必要的配置
      if (!tsConfig.compilerOptions.paths) {
        tsConfig.compilerOptions.paths = {
          "@/*": ["./src/*"]
        };
        fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
        addFix('TypeScript 配置', 'success', '已更新路径映射');
      } else {
        addFix('TypeScript 配置', 'success', '配置正确');
      }
    } else {
      addFix('TypeScript 配置', 'warning', 'tsconfig.json 不存在');
    }
  } catch (error) {
    addFix('TypeScript 配置', 'error', error.message);
  }
}

// 5. 检查关键目录结构
function checkDirectoryStructure() {
  try {
    const requiredDirs = [
      'src/app/[locale]/admin',
      'src/components/admin',
      'src/lib',
      'schemas',
      'public/icons',
      'src/hooks'
    ];
    
    let dirsCreated = 0;
    
    for (const dir of requiredDirs) {
      const dirPath = path.join(__dirname, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        dirsCreated++;
      }
    }
    
    if (dirsCreated > 0) {
      addFix('目录结构', 'success', `已创建 ${dirsCreated} 个缺失目录`);
    } else {
      addFix('目录结构', 'success', '目录结构完整');
    }
  } catch (error) {
    addFix('目录结构', 'error', error.message);
  }
}

// 6. 检查 Sanity 配置
function checkSanityConfig() {
  try {
    const sanityConfigPath = path.join(__dirname, 'sanity.config.ts');
    
    if (fs.existsSync(sanityConfigPath)) {
      const configContent = fs.readFileSync(sanityConfigPath, 'utf8');
      
      // 检查是否包含基本配置
      if (configContent.includes('projectId') && configContent.includes('dataset')) {
        addFix('Sanity 配置', 'success', 'sanity.config.ts 配置正确');
      } else {
        addFix('Sanity 配置', 'warning', 'sanity.config.ts 可能缺少配置');
      }
    } else {
      addFix('Sanity 配置', 'warning', 'sanity.config.ts 不存在');
    }
  } catch (error) {
    addFix('Sanity 配置', 'error', error.message);
  }
}

// 7. 生成修复报告
function generateReport() {
  console.log('\n📊 修复报告');
  console.log('==================');
  
  const successCount = fixes.filter(f => f.status === 'success').length;
  const errorCount = fixes.filter(f => f.status === 'error').length;
  const warningCount = fixes.filter(f => f.status === 'warning').length;
  
  console.log(`✅ 成功修复: ${successCount} 项`);
  console.log(`❌ 修复失败: ${errorCount} 项`);
  console.log(`⚠️  需要注意: ${warningCount} 项`);
  
  // 生成 HTML 报告
  const reportHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>自动修复报告 - 立通电子</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .report { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { padding: 20px; border-radius: 8px; text-align: center; }
        .stat-success { background: #d4edda; color: #155724; }
        .stat-error { background: #f8d7da; color: #721c24; }
        .stat-warning { background: #fff3cd; color: #856404; }
        .fix-item { margin: 10px 0; padding: 15px; border-left: 4px solid #ddd; background: #f8f9fa; }
        .fix-success { border-color: #28a745; }
        .fix-error { border-color: #dc3545; }
        .fix-warning { border-color: #ffc107; }
        .timestamp { color: #6c757d; font-size: 12px; }
    </style>
</head>
<body>
    <div class="report">
        <h1>🔧 自动修复报告</h1>
        <p>生成时间: ${new Date().toLocaleString()}</p>
        
        <div class="summary">
            <div class="stat-card stat-success">
                <h3>${successCount}</h3>
                <p>成功修复</p>
            </div>
            <div class="stat-card stat-error">
                <h3>${errorCount}</h3>
                <p>修复失败</p>
            </div>
            <div class="stat-card stat-warning">
                <h3>${warningCount}</h3>
                <p>需要注意</p>
            </div>
        </div>
        
        <h2>详细信息</h2>
        ${fixes.map(fix => `
            <div class="fix-item fix-${fix.status}">
                <h4>${fix.status === 'success' ? '✅' : fix.status === 'error' ? '❌' : '⚠️'} ${fix.name}</h4>
                <p>${fix.details}</p>
                <div class="timestamp">${fix.timestamp}</div>
            </div>
        `).join('')}
        
        <h2>下一步建议</h2>
        <ul>
            <li>运行 <code>npm install</code> 安装更新的依赖</li>
            <li>检查 .env.local 文件并填入正确的 Sanity 配置</li>
            <li>访问 <a href="http://localhost:3001/zh/admin/test">测试页面</a> 验证功能</li>
            <li>如有错误，检查控制台日志获取详细信息</li>
        </ul>
    </div>
</body>
</html>
  `;
  
  fs.writeFileSync(path.join(__dirname, 'fix-report.html'), reportHtml);
  console.log('\n📝 详细报告已生成: fix-report.html');
}

// 执行所有修复
async function runAllFixes() {
  console.log('开始自动检测和修复...\n');
  
  checkPackageJson();
  checkRouteConflicts();
  checkEnvConfig();
  checkTypescriptConfig();
  checkDirectoryStructure();
  checkSanityConfig();
  
  generateReport();
  
  console.log('\n🎉 自动修复完成！');
  console.log('请运行以下命令完成设置：');
  console.log('1. npm install');
  console.log('2. npm run dev');
  console.log('3. 打开 http://localhost:3001/zh/admin/test 进行测试');
}

// 运行修复脚本
runAllFixes().catch(console.error);