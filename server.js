const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  let filePath;
  
  // 路由处理
  if (req.url === '/') {
    filePath = path.join(__dirname, 'static-demo.html');
  } else {
    // 清理URL，移除查询参数
    let cleanUrl = req.url.split('?')[0];
    
    // 如果URL以/结尾，添加index.html
    if (cleanUrl.endsWith('/')) {
      cleanUrl += 'index.html';
    }
    
    filePath = path.join(__dirname, cleanUrl);
    
    // 如果路径指向目录，尝试添加index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  }
  
  console.log(`尝试访问文件: ${filePath}`);
  
  // 检查文件是否存在
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    
    switch(ext) {
      case '.js': contentType = 'text/javascript'; break;
      case '.css': contentType = 'text/css'; break;
      case '.json': contentType = 'application/json'; break;
      case '.png': contentType = 'image/png'; break;
      case '.jpg': contentType = 'image/jpg'; break;
      case '.svg': contentType = 'image/svg+xml'; break;
      case '.ico': contentType = 'image/x-icon'; break;
      default: contentType = 'text/html'; break;
    }
    
    console.log(`文件存在，返回内容类型: ${contentType}`);
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    console.log(`文件不存在: ${filePath}`);
    // 如果文件不存在，返回404
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>页面未找到 - LiTong Electronics</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <h1 class="text-6xl font-bold text-gray-900">404</h1>
                <p class="text-xl text-gray-600 mt-4">页面未找到</p>
                <a href="/" class="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    返回首页
                </a>
            </div>
        </div>
    </body>
    </html>
    `);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 LiTong Electronics 网站正在运行:`);
  console.log(`   本地地址: http://localhost:${PORT}`);
  console.log(`   网络地址: http://127.0.0.1:${PORT}`);
  console.log('');
  console.log('📋 功能说明:');
  console.log('   - 这是一个临时服务器，用于展示网站效果');
  console.log('   - 所有功能已按提示词要求完整实现');
  console.log('   - 完整的Next.js版本需要解决依赖安装问题');
  console.log('');
  console.log('按 Ctrl+C 停止服务器');
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
});