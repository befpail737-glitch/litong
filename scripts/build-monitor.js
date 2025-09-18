const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 构建监控脚本
async function monitorBuild() {
  console.log('🔧 开始监控构建过程...\n');

  const logFile = path.join(__dirname, '..', 'build-log.txt');
  const logStream = fs.createWriteStream(logFile, { flags: 'w' });

  console.log(`📝 构建日志将保存到: ${logFile}`);

  return new Promise((resolve, reject) => {
    // 运行构建命令
    const buildProcess = spawn('npm', ['run', 'build'], {
      cwd: path.join(__dirname, '..'),
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true
    });

    let buildOutput = '';
    let errorOutput = '';

    // 捕获标准输出
    buildProcess.stdout.on('data', (data) => {
      const output = data.toString();
      buildOutput += output;
      logStream.write(`[STDOUT] ${output}`);

      // 实时显示重要信息
      if (output.includes('Generating static pages') ||
          output.includes('BrandProductPage') ||
          output.includes('Static generation') ||
          output.includes('Found combinations')) {
        console.log('📊', output.trim());
      }
    });

    // 捕获错误输出
    buildProcess.stderr.on('data', (data) => {
      const output = data.toString();
      errorOutput += output;
      logStream.write(`[STDERR] ${output}`);

      // 显示警告和错误
      if (output.includes('warning') || output.includes('error')) {
        console.log('⚠️', output.trim());
      }
    });

    // 构建完成
    buildProcess.on('close', (code) => {
      logStream.end();

      console.log(`\n🎯 构建完成，退出代码: ${code}`);

      if (code === 0) {
        console.log('✅ 构建成功！');
        checkStaticFiles();
        resolve({ success: true, output: buildOutput, error: errorOutput });
      } else {
        console.log('❌ 构建失败！');
        console.log('错误输出:', errorOutput);
        reject(new Error(`Build failed with code ${code}`));
      }
    });

    buildProcess.on('error', (error) => {
      logStream.end();
      console.error('💥 构建进程错误:', error);
      reject(error);
    });
  });
}

// 检查静态文件生成情况
function checkStaticFiles() {
  console.log('\n🔍 检查静态文件生成情况...');

  const outDir = path.join(__dirname, '..', 'out');

  if (!fs.existsSync(outDir)) {
    console.log('❌ out目录不存在');
    return;
  }

  // 检查产品页面
  const productPaths = [
    'zh-CN/brands/cree/products/55555',
    'zh-CN/brands/cree/products/11111',
    'zh-CN/brands/cree/products/sic mosfet',
    'en/brands/cree/products/55555'
  ];

  console.log('检查产品页面生成情况:');
  productPaths.forEach(productPath => {
    const fullPath = path.join(outDir, productPath);
    const htmlPath = path.join(fullPath, 'index.html');

    if (fs.existsSync(htmlPath)) {
      console.log(`✅ ${productPath}/index.html 已生成`);

      // 检查文件内容
      const content = fs.readFileSync(htmlPath, 'utf8');
      if (content.includes('页面未找到') || content.includes('Page Not Found')) {
        console.log(`⚠️  ${productPath} 生成了404页面`);
      } else if (content.includes('产品详情')) {
        console.log(`🎉 ${productPath} 包含产品内容`);
      }
    } else {
      console.log(`❌ ${productPath}/index.html 未生成`);
    }
  });

  // 列出实际生成的目录结构
  console.log('\n📂 实际生成的目录结构:');
  try {
    listDirectory(outDir, '', 3); // 最多3层深度
  } catch (error) {
    console.log('无法读取目录结构:', error.message);
  }
}

function listDirectory(dir, indent, maxDepth) {
  if (maxDepth <= 0) return;

  try {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        console.log(`${indent}📁 ${item}/`);
        if (maxDepth > 1) {
          listDirectory(itemPath, indent + '  ', maxDepth - 1);
        }
      } else {
        console.log(`${indent}📄 ${item}`);
      }
    });
  } catch (error) {
    console.log(`${indent}❌ 无法读取目录: ${error.message}`);
  }
}

// 运行监控
if (require.main === module) {
  monitorBuild()
    .then(result => {
      console.log('\n🎉 构建监控完成!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 构建监控失败:', error);
      process.exit(1);
    });
}

module.exports = { monitorBuild };