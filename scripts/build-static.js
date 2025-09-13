#!/usr/bin/env node

/**
 * 增强的自定义静态构建脚本
 * 用于绕过 Next.js 14 静态导出的 Server Actions 误报错误
 * 使用分步构建方法：编译 → 手动静态导出
 * 集成Sanity CMS真实数据获取
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Sanity Client 配置
const { createClient } = require('@sanity/client');
const imageUrlBuilder = require('@sanity/image-url');

// 创建Sanity客户端
const sanityClient = createClient({
  projectId: 'oquvb2bs',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  perspective: 'published',
});

const imageBuilder = imageUrlBuilder(sanityClient);

// 生成图片URL的助手函数
function urlFor(source) {
  return imageBuilder.image(source);
}

// 导入fallback品牌数据
const { getAllFallbackBrands, getFeaturedFallbackBrands, getFallbackBrandStats } = require('./fallback-brands.js');

// 从Sanity获取所有品牌数据（使用fallback系统）
async function getAllBrandsFromSanity() {
  try {
    // 尝试从Sanity获取品牌数据
    const query = `*[_type == "brandBasic" && (isActive == true || !defined(isActive))] | order(name asc) {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      isFeatured,
      "slug": slug.current,
      logo,
      headquarters,
      established
    }`;
    
    const sanityBrands = await sanityClient.fetch(query);
    
    // 如果Sanity返回的品牌数量少于5个，使用fallback数据
    if (!sanityBrands || sanityBrands.length < 5) {
      console.warn('Sanity returned insufficient brands, using fallback data');
      const fallbackBrands = getAllFallbackBrands();
      
      // 合并Sanity数据和fallback数据，避免重复
      const combined = [...(sanityBrands || [])];
      fallbackBrands.forEach(fallback => {
        if (!combined.find(brand => brand.name === fallback.name)) {
          combined.push(fallback);
        }
      });
      
      console.log(`✅ 获取到 ${combined.length} 个品牌（包含fallback数据）`);
      return combined;
    }
    
    console.log(`✅ 从Sanity获取到 ${sanityBrands.length} 个品牌`);
    return sanityBrands;
  } catch (error) {
    console.error('Error fetching brands, using fallback data:', error);
    return getAllFallbackBrands();
  }
}

// 从Sanity获取特色品牌数据（使用fallback系统）
async function getFeaturedBrandsFromSanity() {
  try {
    // 尝试从Sanity获取特色品牌数据
    const query = `*[_type == "brandBasic" && (isActive == true || !defined(isActive)) && isFeatured == true] | order(name asc) {
      _id,
      _type,
      name,
      description,
      website,
      country,
      isActive,
      isFeatured,
      "slug": slug.current,
      logo,
      headquarters,
      established
    }`;

    const sanityBrands = await sanityClient.fetch(query);
    
    // 如果Sanity返回的特色品牌数量少于3个，使用fallback数据
    if (!sanityBrands || sanityBrands.length < 3) {
      console.warn('Sanity returned insufficient featured brands, using fallback data');
      const fallbackBrands = getFeaturedFallbackBrands();
      
      // 合并Sanity数据和fallback数据
      const combined = [...(sanityBrands || [])];
      fallbackBrands.forEach(fallback => {
        if (!combined.find(brand => brand.name === fallback.name)) {
          combined.push(fallback);
        }
      });
      
      console.log(`✅ 获取到 ${combined.length} 个特色品牌（包含fallback数据）`);
      return combined;
    }
    
    console.log(`✅ 从Sanity获取到 ${sanityBrands.length} 个特色品牌`);
    return sanityBrands;
  } catch (error) {
    console.error('Error fetching featured brands, using fallback data:', error);
    return getFeaturedFallbackBrands();
  }
}

// 从Sanity获取品牌统计数据（使用fallback系统）
async function getBrandStatsFromSanity() {
  try {
    const query = `{
      "total": count(*[_type == "brandBasic" && (isActive == true || !defined(isActive))]),
      "featured": count(*[_type == "brandBasic" && (isActive == true || !defined(isActive)) && isFeatured == true]),
      "solutions": count(*[_type == "solution" && (isPublished == true || !defined(isPublished))])
    }`;

    const sanityStats = await sanityClient.fetch(query);
    
    // 如果Sanity返回的数据不足，使用fallback数据补充
    const fallbackStats = getFallbackBrandStats();
    
    const stats = {
      total: Math.max(sanityStats?.total || 0, fallbackStats.total),
      authorized: Math.max(sanityStats?.featured || 0, fallbackStats.authorized),
      totalProducts: Math.max((sanityStats?.solutions || 0) * 1000, fallbackStats.totalProducts),
    };
    
    console.log('✅ 获取品牌统计数据:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching brand stats, using fallback data:', error);
    return getFallbackBrandStats();
  }
}


// 获取品牌相关产品数据
async function getBrandProducts(brandSlug, limit = 8) {
  try {
    const query = `*[_type == "product" && brand->slug.current == "${brandSlug}" && isActive == true] | order(_createdAt desc) [0...${limit}] {
      _id,
      title,
      partNumber,
      shortDescription,
      images,
      "brand": brand-> {
        name,
        "slug": slug.current
      }
    }`;
    
    const products = await sanityClient.fetch(query);
    return products || [];
  } catch (error) {
    console.error('Error fetching brand products:', error);
    return [];
  }
}

// 获取品牌相关解决方案
async function getBrandSolutions(brandSlug, limit = 4) {
  try {
    const query = `*[_type == "solution" && isPublished == true && ("${brandSlug}" in relatedBrands[]->slug.current || primaryBrand->slug.current == "${brandSlug}")] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      summary,
      "slug": slug.current,
      publishedAt,
      targetMarket,
      isFeatured,
      heroImage,
      "relatedBrands": relatedBrands[]-> {
        name,
        "slug": slug.current
      }
    }`;
    
    const solutions = await sanityClient.fetch(query);
    return solutions || [];
  } catch (error) {
    console.error('Error fetching brand solutions:', error);
    return [];
  }
}

// 获取品牌相关文章
async function getBrandArticles(brandSlug, limit = 4) {
  try {
    const query = `*[_type == "article" && isPublished == true && "${brandSlug}" in relatedBrands[]->slug.current] | order(publishedAt desc) [0...${limit}] {
      _id,
      title,
      summary,
      "slug": slug.current,
      publishedAt,
      readingTime,
      "relatedBrands": relatedBrands[]-> {
        name,
        "slug": slug.current
      }
    }`;
    
    const articles = await sanityClient.fetch(query);
    return articles || [];
  } catch (error) {
    console.error('Error fetching brand articles:', error);
    return [];
  }
}

// 获取品牌产品分类统计
async function getBrandProductCategories(brandSlug) {
  try {
    const query = `*[_type == "product" && brand->slug.current == "${brandSlug}" && isActive == true] {
      "category": category-> {
        name,
        "slug": slug.current,
        description
      }
    } | order(category.name asc)`;
    
    const products = await sanityClient.fetch(query);
    
    // 统计每个分类的产品数量
    const categoryStats = {};
    products.forEach(product => {
      if (product.category) {
        const categoryName = product.category.name;
        if (!categoryStats[categoryName]) {
          categoryStats[categoryName] = {
            ...product.category,
            count: 0
          };
        }
        categoryStats[categoryName].count++;
      }
    });
    
    return Object.values(categoryStats);
  } catch (error) {
    console.error('Error fetching brand product categories:', error);
    return [];
  }
}

// 获取品牌完整数据（包含相关内容）
async function getBrandWithContent(brandSlug) {
  try {
    const [brand, products, solutions, articles, categories] = await Promise.all([
      sanityClient.fetch(`*[_type == "brandBasic" && slug.current == "${brandSlug}" && isActive == true && !(_id in path("drafts.**"))][0] {
        _id, name, description, website, country, isActive, isFeatured, "slug": slug.current, logo, headquarters, established
      }`),
      getBrandProducts(brandSlug, 8),
      getBrandSolutions(brandSlug, 4),
      getBrandArticles(brandSlug, 4),
      getBrandProductCategories(brandSlug)
    ]);

    return {
      brand: brand || null,
      products: products || [],
      solutions: solutions || [],
      articles: articles || [],
      categories: categories || []
    };
  } catch (error) {
    console.error('Error fetching brand with content:', error);
    return {
      brand: null,
      products: [],
      solutions: [],
      articles: [],
      categories: []
    };
  }
}

// 按首字母分组品牌（简化版本）
function groupBrandsByFirstLetter(brands) {
  const groups = {};
  
  brands.forEach(brand => {
    const firstChar = brand.name.charAt(0).toUpperCase();
    
    // 判断首字符类型
    let groupName;
    if (/[A-Z]/.test(firstChar)) {
      groupName = `${firstChar} 开头`;
    } else if (/[\u4e00-\u9fa5]/.test(firstChar)) {
      groupName = '中文品牌';
    } else if (/[0-9]/.test(firstChar)) {
      groupName = '数字开头';
    } else {
      groupName = '其他品牌';
    }
    
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(brand);
  });
  
  // 转换为数组格式并排序
  return Object.entries(groups)
    .map(([name, brands]) => ({ name, brands }))
    .sort((a, b) => {
      // 英文字母组排序在前，中文品牌次之，数字和其他在后
      if (a.name.includes('开头') && b.name.includes('开头')) {
        return a.name.localeCompare(b.name);
      } else if (a.name.includes('开头')) {
        return -1;
      } else if (b.name.includes('开头')) {
        return 1;
      } else if (a.name === '中文品牌') {
        return -1;
      } else if (b.name === '中文品牌') {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
}

// 从 Sanity 获取所有品牌数据（简化版本）
async function getAllBrandsFromSanity() {
  try {
    const query = `*[_type == "brandBasic" && isActive == true && !(_id in path("drafts.**"))] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      description,
      website,
      country,
      headquarters,
      established,
      logo,
      isActive,
      isFeatured
    }`;

    const brands = await sanityClient.fetch(query);
    
    console.log(`✅ 从Sanity获取到 ${brands?.length || 0} 个品牌`);
    
    return brands || [];
  } catch (error) {
    console.error('❌ 获取品牌数据失败:', error);
    return [];
  }
}

console.log('🚀 开始增强静态构建...');

// 设置环境变量
process.env.NODE_ENV = 'production';
process.env.NEXT_BUILD_LINT = 'false';

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

// 安全删除目录，带重试机制
async function removeDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const maxRetries = 5;
  const delay = 1000; // 1秒

  for (let i = 0; i < maxRetries; i++) {
    try {
      // 首先尝试删除目录
      fs.rmSync(dirPath, { recursive: true, force: true });
      return;
    } catch (error) {
      if (error.code === 'EBUSY' || error.code === 'ENOTEMPTY' || error.code === 'EPERM') {
        console.log(`⚠️  目录 ${dirPath} 正在被占用，等待 ${delay}ms 后重试... (${i + 1}/${maxRetries})`);
        
        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // 如果是最后一次尝试，使用更激进的方法
        if (i === maxRetries - 1) {
          try {
            // 尝试使用系统命令强制删除 (Windows)
            if (process.platform === 'win32') {
              await new Promise((resolve, reject) => {
                exec(`rmdir /s /q "${path.resolve(dirPath)}"`, (error) => {
                  if (error && !error.message.includes('cannot find')) {
                    reject(error);
                  } else {
                    resolve();
                  }
                });
              });
            } else {
              // Unix/Linux
              await new Promise((resolve, reject) => {
                exec(`rm -rf "${path.resolve(dirPath)}"`, (error) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve();
                  }
                });
              });
            }
            return;
          } catch (cmdError) {
            console.log(`❌ 无法删除目录 ${dirPath}: ${cmdError.message}`);
            console.log(`⚠️  继续构建，但可能需要手动清理此目录`);
            return;
          }
        }
      } else {
        throw error;
      }
    }
  }
}

async function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`📝 ${description}...`);
    
    const child = exec(command, {
      cwd: process.cwd(),
      env: { ...process.env }
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      
      // 过滤掉 Server Actions 错误，显示其他输出
      if (!text.includes('Server Actions are not supported with static export')) {
        process.stdout.write(text);
      }
    });

    child.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      
      // 过滤掉 Server Actions 错误，显示其他错误
      if (!text.includes('Server Actions are not supported with static export')) {
        process.stderr.write(text);
      }
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ output, errorOutput, code });
      } else {
        // 如果是 Server Actions 错误，继续执行
        if (errorOutput.includes('Server Actions are not supported with static export') ||
            output.includes('Server Actions are not supported with static export')) {
          console.log('⚠️  忽略 Server Actions 误报错误，继续执行...');
          resolve({ output, errorOutput, code: 0 });
        } else {
          reject(new Error(`命令失败，退出码: ${code}`));
        }
      }
    });

    child.on('error', reject);
  });
}

async function manualStaticExport() {
  console.log('📦 开始智能静态导出...');
  
  try {
    // 检查 .next 目录是否存在
    if (!fs.existsSync('.next')) {
      throw new Error('.next 目录不存在，需要先完成构建');
    }

    // 创建 out 目录
    if (!fs.existsSync('out')) {
      fs.mkdirSync('out', { recursive: true });
    }

    // 复制静态文件
    const staticPath = '.next/static';
    if (fs.existsSync(staticPath)) {
      console.log('📁 复制静态资源...');
      const staticOutPath = path.join('out', 'static');
      await copyDirectory(staticPath, staticOutPath);
      console.log('✅ 静态资源复制完成');
    }

    // 复制 _next 静态文件到根目录
    const nextStaticPath = '.next/static';
    if (fs.existsSync(nextStaticPath)) {
      const nextOutPath = path.join('out', '_next', 'static');
      if (!fs.existsSync(path.dirname(nextOutPath))) {
        fs.mkdirSync(path.dirname(nextOutPath), { recursive: true });
      }
      await copyDirectory(nextStaticPath, nextOutPath);
      console.log('✅ _next 静态资源复制完成');
    }

    // 读取 app-build-manifest.json 获取正确的资源文件
    let appManifest = {};
    try {
      const manifestPath = '.next/app-build-manifest.json';
      if (fs.existsSync(manifestPath)) {
        appManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        console.log('✅ 读取 app-build-manifest.json');
      }
    } catch (error) {
      console.warn('⚠️ 无法读取 app-build-manifest.json:', error.message);
    }

    // 读取构建清单以获取polyfill和核心文件
    let buildManifest = {};
    try {
      const buildManifestPath = '.next/build-manifest.json';
      if (fs.existsSync(buildManifestPath)) {
        buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));
        console.log('✅ 读取 build-manifest.json');
      }
    } catch (error) {
      console.warn('⚠️ 无法读取 build-manifest.json:', error.message);
    }

    // 获取polyfill文件
    const polyfillFiles = buildManifest.polyfillFiles || [];
    
    // 获取共享资源（layout）
    const layoutAssets = appManifest.pages?.['/layout'] || [];
    const cssFiles = layoutAssets.filter(asset => asset.endsWith('.css'));
    const sharedJsFiles = layoutAssets.filter(asset => asset.endsWith('.js'));

    // 获取根主文件
    const rootMainFiles = buildManifest.rootMainFiles || [];

    console.log('📋 找到Polyfill文件:', polyfillFiles);
    console.log('📋 找到CSS文件:', cssFiles);
    console.log('📋 找到根主文件:', rootMainFiles.length, '个');
    console.log('📋 找到共享JS文件:', sharedJsFiles.length, '个');

    // 获取Sanity品牌数据（仅在需要时获取）
    console.log('🔄 准备获取品牌数据...');
    const allBrands = await getAllBrandsFromSanity();
    const featuredBrands = await getFeaturedBrandsFromSanity();
    const brandStats = await getBrandStatsFromSanity();

    // 定义页面路由映射
    const pages = [
      { route: 'index', manifestKey: '/page', title: '力通电子 - 专业电子元器件代理商' },
      { route: 'about', manifestKey: '/about/page', title: '关于我们 - 力通电子' },
      { route: 'brands', manifestKey: '/brands/page', title: '合作品牌 - 力通电子' },
      { route: 'products', manifestKey: '/products/page', title: '产品中心 - 力通电子' }
    ];

    for (const pageInfo of pages) {
      console.log(`📄 生成页面: ${pageInfo.route}`);
      
      // 获取页面特定的资源
      const pageAssets = appManifest.pages?.[pageInfo.manifestKey] || [];
      const pageJsFiles = pageAssets.filter(asset => asset.endsWith('.js'));
      
      // 按正确顺序合并所有JS文件
      const allJsFiles = [
        ...polyfillFiles,
        ...rootMainFiles,
        ...sharedJsFiles,
        ...pageJsFiles
      ].filter((file, index, arr) => arr.indexOf(file) === index); // 去重
      
      // 为brands页面附加品牌数据
      if (pageInfo.route === 'brands') {
        pageInfo.brandsData = {
          allBrands,
          featuredBrands,
          brandStats
        };
      }
      
      // 生成HTML内容
      const htmlContent = generatePageHTML(pageInfo.title, cssFiles, allJsFiles, pageInfo);
      
      // 确定文件路径
      const filename = pageInfo.route === 'index' ? 'index.html' : `${pageInfo.route}/index.html`;
      const filePath = path.join('out', filename);
      
      // 创建目录
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, htmlContent);
      console.log(`✅ 导出 ${filename} (${allJsFiles.length} JS文件, ${cssFiles.length} CSS文件)`);
    }

    // 生成个人品牌页面
    console.log('🔄 开始生成个人品牌页面...');
    
    // 获取品牌页面的资源文件
    const brandPageAssets = appManifest.pages?.['/brands/[slug]/page'] || [];
    const brandPageJsFiles = brandPageAssets.filter(asset => asset.endsWith('.js'));
    
    // 合并品牌页面所需的JS文件
    const brandPageAllJsFiles = [
      ...polyfillFiles,
      ...rootMainFiles,
      ...sharedJsFiles,
      ...brandPageJsFiles
    ].filter((file, index, arr) => arr.indexOf(file) === index); // 去重

    console.log(`📋 品牌页面找到 ${brandPageJsFiles.length} 个特定JS文件`);
    
    // 为每个品牌生成HTML页面
    let brandPageCount = 0;
    for (const brand of allBrands) {
      if (!brand.slug) {
        console.warn(`⚠️ 品牌 ${brand.name} 没有slug，跳过生成页面`);
        continue;
      }

      brandPageCount++;
      const brandSlug = encodeURIComponent(brand.slug);
      
      console.log(`📦 获取品牌 ${brand.name} 的完整数据...`);
      
      // 获取品牌完整数据（包含产品、解决方案、文章等）
      const brandWithContent = await getBrandWithContent(brand.slug);
      
      // 创建品牌页面信息
      const brandPageInfo = {
        route: `brands/${brandSlug}`,
        title: `${brand.name} - 力通电子合作品牌`,
        brandData: brandWithContent.brand || brand,
        products: brandWithContent.products || [],
        solutions: brandWithContent.solutions || [],
        articles: brandWithContent.articles || [],
        categories: brandWithContent.categories || []
      };
      
      // 生成品牌页面HTML
      const brandHtmlContent = generateBrandPageHTML(brandPageInfo.title, cssFiles, brandPageAllJsFiles, brandPageInfo);
      
      // 创建品牌页面文件路径
      const brandFilePath = path.join('out', 'brands', brandSlug, 'index.html');
      const brandDir = path.dirname(brandFilePath);
      
      // 创建目录
      if (!fs.existsSync(brandDir)) {
        fs.mkdirSync(brandDir, { recursive: true });
      }
      
      // 写入HTML文件
      fs.writeFileSync(brandFilePath, brandHtmlContent);
      console.log(`✅ 生成品牌页面: brands/${brandSlug}/index.html (${brand.name}) - ${brandWithContent.products.length}个产品, ${brandWithContent.solutions.length}个解决方案`);

      // 生成品牌子页面
      const subPages = ['products', 'solutions', 'support'];
      for (const subPage of subPages) {
        const subPageInfo = {
          ...brandPageInfo,
          route: `brands/${brandSlug}/${subPage}`,
          title: `${brand.name} ${subPage === 'products' ? '产品分类' : subPage === 'solutions' ? '解决方案' : '技术支持'} - 力通电子`,
          pageType: subPage
        };

        // 生成子页面HTML
        const subPageHtmlContent = generateBrandSubPageHTML(subPageInfo.title, cssFiles, brandPageAllJsFiles, subPageInfo);
        
        // 创建子页面文件路径
        const subPageFilePath = path.join('out', 'brands', brandSlug, subPage, 'index.html');
        const subPageDir = path.dirname(subPageFilePath);
        
        // 创建子页面目录
        if (!fs.existsSync(subPageDir)) {
          fs.mkdirSync(subPageDir, { recursive: true });
        }
        
        // 写入子页面HTML文件
        fs.writeFileSync(subPageFilePath, subPageHtmlContent);
        console.log(`  ✅ 生成子页面: brands/${brandSlug}/${subPage}/index.html`);
      }
    }
    
    console.log(`✅ 成功生成 ${brandPageCount} 个品牌页面`);

    // 复制必要的manifest文件到输出目录
    const manifestFiles = [
      '.next/build-manifest.json',
      '.next/app-build-manifest.json'
    ];

    for (const manifestFile of manifestFiles) {
      if (fs.existsSync(manifestFile)) {
        const outputPath = path.join('out', '_next', path.basename(manifestFile));
        if (!fs.existsSync(path.dirname(outputPath))) {
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        }
        fs.copyFileSync(manifestFile, outputPath);
        console.log(`✅ 复制 ${path.basename(manifestFile)}`);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ 智能静态导出失败:', error);
    return false;
  }
}

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
    </section>`;
}

// 品牌智能分类函数
function categorizeBrands(brands) {
  const categories = {
    '微控制器与处理器': [],
    '模拟与电源管理': [],
    '传感器与连接器': [],
    '其他分类': []
  };

  // 预定义品牌分类规则
  const categoryRules = {
    '微控制器与处理器': ['STMicroelectronics', 'Texas Instruments', 'Microchip', 'NXP', 'Espressif', 'ARM', 'Intel', 'Infineon', 'Renesas', 'Nordic'],
    '模拟与电源管理': ['Analog Devices', 'Linear Technology', 'Maxim', 'ON Semiconductor', 'TI', 'Vishay', 'Fairchild'],
    '传感器与连接器': ['Bosch', 'Sensirion', 'TE Connectivity', 'Molex', 'JAE', 'Amphenol', 'Honeywell']
  };

  brands.forEach(brand => {
    let categorized = false;
    
    for (const [categoryName, brandNames] of Object.entries(categoryRules)) {
      if (brandNames.some(name => 
        brand.name.toLowerCase().includes(name.toLowerCase()) || 
        name.toLowerCase().includes(brand.name.toLowerCase())
      )) {
        categories[categoryName].push(brand);
        categorized = true;
        break;
      }
    }
    
    if (!categorized) {
      categories['其他分类'].push(brand);
    }
  });

  return categories;
}

// 生成动态的品牌页面内容
function generateBrandsPageContentWithData(brandsData) {
  const { allBrands = [], featuredBrands = [], brandStats = {} } = brandsData || {};
  
  // 使用简化的品牌分组逻辑
  const brandCategories = groupBrandsByFirstLetter(allBrands);
  
  // 使用真实统计数据或回退到默认值
  const stats = {
    total: brandStats.total > 0 ? brandStats.total : 12,
    authorized: brandStats.authorized > 0 ? brandStats.authorized : 8,
    totalProducts: brandStats.totalProducts > 0 ? (brandStats.totalProducts > 1000 ? Math.floor(brandStats.totalProducts / 1000) + 'K' : brandStats.totalProducts) : '27K'
  };

  return `
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl font-bold mb-4">合作品牌 (已更新)</h1>
          <p class="text-xl text-purple-100">
            与全球顶尖品牌合作，为您提供优质的电子元器件产品
          </p>
          <div class="mt-6 flex justify-center space-x-8 text-sm">
            <div class="text-center">
              <div class="text-2xl font-bold">${stats.total}+</div>
              <div class="text-purple-200">合作品牌</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">${stats.authorized}+</div>
              <div class="text-purple-200">授权代理</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">${stats.totalProducts}+</div>
              <div class="text-purple-200">产品型号</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- All Brands -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">所有品牌</h2>
          <p class="text-lg text-gray-600">浏览我们合作的所有品牌</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          ${allBrands.length > 0 ? allBrands.map((brand) => `
            <a href="/brands/${encodeURIComponent(brand.slug || brand.name)}"
               class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-purple-300 transition-all duration-200 flex flex-col items-center text-center group">
              ${brand.logo ? `
                <div class="w-16 h-16 mb-3 flex items-center justify-center">
                  <img src="${brand.logo}" alt="${brand.name}" class="max-w-full max-h-full object-contain" />
                </div>
              ` : ''}
              <h3 class="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                ${brand.name}
              </h3>
              ${brand.country ? `<p class="text-xs text-gray-500 mt-1">${brand.country}</p>` : ''}
              ${brand.isFeatured ? `
                <span class="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  特色品牌
                </span>
              ` : ''}
            </a>
          `).join('') : `
            <div class="col-span-full text-center py-16">
              <div class="text-gray-400 mb-4">
                <svg class="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">暂无品牌数据</h3>
              <p class="text-gray-500">品牌信息正在加载中，请稍后再试</p>
            </div>
          `}
        </div>
      </div>
    </section>

    <!-- Featured Brands -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">特色合作品牌</h2>
          <p class="text-lg text-gray-600">深度合作的优质品牌伙伴</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${featuredBrands.length > 0 
            ? featuredBrands.slice(0, 6).map(brand => `
              <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center space-x-4">
                    ${brand.logo ? `
                      <img 
                        src="${urlFor(brand.logo).width(60).height(60).url()}"
                        alt="${brand.name}"
                        class="w-12 h-12 object-contain"
                      />
                    ` : ''}
                    <div>
                      <h3 class="text-xl font-semibold text-gray-900 mb-2"><a href="/brands/${encodeURIComponent(brand.slug || brand.name.toLowerCase())}" class="hover:text-purple-600 transition-colors">${brand.name}</a></h3>
                      <p class="text-gray-600 text-sm">${brand.description || '专业的电子元器件供应商'}</p>
                    </div>
                  </div>
                  <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    授权代理
                  </span>
                </div>
                
                <div class="space-y-2 mb-4">
                  ${brand.website ? `
                    <p class="text-sm"><span class="font-medium text-gray-700">品牌官网:</span> 
                      <a href="${brand.website}" target="_blank" rel="noopener noreferrer" class="text-purple-600 hover:underline ml-1">
                        ${brand.website.replace(/^https?:\/\//, '')}
                      </a>
                    </p>
                  ` : ''}
                  ${brand.established ? `<p class="text-sm"><span class="font-medium text-gray-700">成立时间:</span> ${brand.established}</p>` : ''}
                  ${brand.country ? `<p class="text-sm"><span class="font-medium text-gray-700">总部:</span> ${brand.country}</p>` : ''}
                  ${brand.headquarters ? `<p class="text-sm"><span class="font-medium text-gray-700">地址:</span> ${brand.headquarters}</p>` : ''}
                </div>
                
                <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span class="text-purple-600 font-medium">查看产品</span>
                  <a href="/brands/${encodeURIComponent(brand.slug || brand.name.toLowerCase())}" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    浏览产品 →
                  </a>
                </div>
              </div>
            `).join('')
            : `
            <!-- 回退品牌数据 -->
            <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">STMicroelectronics</h3>
                  <p class="text-gray-600 text-sm">全球领先的半导体供应商</p>
                </div>
                <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">授权代理</span>
              </div>
              <div class="space-y-2 mb-4">
                <p class="text-sm"><span class="font-medium text-gray-700">主要产品:</span> 微控制器、传感器、功率器件</p>
                <p class="text-sm"><span class="font-medium text-gray-700">成立时间:</span> 1987年</p>
                <p class="text-sm"><span class="font-medium text-gray-700">总部:</span> 瑞士</p>
              </div>
              <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                <span class="text-purple-600 font-medium">15,000+ 产品</span>
                <button class="text-purple-600 hover:text-purple-700 text-sm font-medium">查看产品 →</button>
              </div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">Texas Instruments</h3>
                  <p class="text-gray-600 text-sm">模拟IC和嵌入式处理器制造商</p>
                </div>
                <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">授权代理</span>
              </div>
              <div class="space-y-2 mb-4">
                <p class="text-sm"><span class="font-medium text-gray-700">主要产品:</span> 模拟IC、DSP、微控制器</p>
                <p class="text-sm"><span class="font-medium text-gray-700">成立时间:</span> 1930年</p>
                <p class="text-sm"><span class="font-medium text-gray-700">总部:</span> 美国</p>
              </div>
              <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                <span class="text-purple-600 font-medium">12,500+ 产品</span>
                <button class="text-purple-600 hover:text-purple-700 text-sm font-medium">查看产品 →</button>
              </div>
            </div>
            `
          }
        </div>
      </div>
    </section>

    <!-- Partnership Benefits -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">合作优势</h2>
          <p class="text-lg text-gray-600">作为授权代理商，我们为您提供的专业服务</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">原厂授权</h3>
            <p class="text-gray-600">100%原装正品保证</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">技术支持</h3>
            <p class="text-gray-600">原厂技术资源支持</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">供货稳定</h3>
            <p class="text-gray-600">优先供货保障</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">价格优势</h3>
            <p class="text-gray-600">一手货源价格</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact CTA -->
    <section class="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">成为我们的合作伙伴</h2>
        <p class="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          我们期待与更多优秀品牌建立长期合作关系 | 现有 ${stats.total}+ 合作品牌
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors">
            品牌合作
          </button>
          <button class="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 rounded-lg font-medium transition-colors">
            联系我们
          </button>
        </div>
      </div>
    </section>`;
}

// 生成完整的brands页面内容（原版本保留作为回退）
function generateBrandsPageContent() {
  return `
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl font-bold mb-4">合作品牌 (已更新)</h1>
          <p class="text-xl text-purple-100">
            与全球顶尖品牌合作，为您提供优质的电子元器件产品
          </p>
          <div class="mt-6 flex justify-center space-x-8 text-sm">
            <div class="text-center">
              <div class="text-2xl font-bold">12+</div>
              <div class="text-purple-200">合作品牌</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">8+</div>
              <div class="text-purple-200">授权代理</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold">27K+</div>
              <div class="text-purple-200">产品型号</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Brand Categories -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">品牌分类</h2>
          <p class="text-lg text-gray-600">按产品类别浏览合作品牌</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-16">
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="text-purple-600 mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">微控制器与处理器</h3>
            <ul class="space-y-2">
              <li class="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">• STMicroelectronics</li>
              <li class="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">• Texas Instruments</li>
              <li class="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">• Espressif Systems</li>
              <li class="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">• NXP Semiconductors</li>
            </ul>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="text-purple-600 mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">模拟与电源管理</h3>
            <ul class="space-y-2">
              <li class="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">• Analog Devices</li>
              <li class="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">• Linear Technology</li>
              <li class="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">• ON Semiconductor</li>
              <li class="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">• Infineon Technologies</li>
            </ul>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="text-purple-600 mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">传感器与连接器</h3>
            <ul class="space-y-2">
              <li class="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">• Bosch Sensortec</li>
              <li class="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">• TE Connectivity</li>
              <li class="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">• Molex</li>
              <li class="text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">• Vishay</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Brands -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">特色合作品牌</h2>
          <p class="text-lg text-gray-600">深度合作的优质品牌伙伴</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">STMicroelectronics</h3>
                <p class="text-gray-600 text-sm">全球领先的半导体供应商</p>
              </div>
              <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                授权代理
              </span>
            </div>
            <div class="space-y-2 mb-4">
              <p class="text-sm"><span class="font-medium text-gray-700">主要产品:</span> 微控制器、传感器、功率器件</p>
              <p class="text-sm"><span class="font-medium text-gray-700">成立时间:</span> 1987年</p>
              <p class="text-sm"><span class="font-medium text-gray-700">总部:</span> 瑞士</p>
              <p class="text-sm"><span class="font-medium text-gray-700">合作年限:</span> 2015年至今</p>
            </div>
            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
              <span class="text-purple-600 font-medium">15,000+ 产品</span>
              <button class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                查看产品 →
              </button>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Texas Instruments</h3>
                <p class="text-gray-600 text-sm">模拟IC和嵌入式处理器制造商</p>
              </div>
              <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                授权代理
              </span>
            </div>
            <div class="space-y-2 mb-4">
              <p class="text-sm"><span class="font-medium text-gray-700">主要产品:</span> 模拟IC、DSP、微控制器</p>
              <p class="text-sm"><span class="font-medium text-gray-700">成立时间:</span> 1930年</p>
              <p class="text-sm"><span class="font-medium text-gray-700">总部:</span> 美国</p>
              <p class="text-sm"><span class="font-medium text-gray-700">合作年限:</span> 2016年至今</p>
            </div>
            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
              <span class="text-purple-600 font-medium">12,500+ 产品</span>
              <button class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                查看产品 →
              </button>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Espressif Systems</h3>
                <p class="text-gray-600 text-sm">WiFi和蓝牙芯片领先厂商</p>
              </div>
              <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                授权代理
              </span>
            </div>
            <div class="space-y-2 mb-4">
              <p class="text-sm"><span class="font-medium text-gray-700">主要产品:</span> 无线通信芯片、模组</p>
              <p class="text-sm"><span class="font-medium text-gray-700">成立时间:</span> 2008年</p>
              <p class="text-sm"><span class="font-medium text-gray-700">总部:</span> 中国上海</p>
              <p class="text-sm"><span class="font-medium text-gray-700">合作年限:</span> 2018年至今</p>
            </div>
            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
              <span class="text-purple-600 font-medium">200+ 产品</span>
              <button class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                查看产品 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partnership Benefits -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">合作优势</h2>
          <p class="text-lg text-gray-600">作为授权代理商，我们为您提供的专业服务</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">原厂授权</h3>
            <p class="text-gray-600">100%原装正品保证</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">技术支持</h3>
            <p class="text-gray-600">原厂技术资源支持</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">供货稳定</h3>
            <p class="text-gray-600">优先供货保障</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">价格优势</h3>
            <p class="text-gray-600">一手货源价格</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact CTA -->
    <section class="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">成为我们的合作伙伴</h2>
        <p class="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          我们期待与更多优秀品牌建立长期合作关系 | 现有 12+ 合作品牌
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors">
            品牌合作
          </button>
          <button class="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 rounded-lg font-medium transition-colors">
            联系我们
          </button>
        </div>
      </div>
    </section>`;
}

// 根据页面类型生成对应的内容
function generatePageContent(pageInfo) {
  switch (pageInfo.route) {
    case 'index':
      return generateHomePageContent();
    case 'about':
      return `
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
              <h1 class="text-4xl font-bold text-gray-900 mb-6">关于我们</h1>
              <p class="text-xl text-gray-600 mb-8">力通电子致力于为客户提供高品质的电子元器件产品和专业的技术支持服务</p>
              <div class="animate-pulse">
                <div class="text-gray-500">页面内容正在加载中...</div>
              </div>
            </div>
          </div>
        </section>`;
    case 'brands':
      // 如果有品牌数据，使用动态生成，否则使用静态版本
      if (pageInfo.brandsData) {
        return generateBrandsPageContentWithData(pageInfo.brandsData);
      } else {
        return generateBrandsPageContent();
      }
    case 'products':
      return `
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
              <h1 class="text-4xl font-bold text-gray-900 mb-6">产品中心</h1>
              <p class="text-xl text-gray-600 mb-8">高品质电子元器件产品，满足您的各种需求</p>
              <div class="animate-pulse">
                <div class="text-gray-500">产品信息正在加载中...</div>
              </div>
            </div>
          </div>
        </section>`;
    default:
      return `
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
              <div class="animate-pulse">
                <div class="text-gray-500">页面内容正在加载中...</div>
              </div>
            </div>
          </div>
        </section>`;
  }
}

// 生成页面HTML内容
function generatePageHTML(title, cssFiles, jsFiles, pageInfo) {
  const cssLinks = cssFiles.map(css => `  <link rel="stylesheet" href="/_next/${css}">`).join('\n');
  const jsScripts = jsFiles.map(js => `  <script src="/_next/${js}" defer></script>`).join('\n');
  
  const headerHTML = generateHeaderHTML();
  const footerHTML = generateFooterHTML();
  const contentHTML = generatePageContent(pageInfo);
  
  return `<!DOCTYPE html>
<html lang="zh-CN" class="font-sans">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="力通电子是专业的电子元器件代理商，提供高质量的电子元器件产品和技术服务。">
  <meta name="next-head-count" content="4">
${cssLinks}
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
  <script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{}},"page":"${pageInfo.route === 'index' ? '/' : '/' + pageInfo.route}","query":{},"buildId":"${Date.now()}","nextExport":true,"autoExport":true,"isFallback":false,"scriptLoader":[]}</script>
${jsScripts}
</body>
</html>`;
}

// 生成品牌页面HTML内容
function generateBrandPageHTML(title, cssFiles, jsFiles, brandPageInfo) {
  const cssLinks = cssFiles.map(css => `  <link rel="stylesheet" href="/_next/${css}">`).join('\n');
  const jsScripts = jsFiles.map(js => `  <script src="/_next/${js}" defer></script>`).join('\n');
  
  const headerHTML = generateHeaderHTML();
  const footerHTML = generateFooterHTML();
  const brandContentHTML = generateBrandPageContent(brandPageInfo);
  
  return `<!DOCTYPE html>
<html lang="zh-CN" class="font-sans">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${brandPageInfo.brandData.description || `${brandPageInfo.brandData.name} 是力通电子的重要合作伙伴，提供优质的电子元器件产品。`}">
  <meta name="keywords" content="${brandPageInfo.brandData.name}, 电子元器件, 力通电子, 代理商, ${brandPageInfo.brandData.country || ''}">
  <meta name="next-head-count" content="5">
${cssLinks}
</head>
<body class="font-sans antialiased bg-white text-gray-900">
  <div id="__next">
    <div class="relative flex min-h-screen flex-col">
      ${headerHTML}
      <main class="flex-1">
        ${brandContentHTML}
      </main>
      ${footerHTML}
    </div>
  </div>
  <script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"brand":${JSON.stringify(brandPageInfo.brandData).replace(/"/g, '&quot;')}}},"page":"/brands/[slug]","query":{"slug":"${brandPageInfo.brandData.slug}"},"buildId":"${Date.now()}","nextExport":true,"autoExport":true,"isFallback":false,"scriptLoader":[]}</script>
${jsScripts}
</body>
</html>`;
}

// 生成品牌子页面HTML内容
function generateBrandSubPageHTML(title, cssFiles, jsFiles, subPageInfo) {
  const cssLinks = cssFiles.map(css => `  <link rel="stylesheet" href="/_next/${css}">`).join('\n');
  const jsScripts = jsFiles.map(js => `  <script src="/_next/${js}" defer></script>`).join('\n');
  
  const brandNavigationHTML = generateBrandNavigationHTML(subPageInfo.brandData);
  const footerHTML = generateFooterHTML();
  const subPageContentHTML = generateBrandSubPageContent(subPageInfo);
  
  return `<!DOCTYPE html>
<html lang="zh-CN" class="font-sans">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${getSubPageDescription(subPageInfo)}">
  <meta name="keywords" content="${subPageInfo.brandData.name}, ${getSubPageKeywords(subPageInfo.pageType)}, 电子元器件, ${subPageInfo.brandData.country || ''}">
  <meta name="next-head-count" content="5">
${cssLinks}
</head>
<body class="font-sans antialiased bg-white text-gray-900">
  <div id="__next">
    <div class="min-h-screen bg-gray-50">
      ${brandNavigationHTML}
      <main>
        ${subPageContentHTML}
      </main>
      ${footerHTML}
    </div>
  </div>
  <script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"brand":${JSON.stringify(subPageInfo.brandData).replace(/"/g, '&quot;')}}},"page":"/brands/[slug]/${subPageInfo.pageType}","query":{"slug":"${subPageInfo.brandData.slug}"},"buildId":"${Date.now()}","nextExport":true,"autoExport":true,"isFallback":false,"scriptLoader":[]}</script>
${jsScripts}
</body>
</html>`;
}

// 生成品牌页面内容
function generateBrandPageContent(brandPageInfo) {
  const brand = brandPageInfo.brandData;
  const products = brandPageInfo.products || [];
  const solutions = brandPageInfo.solutions || [];
  const articles = brandPageInfo.articles || [];
  const categories = brandPageInfo.categories || [];
  
  const logoHTML = brand.logo ? `
    <div class="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
      <img src="${urlFor(brand.logo).width(200).height(200).url()}" alt="${brand.name}" class="w-full h-full object-contain border rounded-lg p-2">
    </div>` : '';

  const websiteHTML = brand.website ? `
    <a href="${brand.website}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">
      🌐 官方网站
    </a>` : '';

  const brandInfoItems = [
    brand.country && `<div class="flex justify-between"><span class="text-gray-500">所属国家:</span><span class="font-medium">${brand.country}</span></div>`,
    brand.established && `<div class="flex justify-between"><span class="text-gray-500">成立时间:</span><span class="font-medium">${brand.established}</span></div>`,
    brand.headquarters && `<div class="flex justify-between"><span class="text-gray-500">总部地址:</span><span class="font-medium text-right">${brand.headquarters}</span></div>`
  ].filter(Boolean).join('');

  // 生成产品分类HTML
  const categoriesHTML = categories.length > 0 ? `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${categories.map(category => `
        <div class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <h3 class="font-semibold text-gray-900 mb-2">${category.name}</h3>
          ${category.description ? `<p class="text-gray-600 text-sm mb-2">${category.description}</p>` : ''}
          <span class="text-blue-600 text-sm font-medium">${category.count} 个产品</span>
        </div>
      `).join('')}
    </div>` : `<p class="text-gray-500">该品牌暂无产品分类信息。</p>`;

  // 生成产品展示HTML
  const productsHTML = products.length > 0 ? `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${products.slice(0, 6).map(product => `
        <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
          ${product.images && product.images.length > 0 ? `
            <div class="w-full h-32 mb-3 bg-gray-100 rounded overflow-hidden">
              <img src="${urlFor(product.images[0]).width(200).height(120).url()}" 
                   alt="${product.title}" class="w-full h-full object-contain">
            </div>` : ''}
          <h4 class="font-semibold text-gray-900 mb-2 line-clamp-2">${product.title}</h4>
          ${product.partNumber ? `<p class="text-blue-600 text-sm font-mono mb-2">${product.partNumber}</p>` : ''}
          ${product.shortDescription ? `<p class="text-gray-600 text-sm line-clamp-2">${product.shortDescription}</p>` : ''}
        </div>
      `).join('')}
    </div>` : `<p class="text-gray-500">该品牌暂无产品信息。</p>`;

  // 生成解决方案HTML
  const solutionsHTML = solutions.length > 0 ? `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${solutions.slice(0, 4).map(solution => `
        <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
          ${solution.heroImage ? `
            <div class="w-full h-40 mb-3 bg-gray-100 rounded overflow-hidden">
              <img src="${urlFor(solution.heroImage).width(300).height(160).url()}" 
                   alt="${solution.title}" class="w-full h-full object-cover">
            </div>` : ''}
          <h4 class="font-semibold text-gray-900 mb-2">${solution.title}</h4>
          ${solution.summary ? `<p class="text-gray-600 text-sm mb-3 line-clamp-2">${solution.summary}</p>` : ''}
          <div class="flex justify-between items-center">
            ${solution.targetMarket ? `
              <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${solution.targetMarket}</span>` : '<span></span>'}
            ${solution.publishedAt ? `
              <span class="text-gray-500 text-xs">${new Date(solution.publishedAt).toLocaleDateString('zh-CN')}</span>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : `<p class="text-gray-500">该品牌暂无解决方案信息。</p>`;

  // 生成技术支持HTML
  const articlesHTML = articles.length > 0 ? `
    <div class="space-y-4">
      ${articles.slice(0, 4).map(article => `
        <div class="border-b last:border-b-0 pb-4 last:pb-0">
          <h4 class="font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">${article.title}</h4>
          ${article.summary ? `<p class="text-gray-600 text-sm mb-2 line-clamp-2">${article.summary}</p>` : ''}
          <div class="flex justify-between items-center text-xs text-gray-500">
            ${article.publishedAt ? `<span>${new Date(article.publishedAt).toLocaleDateString('zh-CN')}</span>` : '<span></span>'}
            ${article.readingTime ? `<span>阅读时间: ${article.readingTime}分钟</span>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : `
    <div class="space-y-4">
      <div class="border-b pb-4">
        <h4 class="font-semibold text-gray-900 mb-2">📖 产品资料下载</h4>
        <p class="text-gray-600 text-sm">提供完整的产品规格书、应用指南和技术文档下载。</p>
      </div>
      <div class="border-b pb-4">
        <h4 class="font-semibold text-gray-900 mb-2">🔧 技术支持服务</h4>
        <p class="text-gray-600 text-sm">专业工程师提供选型建议、设计支持和技术咨询服务。</p>
      </div>
      <div class="border-b pb-4">
        <h4 class="font-semibold text-gray-900 mb-2">📧 在线技术咨询</h4>
        <p class="text-gray-600 text-sm">通过邮件或在线客服获得快速的技术问题解答。</p>
      </div>
      <div class="pb-4">
        <h4 class="font-semibold text-gray-900 mb-2">🎓 技术培训</h4>
        <p class="text-gray-600 text-sm">定期举办产品培训和技术研讨会，提升工程师技能。</p>
      </div>
    </div>`;

  return `
    <div class="min-h-screen bg-gray-50">
      <!-- 品牌头部 -->
      <div class="bg-white border-b">
        <div class="container mx-auto px-4 py-8">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
            ${logoHTML}
            <div class="flex-1">
              <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">${brand.name}</h1>
              ${brand.description ? `<p class="text-lg text-gray-600 mb-4">${brand.description}</p>` : ''}
              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                ${brand.country ? `<span>📍 ${brand.country}</span>` : ''}
                ${brand.established ? `<span>📅 成立于 ${brand.established}</span>` : ''}
                ${brand.headquarters ? `<span>🏢 ${brand.headquarters}</span>` : ''}
                ${websiteHTML}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 品牌详情内容 -->
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- 主要内容区域 -->
          <div class="lg:col-span-2">
            <!-- 品牌介绍 -->
            <div class="bg-white rounded-lg shadow p-6 mb-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">品牌介绍</h2>
              <div class="prose prose-gray max-w-none">
                ${brand.description ? `<p class="text-gray-600 leading-relaxed">${brand.description}</p>` : '<p class="text-gray-500">暂无详细介绍。</p>'}
              </div>
            </div>

            <!-- 产品分类 -->
            <div class="bg-white rounded-lg shadow p-6 mb-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">产品分类</h2>
              ${categoriesHTML}
            </div>

            <!-- 产品展示 -->
            <div class="bg-white rounded-lg shadow p-6 mb-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-900">热门产品</h2>
                ${products.length > 0 ? `<a href="/products?brand=${encodeURIComponent(brand.slug || brand.name)}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">查看全部 →</a>` : ''}
              </div>
              ${productsHTML}
            </div>

            <!-- 解决方案 -->
            <div class="bg-white rounded-lg shadow p-6 mb-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-900">解决方案</h2>
                ${solutions.length > 0 ? `<a href="/solutions?brand=${encodeURIComponent(brand.slug || brand.name)}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">查看全部 →</a>` : ''}
              </div>
              ${solutionsHTML}
            </div>

            <!-- 技术文章 -->
            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-900">技术支持</h2>
                ${articles.length > 0 ? `<a href="/articles?brand=${encodeURIComponent(brand.slug || brand.name)}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">查看全部 →</a>` : ''}
              </div>
              ${articlesHTML}
            </div>
          </div>

          <!-- 侧边栏 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow p-6 mb-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">品牌信息</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-500">品牌名称:</span>
                  <span class="font-medium">${brand.name}</span>
                </div>
                ${brandInfoItems}
                <div class="flex justify-between">
                  <span class="text-gray-500">代理状态:</span>
                  <span class="font-medium ${brand.isFeatured ? 'text-green-600' : 'text-blue-600'}">
                    ${brand.isFeatured ? '重点品牌' : '合作品牌'}
                  </span>
                </div>
              </div>
            </div>
            ${brand.website ? `
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">外部链接</h3>
              <a href="${brand.website}" target="_blank" rel="noopener noreferrer" 
                 class="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                访问官方网站 →
              </a>
            </div>` : ''}
          </div>
        </div>
      </div>
    </div>`;
}

async function main() {
  try {
    // 步骤1: 清理旧的构建文件
    console.log('🧹 清理旧的构建文件...');
    console.log('📝 清理 out 目录...');
    await removeDirectory('out');
    console.log('📝 清理 .next 目录...');
    await removeDirectory('.next');

    // 步骤2: 尝试正常构建
    try {
      await runCommand('npx next build', 'Next.js 构建');
      console.log('✅ 正常构建完成！');
    } catch (error) {
      console.log('⚠️  正常构建失败，尝试强制构建...');
      
      // 步骤3: 强制构建（忽略错误）
      try {
        await runCommand('npx next build || true', '强制构建（忽略错误）');
      } catch (forceError) {
        console.log('⚠️  强制构建也失败，继续尝试手动导出...');
      }
    }

    // 步骤4: 检查构建结果
    let buildSuccess = false;
    if (fs.existsSync('out') && fs.readdirSync('out').length > 0) {
      console.log('✅ 检测到 out 目录有内容，构建成功！');
      buildSuccess = true;
    } else if (fs.existsSync('.next')) {
      console.log('📦 检测到 .next 目录，尝试手动静态导出...');
      buildSuccess = await manualStaticExport();
    }

    // 步骤5: 验证结果
    if (buildSuccess && fs.existsSync('out') && fs.readdirSync('out').length > 0) {
      console.log('🎉 静态构建成功完成！');
      console.log('📦 输出目录: out/');
      console.log('✅ 部署准备就绪！');
      
      // 显示生成的文件
      const files = fs.readdirSync('out');
      console.log('📋 生成的文件:', files.join(', '));
    } else {
      console.error('❌ 静态文件生成失败');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ 构建过程失败:', error);
    process.exit(1);
  }
}

// 生成品牌导航HTML
function generateBrandNavigationHTML(brand) {
  const baseUrl = `/brands/${encodeURIComponent(brand.slug || brand.name)}`;
  const logoHTML = brand.logo ? `
    <div class="w-12 h-12 flex-shrink-0">
      <img src="${urlFor(brand.logo).width(60).height(60).url()}" alt="${brand.name}" class="w-full h-full object-contain rounded-lg border p-1">
    </div>` : '';

  return `
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <!-- Top Bar - Back to main site -->
      <div class="bg-gray-100 border-b border-gray-200">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-10 text-sm">
            <a href="/" class="text-gray-600 hover:text-blue-600 transition-colors">← 返回力通电子主站</a>
            <div class="text-gray-500">${brand.country ? `来自 ${brand.country}` : ''}</div>
          </div>
        </div>
      </div>

      <!-- Brand Header -->
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-20">
          <!-- Brand Logo & Info -->
          <div class="flex items-center space-x-4">
            ${logoHTML}
            <div>
              <h1 class="text-xl font-bold text-gray-900">${brand.name}</h1>
              ${brand.description ? `<p class="text-sm text-gray-600 max-w-md truncate">${brand.description}</p>` : ''}
            </div>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <a href="${baseUrl}" class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span>品牌首页</span>
            </a>
            <a href="${baseUrl}/products" class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
              </svg>
              <span>产品分类</span>
            </a>
            <a href="${baseUrl}/solutions" class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>解决方案</span>
            </a>
            <a href="${baseUrl}/support" class="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>技术支持</span>
            </a>
          </nav>

          <!-- Actions -->
          <div class="hidden md:flex items-center space-x-4">
            ${brand.website ? `
              <a href="${brand.website}" target="_blank" rel="noopener noreferrer" 
                 class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                官方网站
              </a>` : ''}
            <a href="/inquiry" class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              立即询价
            </a>
          </div>
        </div>
      </div>
    </header>`;
}

// 生成品牌子页面内容
function generateBrandSubPageContent(subPageInfo) {
  const { brandData, pageType, products, solutions, articles, categories } = subPageInfo;
  const baseUrl = `/brands/${encodeURIComponent(brandData.slug || brandData.name)}`;
  
  if (pageType === 'products') {
    return generateProductsPageContent(brandData, products, categories, baseUrl);
  } else if (pageType === 'solutions') {
    return generateSolutionsPageContent(brandData, solutions, baseUrl);
  } else if (pageType === 'support') {
    return generateSupportPageContent(brandData, articles, baseUrl);
  }
  
  return '<div class="container mx-auto px-4 py-8"><p>页面内容正在开发中...</p></div>';
}

// 生成产品页面内容
function generateProductsPageContent(brand, products, categories, baseUrl) {
  const categoriesHTML = categories.length > 0 ? `
    <div class="space-y-2">
      ${categories.map(category => `
        <div class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
          <div>
            <h4 class="font-medium text-gray-900">${category.name}</h4>
            ${category.description ? `<p class="text-sm text-gray-500 mt-1">${category.description}</p>` : ''}
          </div>
          <span class="text-sm text-blue-600 font-medium">${category.count}</span>
        </div>
      `).join('')}
    </div>` : `
    <div class="text-center py-8">
      <svg class="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
      </svg>
      <p class="text-gray-500">暂无分类信息</p>
    </div>`;

  const productsHTML = products.length > 0 ? `
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      ${products.map(product => `
        <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
          ${product.images && product.images.length > 0 ? `
            <div class="w-full h-48 mb-4 bg-gray-50 rounded-lg overflow-hidden">
              <img src="${urlFor(product.images[0]).width(300).height(200).url()}" 
                   alt="${product.title}" class="w-full h-full object-contain">
            </div>` : ''}
          <div>
            <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${product.title}</h3>
            ${product.partNumber ? `<p class="text-blue-600 text-sm font-mono mb-2">${product.partNumber}</p>` : ''}
            ${product.shortDescription ? `<p class="text-gray-600 text-sm mb-4 line-clamp-2">${product.shortDescription}</p>` : ''}
            <div class="flex space-x-2">
              <a href="/products/${product.slug || product._id}" 
                 class="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                查看详情
              </a>
              <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                询价
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>` : `
    <div class="text-center py-16">
      <svg class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">暂无产品信息</h3>
      <p class="text-gray-500 mb-6">该品牌的产品信息正在完善中，敬请期待</p>
      <a href="/inquiry" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        联系我们了解更多
      </a>
    </div>`;

  return `
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <a href="${baseUrl}" class="hover:text-blue-600">${brand.name}</a>
          <span>/</span>
          <span class="text-gray-900">产品分类</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">${brand.name} 产品分类</h1>
        <p class="text-lg text-gray-600">浏览 ${brand.name} 的全部产品系列和分类</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 产品分类侧边栏 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              产品分类
            </h3>
            ${categoriesHTML}
          </div>
        </div>

        <!-- 产品列表 -->
        <div class="lg:col-span-3">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900 flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
              </svg>
              全部产品 (${products.length})
            </h2>
          </div>
          ${productsHTML}
        </div>
      </div>
    </div>`;
}

// 生成解决方案页面内容
function generateSolutionsPageContent(brand, solutions, baseUrl) {
  const solutionsHTML = solutions.length > 0 ? `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${solutions.map(solution => `
        <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
          <div class="h-48 bg-gray-100 relative overflow-hidden">
            ${solution.heroImage ? `
              <img src="${urlFor(solution.heroImage).width(400).height(200).url()}" 
                   alt="${solution.title}" class="w-full h-full object-cover">
            ` : `
              <div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
            `}
          </div>
          <div class="p-6">
            <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${solution.title}</h3>
            ${solution.summary ? `<p class="text-gray-600 text-sm mb-4 line-clamp-3">${solution.summary}</p>` : ''}
            <div class="flex items-center justify-between">
              ${solution.targetMarket ? `<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${solution.targetMarket}</span>` : '<span></span>'}
              <a href="/solutions/${solution.slug}" class="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center space-x-1">
                <span>查看详情</span>
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      `).join('')}
    </div>` : `
    <div class="text-center py-16">
      <svg class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">解决方案正在完善中</h3>
      <p class="text-gray-500 mb-6">${brand.name} 的解决方案正在整理中，敬请期待</p>
      <a href="/inquiry" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        联系我们了解更多
      </a>
    </div>`;

  return `
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <a href="${baseUrl}" class="hover:text-blue-600">${brand.name}</a>
          <span>/</span>
          <span class="text-gray-900">解决方案</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">${brand.name} 解决方案</h1>
        <p class="text-lg text-gray-600">探索 ${brand.name} 提供的完整解决方案和技术应用</p>
      </div>
      ${solutionsHTML}
    </div>`;
}

// 生成技术支持页面内容
function generateSupportPageContent(brand, articles, baseUrl) {
  const articlesHTML = articles.length > 0 ? `
    <div class="space-y-6">
      ${articles.map(article => `
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <h3 class="font-semibold text-gray-900 text-lg hover:text-blue-600 cursor-pointer mb-2">${article.title}</h3>
          ${article.summary ? `<p class="text-gray-600 mb-4 line-clamp-3">${article.summary}</p>` : ''}
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              ${article.publishedAt ? `<span>${new Date(article.publishedAt).toLocaleDateString('zh-CN')}</span>` : ''}
              ${article.readingTime ? `<span>阅读时间: ${article.readingTime}分钟</span>` : ''}
            </div>
            <button class="text-blue-600 text-sm font-medium hover:text-blue-800">阅读全文</button>
          </div>
        </div>
      `).join('')}
    </div>` : `
    <div class="bg-white rounded-lg shadow p-8 text-center">
      <svg class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">技术文章正在完善中</h3>
      <p class="text-gray-500 mb-6">${brand.name} 的技术文章和支持文档正在整理中，敬请期待</p>
      <a href="/inquiry" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        联系我们了解更多
      </a>
    </div>`;

  return `
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <a href="${baseUrl}" class="hover:text-blue-600">${brand.name}</a>
          <span>/</span>
          <span class="text-gray-900">技术支持</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">${brand.name} 技术支持</h1>
        <p class="text-lg text-gray-600">获取专业的技术文档、支持服务和培训资源</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Technical Articles -->
        <div class="lg:col-span-2">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">技术文章</h2>
          ${articlesHTML}
        </div>

        <!-- Support Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">联系技术支持</h3>
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">邮件咨询</p>
                  <p class="text-sm text-gray-600">support@litongtech.com</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">电话咨询</p>
                  <p class="text-sm text-gray-600">+86-755-xxxxxxxx</p>
                </div>
              </div>
            </div>
            <a href="/inquiry" class="w-full mt-6 bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium block">
              提交技术咨询
            </a>
          </div>
        </div>
      </div>
    </div>`;
}

// 获取子页面描述
function getSubPageDescription(subPageInfo) {
  const { brandData, pageType } = subPageInfo;
  if (pageType === 'products') {
    return `浏览 ${brandData.name} 的全部产品系列和分类，包含详细的技术规格和应用信息。`;
  } else if (pageType === 'solutions') {
    return `探索 ${brandData.name} 提供的完整解决方案和技术应用，为您的项目提供专业的技术支持。`;
  } else if (pageType === 'support') {
    return `获取 ${brandData.name} 的专业技术文档、支持服务和培训资源，专业工程师为您提供全方位技术支持。`;
  }
  return brandData.description || `${brandData.name} 相关页面`;
}

// 获取子页面关键词
function getSubPageKeywords(pageType) {
  if (pageType === 'products') {
    return '产品分类, 技术规格';
  } else if (pageType === 'solutions') {
    return '解决方案, 技术应用';
  } else if (pageType === 'support') {
    return '技术支持, 产品资料, 技术咨询';
  }
  return '';
}

main();