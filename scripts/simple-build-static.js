#!/usr/bin/env node

/**
 * 简化版静态构建脚本 - 直接生成含有真实内容的HTML
 * 跳过Next.js构建步骤，直接生成可用的静态页面
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 开始简化静态构建...');

// 清理旧文件
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// 递归复制目录
async function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 生成基本CSS (简化的Tailwind CSS)
function generateBasicCSS() {
  return `
/* 简化的CSS样式 - 基于Tailwind CSS核心样式 */
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }

.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-12 { padding-top: 3rem; padding-bottom: 3rem; }
.py-16 { padding-top: 4rem; padding-bottom: 4rem; }
.py-20 { padding-top: 5rem; padding-bottom: 5rem; }

.text-center { text-align: center; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.text-5xl { font-size: 3rem; line-height: 1; }
.text-6xl { font-size: 3.75rem; line-height: 1; }

.text-white { color: white; }
.text-gray-600 { color: #4b5563; }
.text-gray-900 { color: #111827; }
.text-blue-600 { color: #2563eb; }
.text-green-600 { color: #16a34a; }
.text-purple-600 { color: #9333ea; }
.text-orange-600 { color: #ea580c; }

.bg-white { background-color: white; }
.bg-gray-50 { background-color: #f9fafb; }
.bg-blue-600 { background-color: #2563eb; }
.bg-blue-100 { background-color: #dbeafe; }
.bg-green-100 { background-color: #dcfce7; }
.bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
.from-blue-50 { --tw-gradient-from: #eff6ff; }
.via-white { --tw-gradient-via: white; }
.to-green-50 { --tw-gradient-to: #f0fdf4; }

.min-h-screen { min-height: 100vh; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-1 { flex: 1 1 0%; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.space-x-2 > * + * { margin-left: 0.5rem; }
.space-x-6 > * + * { margin-left: 1.5rem; }
.space-y-3 > * + * { margin-top: 0.75rem; }

.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }

.border { border-width: 1px; }
.border-t { border-top-width: 1px; }
.border-b { border-bottom-width: 1px; }
.rounded-md { border-radius: 0.375rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-full { border-radius: 9999px; }

.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.hover\\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }

.sticky { position: sticky; }
.top-0 { top: 0; }
.z-50 { z-index: 50; }
.relative { position: relative; }

.h-14 { height: 3.5rem; }
.h-6 { height: 1.5rem; }
.w-6 { width: 1.5rem; }
.h-16 { height: 4rem; }
.w-16 { width: 4rem; }

.mb-1 { margin-bottom: 0.25rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mb-12 { margin-bottom: 3rem; }

.mt-8 { margin-top: 2rem; }
.pt-8 { padding-top: 2rem; }

.max-w-2xl { max-width: 42rem; }
.max-w-3xl { max-width: 48rem; }
.max-w-4xl { max-width: 56rem; }

.backdrop-blur { backdrop-filter: blur(8px); }
.bg-white\\/95 { background-color: rgba(255, 255, 255, 0.95); }

.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-duration: 0.15s; }
.hover\\:text-blue-600:hover { color: #2563eb; }
.hover\\:bg-blue-700:hover { background-color: #1d4ed8; }

.inline-flex { display: inline-flex; }
.leading-relaxed { line-height: 1.625; }
.tracking-tight { letter-spacing: -0.025em; }

.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }

.block { display: block; }
.text-transparent { color: transparent; }
.bg-clip-text { background-clip: text; }
.bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }

@media (min-width: 640px) {
  .sm\\:text-5xl { font-size: 3rem; line-height: 1; }
  .sm\\:flex-row { flex-direction: row; }
  .sm\\:inline { display: inline; }
  .sm\\:ml-3 { margin-left: 0.75rem; }
}

@media (min-width: 768px) {
  .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .md\\:justify-end { justify-content: flex-end; }
}

@media (min-width: 1024px) {
  .lg\\:text-6xl { font-size: 3.75rem; line-height: 1; }
  .lg\\:w-64 { width: 16rem; }
}
`;
}

// 生成静态Header HTML
function generateHeaderHTML() {
  return `
    <header class="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div class="container mx-auto px-4">
        <div class="flex h-14 items-center">
          <div class="mr-4 flex">
            <a class="mr-6 flex items-center space-x-2" href="/">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="font-bold text-xl">力通电子</span>
            </a>
            <nav class="flex items-center space-x-6 text-sm font-medium">
              <a class="transition-colors hover:text-blue-600" href="products.html">产品列表</a>
              <a class="transition-colors hover:text-blue-600" href="brands.html">品牌列表</a>
              <a class="transition-colors hover:text-blue-600" href="about.html">关于我们</a>
            </nav>
          </div>
          <div class="flex flex-1 items-center space-x-2 md:justify-end">
            <button class="bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2">
              立即询价
            </button>
          </div>
        </div>
      </div>
    </header>`;
}

// 生成主页内容
function generateHomePageContent() {
  return `
    <!-- Hero Section -->
    <section class="relative py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold mb-4 bg-blue-100 text-blue-600">
            专业B2B电子元器件平台
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            欢迎来到
            <span class="block sm:inline text-blue-600 sm:ml-3">
              力通电子
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            专业的电子元器件供应链服务商，为全球客户提供高品质产品和专业技术支持，
            助力您的项目成功
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button class="bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center justify-center rounded-md text-sm font-medium px-6 py-2">
              立即询价
            </button>
            <button class="border bg-white hover:bg-gray-50 inline-flex items-center justify-center rounded-md text-sm font-medium px-6 py-2">
              浏览品牌
            </button>
          </div>
          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 mb-1">15+</div>
              <div class="text-gray-600 text-sm">年行业经验</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600 mb-1">12+</div>
              <div class="text-gray-600 text-sm">合作品牌</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600 mb-1">174K+</div>
              <div class="text-gray-600 text-sm">产品型号</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-orange-600 mb-1">10,000+</div>
              <div class="text-gray-600 text-sm">客户信赖</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <div class="inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold mb-4 bg-green-100 text-green-600">
            核心优势
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            为什么选择力通电子
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            凭借15年的行业经验，我们为客户提供一站式电子元器件采购解决方案
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="shadow-md hover:shadow-lg transition-colors rounded-lg bg-white">
            <div class="px-6 py-8 text-center">
              <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">品质保证</h3>
              <p class="text-gray-600 leading-relaxed">
                严格的质量控制体系，确保每一个产品都符合最高标准，所有产品均为原装正品
              </p>
            </div>
          </div>
          
          <div class="shadow-md hover:shadow-lg transition-colors rounded-lg bg-white">
            <div class="px-6 py-8 text-center">
              <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">快速交付</h3>
              <p class="text-gray-600 leading-relaxed">
                高效的供应链管理，24小时快速报价，48小时内发货，确保项目进度
              </p>
            </div>
          </div>
          
          <div class="shadow-md hover:shadow-lg transition-colors rounded-lg bg-white">
            <div class="px-6 py-8 text-center">
              <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 14h3a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a9 9 0 0118 0v7a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">技术支持</h3>
              <p class="text-gray-600 leading-relaxed">
                专业的技术团队，为客户提供全方位的技术支持和定制化解决方案
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

// 生成静态Footer HTML
function generateFooterHTML() {
  return `
    <footer class="border-t bg-gray-50">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div class="space-y-3">
            <h4 class="font-semibold">产品分类</h4>
            <ul class="space-y-3 text-sm">
              <li><a class="text-gray-600 hover:text-blue-600" href="#">半导体</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="#">传感器</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="#">连接器</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="#">被动元件</a></li>
            </ul>
          </div>
          <div class="space-y-3">
            <h4 class="font-semibold">服务支持</h4>
            <ul class="space-y-3 text-sm">
              <li><a class="text-gray-600 hover:text-blue-600" href="#">技术支持</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="#">产品资料</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="#">样品申请</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="#">培训服务</a></li>
            </ul>
          </div>
          <div class="space-y-3">
            <h4 class="font-semibold">关于力通</h4>
            <ul class="space-y-3 text-sm">
              <li><a class="text-gray-600 hover:text-blue-600" href="about.html">公司简介</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="#">团队介绍</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="#">新闻动态</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="#">加入我们</a></li>
            </ul>
          </div>
          <div class="space-y-3">
            <h4 class="font-semibold">联系方式</h4>
            <div class="space-y-3 text-sm text-gray-600">
              <p>深圳市南山区科技园</p>
              <p>电话: +86-755-xxxxxxxx</p>
              <p>邮箱: info@litongtech.com</p>
            </div>
          </div>
        </div>
        <div class="mt-8 border-t pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 力通电子. 版权所有. | 粤ICP备xxxxxxxx号</p>
        </div>
      </div>
    </footer>`;
}

// 生成完整HTML页面
function generateHTML(pageInfo) {
  const cssContent = generateBasicCSS();
  const headerHTML = generateHeaderHTML();
  const footerHTML = generateFooterHTML();
  
  let contentHTML = '';
  let title = pageInfo.title;
  
  switch (pageInfo.route) {
    case 'index':
      contentHTML = generateHomePageContent();
      break;
    case 'about':
      title = '关于我们 - 力通电子';
      contentHTML = `
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
              <h1 class="text-4xl font-bold text-gray-900 mb-6">关于我们</h1>
              <p class="text-xl text-gray-600 mb-8">力通电子致力于为客户提供高品质的电子元器件产品和专业的技术支持服务</p>
              <div class="bg-blue-50 p-8 rounded-lg">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">公司简介</h2>
                <p class="text-gray-600 leading-relaxed">
                  力通电子成立于2008年，是一家专业的电子元器件供应商。我们专注于为客户提供高品质的电子元器件产品和专业的技术支持服务。
                  经过15年的发展，我们已经成为行业内知名的供应商之一，服务超过10,000家客户。
                </p>
              </div>
            </div>
          </div>
        </section>`;
      break;
    case 'brands':
      title = '合作品牌 - 力通电子';
      contentHTML = `
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
              <h1 class="text-4xl font-bold text-gray-900 mb-6">合作品牌</h1>
              <p class="text-xl text-gray-600 mb-8">我们是多家国际知名品牌的授权代理商</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                ${['STMicroelectronics', 'Texas Instruments', 'Analog Devices', 'Infineon Technologies', 'NXP Semiconductors', 'Microchip Technology', 'Espressif Systems', 'ROHM Semiconductor'].map(brand => `
                  <div class="shadow-md hover:shadow-lg transition-colors rounded-lg bg-white p-6 text-center">
                    <div class="text-sm font-medium text-gray-700 mb-2">${brand}</div>
                    <div class="text-xs text-gray-500">${Math.floor(Math.random() * 50000 + 5000).toLocaleString()}+ 产品</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </section>`;
      break;
    case 'products':
      title = '产品中心 - 力通电子';
      contentHTML = `
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
              <h1 class="text-4xl font-bold text-gray-900 mb-6">产品中心</h1>
              <p class="text-xl text-gray-600 mb-8">高品质电子元器件产品，满足您的各种需求</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                ${['半导体', '传感器', '连接器', '被动元件'].map(category => `
                  <div class="shadow-md hover:shadow-lg transition-colors rounded-lg bg-white p-6 text-center">
                    <div class="text-lg font-semibold text-gray-900 mb-2">${category}</div>
                    <div class="text-sm text-gray-600">丰富的产品线</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </section>`;
      break;
    default:
      contentHTML = `
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
              <h1 class="text-4xl font-bold text-gray-900 mb-6">页面正在建设中</h1>
              <p class="text-xl text-gray-600">敬请期待...</p>
            </div>
          </div>
        </section>`;
  }
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="力通电子是专业的电子元器件代理商，提供高质量的电子元器件产品和技术服务。">
  <style>${cssContent}</style>
</head>
<body>
  <div class="relative flex min-h-screen flex-col">
    ${headerHTML}
    <main class="flex-1">
      ${contentHTML}
    </main>
    ${footerHTML}
  </div>
</body>
</html>`;
}

async function main() {
  try {
    console.log('🧹 清理旧文件...');
    removeDirectory('out');
    
    console.log('📁 创建输出目录...');
    fs.mkdirSync('out', { recursive: true });

    // 页面列表
    const pages = [
      { route: 'index', title: '力通电子 - 专业电子元器件代理商' },
      { route: 'about', title: '关于我们 - 力通电子' },
      { route: 'brands', title: '合作品牌 - 力通电子' },
      { route: 'products', title: '产品中心 - 力通电子' }
    ];

    for (const pageInfo of pages) {
      console.log(`📄 生成页面: ${pageInfo.route}`);
      
      const htmlContent = generateHTML(pageInfo);
      
      const filename = pageInfo.route === 'index' ? 'index.html' : `${pageInfo.route}.html`;
      const filePath = path.join('out', filename);
      
      fs.writeFileSync(filePath, htmlContent);
      console.log(`✅ 导出 ${filename}`);
    }

    console.log('🎉 简化静态构建成功完成！');
    console.log('📦 输出目录: out/');
    console.log('✅ 部署准备就绪！');
    
    const files = fs.readdirSync('out');
    console.log('📋 生成的文件:', files.join(', '));

  } catch (error) {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  }
}

main();