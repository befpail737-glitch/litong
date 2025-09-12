#!/usr/bin/env node

/**
 * 测试HTML生成功能
 */

const fs = require('fs');
const path = require('path');

// 生成静态Header HTML
function generateHeaderHTML() {
  return `
    <header class="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
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
              <a class="transition-colors hover:text-blue-600" href="/products">产品列表</a>
              <a class="transition-colors hover:text-blue-600" href="/brands">品牌列表</a>
              <a class="transition-colors hover:text-blue-600" href="/about">关于我们</a>
            </nav>
          </div>
          <div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div class="w-full flex-1 md:w-auto md:flex-none">
              <button class="inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-3 py-1 rounded-md text-sm h-8 w-40 lg:w-64 text-muted-foreground">
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                搜索产品型号...
              </button>
            </div>
            <nav class="flex items-center space-x-2">
              <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2">
                立即询价
              </button>
            </nav>
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
          <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border-transparent mb-4 bg-blue-100 text-blue-800">
            专业B2B电子元器件平台
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            欢迎来到
            <span class="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 ml-0 sm:ml-3">
              力通电子
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            专业的电子元器件供应链服务商，为全球客户提供高品质产品和专业技术支持，
            助力您的项目成功
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-6 py-2">
              立即询价
            </button>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-50 h-10 px-6 py-2">
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
          <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 border-transparent mb-4 bg-green-100 text-green-800">
            核心优势
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            为什么选择力通电子
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            凭借15年的行业经验，我们为客户提供一站式电子元器件采购解决方案
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="border-0 shadow-md hover:shadow-lg transition-all duration-300 group rounded-lg bg-white">
            <div class="p-6 text-center">
              <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
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
          
          <div class="border-0 shadow-md hover:shadow-lg transition-all duration-300 group rounded-lg bg-white">
            <div class="p-6 text-center">
              <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
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
          
          <div class="border-0 shadow-md hover:shadow-lg transition-all duration-300 group rounded-lg bg-white">
            <div class="p-6 text-center">
              <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
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
            <ul class="space-y-2 text-sm">
              <li><a class="text-gray-600 hover:text-blue-600" href="/category/semiconductors">半导体</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="/category/sensors">传感器</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="/category/connectors">连接器</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="/category/passive">被动元件</a></li>
            </ul>
          </div>
          <div class="space-y-3">
            <h4 class="font-semibold">服务支持</h4>
            <ul class="space-y-2 text-sm">
              <li><a class="text-gray-600 hover:text-blue-600" href="/support/technical">技术支持</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="/support/documentation">产品资料</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="/support/samples">样品申请</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="/support/training">培训服务</a></li>
            </ul>
          </div>
          <div class="space-y-3">
            <h4 class="font-semibold">关于力通</h4>
            <ul class="space-y-2 text-sm">
              <li><a class="text-gray-600 hover:text-blue-600" href="/about/company">公司简介</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="/about/team">团队介绍</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="/about/news">新闻动态</a></li>
              <li><a class="text-gray-600 hover:text-blue-600" href="/about/careers">加入我们</a></li>
            </ul>
          </div>
          <div class="space-y-3">
            <h4 class="font-semibold">联系方式</h4>
            <div class="space-y-2 text-sm text-gray-600">
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

// 生成完整HTML
function generateCompleteHTML() {
  const headerHTML = generateHeaderHTML();
  const contentHTML = generateHomePageContent();
  const footerHTML = generateFooterHTML();
  
  return `<!DOCTYPE html>
<html lang="zh-CN" class="font-sans">
<head>
  <meta charset="utf-8">
  <title>力通电子 - 专业电子元器件代理商</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="力通电子是专业的电子元器件代理商，提供高质量的电子元器件产品和技术服务。">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans antialiased bg-white text-gray-900">
  <div id="__next">
    <div class="relative flex min-h-screen flex-col">
      ${headerHTML}
      <main class="flex-1">
        ${contentHTML}
      </main>
      ${footerHTML}
    </div>
  </div>
</body>
</html>`;
}

// 主函数
function main() {
  try {
    // 创建输出目录
    if (!fs.existsSync('out')) {
      fs.mkdirSync('out', { recursive: true });
    }

    // 生成完整HTML
    const htmlContent = generateCompleteHTML();

    // 写入文件
    fs.writeFileSync('out/test-index.html', htmlContent);
    console.log('✅ 测试HTML生成成功: out/test-index.html');
    
  } catch (error) {
    console.error('❌ 测试HTML生成失败:', error);
  }
}

main();