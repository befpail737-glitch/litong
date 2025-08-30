#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🌐 生产环境工作流测试 - elec-distributor.com');
console.log('=============================================');

const config = {
    productionUrl: 'https://elec-distributor.com',
    testArticle: {
        title: "ESP32-S3双核处理器应用指南",
        titleEn: "ESP32-S3 Dual-Core Processor Application Guide",
        summary: "详细介绍ESP32-S3双核处理器的特性、开发环境配置和实际应用案例，为IoT项目开发提供全面指导。",
        content: `# ESP32-S3双核处理器应用指南

ESP32-S3是乐鑫科技推出的高性能、低功耗的双核处理器，专为物联网应用设计。

## 主要特性

### 1. 双核架构
- 双核Xtensa LX7 32位处理器
- 主频高达240MHz
- 支持浮点运算单元(FPU)

### 2. 丰富的连接性
- Wi-Fi 802.11b/g/n (2.4 GHz)
- Bluetooth 5.0 (LE)
- 多种外设接口

### 3. AI加速
- 内置AI加速器
- 支持神经网络推理
- 机器学习算法优化

## 开发环境配置

### 1. ESP-IDF安装
\`\`\`bash
git clone https://github.com/espressif/esp-idf.git
cd esp-idf
./install.sh esp32s3
\`\`\`

### 2. 项目创建
\`\`\`bash
idf.py create-project my_esp32s3_project
cd my_esp32s3_project
idf.py set-target esp32s3
\`\`\`

## 应用案例

### 1. 智能音响
- 语音识别
- 音频播放
- Wi-Fi连接

### 2. 智能摄像头
- 图像处理
- 人脸识别
- 云端传输

### 3. 工业网关
- 多协议支持
- 数据采集
- 边缘计算

## 选型建议

根据应用需求选择合适的ESP32-S3型号：

1. **ESP32-S3-WROOM-1**: 基础版本，适合一般IoT应用
2. **ESP32-S3-WROOM-1U**: 带外部天线连接器
3. **ESP32-S3-MINI-1**: 小尺寸版本，适合空间受限应用

## 常见问题

**Q: ESP32-S3与ESP32有什么区别？**
A: ESP32-S3采用更新的Xtensa LX7内核，性能更强，支持AI加速。

**Q: 如何优化功耗？**
A: 合理使用睡眠模式，优化代码结构，选择合适的时钟频率。

---

*本文由立通电子技术团队编写，为客户提供专业的技术支持。*`,
        category: "应用笔记",
        tags: ["ESP32-S3", "IoT", "双核处理器", "无线通信"],
        author: "立通电子FAE团队"
    }
};

let testResults = [];

function addResult(test, status, details = '', data = null) {
    const result = { test, status, details, data, timestamp: new Date().toLocaleTimeString() };
    testResults.push(result);
    const icon = status === 'success' ? '✅' : status === 'error' ? '❌' : '⚠️';
    console.log(`${icon} ${test}: ${details || status}`);
}

// 测试生产环境访问
async function testProductionAccess() {
    console.log('\n🔍 测试生产环境访问...\n');
    
    try {
        // 1. 测试主页
        console.log('1️⃣ 测试生产环境主页...');
        const homeResponse = await fetch(`${config.productionUrl}/zh`);
        if (homeResponse.ok) {
            addResult('生产环境主页', 'success', '主页可正常访问');
        } else {
            addResult('生产环境主页', 'error', `访问失败: ${homeResponse.status}`);
        }
        
        // 2. 测试管理后台
        console.log('2️⃣ 测试管理后台...');
        const adminResponse = await fetch(`${config.productionUrl}/zh/admin/dashboard`);
        if (adminResponse.ok) {
            addResult('管理后台访问', 'success', '管理后台可正常访问');
        } else {
            addResult('管理后台访问', 'error', `访问失败: ${adminResponse.status}`);
        }
        
        // 3. 测试文章管理页面
        console.log('3️⃣ 测试文章管理页面...');
        const articlesResponse = await fetch(`${config.productionUrl}/zh/admin/articles`);
        if (articlesResponse.ok) {
            addResult('文章管理页面', 'success', '文章管理页面可正常访问');
        } else {
            addResult('文章管理页面', 'error', `访问失败: ${articlesResponse.status}`);
        }
        
        // 4. 测试上传API
        console.log('4️⃣ 测试文章上传API...');
        const uploadResponse = await fetch(`${config.productionUrl}/api/sanity/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: [config.testArticle],
                type: 'solutions'
            })
        });
        
        if (uploadResponse.ok) {
            const result = await uploadResponse.json();
            addResult('文章上传API', 'success', '文章上传成功', result);
        } else {
            const error = await uploadResponse.text().catch(() => `HTTP ${uploadResponse.status}`);
            addResult('文章上传API', 'error', `上传失败: ${error}`);
        }
        
    } catch (error) {
        addResult('生产环境测试', 'error', error.message);
    }
}

// 测试前端显示
async function testFrontendDisplay() {
    console.log('\n🌐 测试前端文章显示...\n');
    
    try {
        // 等待数据同步
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 1. 检查主页
        console.log('1️⃣ 检查主页文章显示...');
        const homeResponse = await fetch(`${config.productionUrl}/zh`);
        if (homeResponse.ok) {
            const homeContent = await homeResponse.text();
            if (homeContent.includes('ESP32-S3') || homeContent.includes(config.testArticle.title)) {
                addResult('主页文章显示', 'success', '新文章已在主页显示');
            } else {
                addResult('主页文章显示', 'warning', '主页暂未显示新文章，可能需要时间同步');
            }
        } else {
            addResult('主页检查', 'error', `无法访问主页: ${homeResponse.status}`);
        }
        
        // 2. 检查解决方案页面（如果存在）
        console.log('2️⃣ 检查解决方案页面...');
        const solutionsResponse = await fetch(`${config.productionUrl}/zh/solutions`).catch(() => null);
        if (solutionsResponse && solutionsResponse.ok) {
            const solutionsContent = await solutionsResponse.text();
            if (solutionsContent.includes(config.testArticle.title)) {
                addResult('解决方案页面', 'success', '文章已在解决方案页面显示');
            } else {
                addResult('解决方案页面', 'warning', '解决方案页面暂未显示新文章');
            }
        } else {
            addResult('解决方案页面', 'info', '解决方案页面不存在或无法访问');
        }
        
        // 3. 检查是否有技术文章页面
        console.log('3️⃣ 检查技术文章页面...');
        const techResponse = await fetch(`${config.productionUrl}/zh/tech`).catch(() => null);
        if (techResponse && techResponse.ok) {
            addResult('技术文章页面', 'success', '技术文章页面可访问');
        } else {
            addResult('技术文章页面', 'info', '技术文章页面不存在或无法访问');
        }
        
    } catch (error) {
        addResult('前端显示测试', 'error', error.message);
    }
}

// 生成生产环境测试报告
function generateProductionReport() {
    const successCount = testResults.filter(r => r.status === 'success').length;
    const errorCount = testResults.filter(r => r.status === 'error').length;
    const warningCount = testResults.filter(r => r.status === 'warning').length;
    const infoCount = testResults.filter(r => r.status === 'info').length;
    
    const overallStatus = errorCount === 0 ? 'success' : 'warning';
    
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>生产环境工作流测试报告 - elec-distributor.com</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .report { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
        .stat-card { padding: 15px; border-radius: 8px; text-align: center; }
        .stat-success { background: #d4edda; color: #155724; }
        .stat-error { background: #f8d7da; color: #721c24; }
        .stat-warning { background: #fff3cd; color: #856404; }
        .stat-info { background: #d1ecf1; color: #0c5460; }
        .test-item { margin: 15px 0; padding: 15px; border-left: 4px solid #ddd; background: #f8f9fa; }
        .test-success { border-color: #28a745; }
        .test-error { border-color: #dc3545; }
        .test-warning { border-color: #ffc107; }
        .test-info { border-color: #17a2b8; }
        .article-preview { background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .production-links { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        pre { background: #f1f1f1; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 12px; }
    </style>
</head>
<body>
    <div class="report">
        <div class="header">
            <h1>🌐 生产环境工作流测试报告</h1>
            <p><strong>测试站点:</strong> https://elec-distributor.com</p>
            <p>测试时间: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="stat-card stat-success">
                <h3>${successCount}</h3>
                <p>测试通过</p>
            </div>
            <div class="stat-card stat-error">
                <h3>${errorCount}</h3>
                <p>测试失败</p>
            </div>
            <div class="stat-card stat-warning">
                <h3>${warningCount}</h3>
                <p>需要关注</p>
            </div>
            <div class="stat-card stat-info">
                <h3>${infoCount}</h3>
                <p>信息提示</p>
            </div>
        </div>
        
        <div class="article-preview">
            <h3>📝 测试文章信息</h3>
            <p><strong>标题:</strong> ${config.testArticle.title}</p>
            <p><strong>分类:</strong> ${config.testArticle.category}</p>
            <p><strong>标签:</strong> ${config.testArticle.tags.join(', ')}</p>
            <p><strong>作者:</strong> ${config.testArticle.author}</p>
            <p><strong>摘要:</strong> ${config.testArticle.summary}</p>
        </div>
        
        <h2>详细测试结果</h2>
        ${testResults.map(result => `
            <div class="test-item test-${result.status}">
                <h4>${result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : result.status === 'warning' ? '⚠️' : 'ℹ️'} ${result.test}</h4>
                <p>${result.details || result.status}</p>
                ${result.data ? `<pre>${JSON.stringify(result.data, null, 2)}</pre>` : ''}
                <small style="color: #6c757d;">${result.timestamp}</small>
            </div>
        `).join('')}
        
        <div class="production-links">
            <h3>🔗 生产环境链接</h3>
            <ul>
                <li><a href="${config.productionUrl}/zh" target="_blank">前台主页</a></li>
                <li><a href="${config.productionUrl}/zh/admin/dashboard" target="_blank">管理后台</a></li>
                <li><a href="${config.productionUrl}/zh/admin/articles" target="_blank">文章管理</a></li>
            </ul>
        </div>
        
        <h2>📋 测试结论</h2>
        <div style="background: ${overallStatus === 'success' ? '#d4edda' : '#fff3cd'}; 
                    color: ${overallStatus === 'success' ? '#155724' : '#856404'};
                    padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${overallStatus === 'success' 
                ? '<p><strong>🎉 生产环境测试通过！</strong> 文章上传工作流程在生产环境运行正常。</p>'
                : '<p><strong>⚠️ 生产环境基本正常，但需要关注部分功能。</strong> 建议检查警告项目并优化相关功能。</p>'
            }
        </div>
        
        <h2>📈 下一步建议</h2>
        <ul>
            <li>检查文章是否在生产环境正确显示</li>
            <li>验证文章详情页面功能</li>
            <li>测试文章编辑和删除功能</li>
            <li>配置SEO优化和社交媒体分享</li>
            <li>设置文章分类和标签管理</li>
            <li>优化文章搜索功能</li>
        </ul>
    </div>
</body>
</html>`;
    
    return html;
}

// 主测试流程
async function runProductionTests() {
    console.log('开始生产环境工作流测试...\n');
    
    // 1. 测试生产环境访问和上传
    await testProductionAccess();
    
    // 2. 测试前端显示
    await testFrontendDisplay();
    
    // 3. 生成报告
    console.log('\n📊 生产环境测试统计');
    console.log('========================');
    
    const successCount = testResults.filter(r => r.status === 'success').length;
    const errorCount = testResults.filter(r => r.status === 'error').length;
    const warningCount = testResults.filter(r => r.status === 'warning').length;
    const infoCount = testResults.filter(r => r.status === 'info').length;
    
    console.log(`✅ 成功: ${successCount} 项`);
    console.log(`❌ 失败: ${errorCount} 项`);
    console.log(`⚠️  警告: ${warningCount} 项`);
    console.log(`ℹ️  信息: ${infoCount} 项`);
    
    // 4. 生成HTML报告
    const htmlReport = generateProductionReport();
    fs.writeFileSync(path.join(__dirname, 'production-workflow-report.html'), htmlReport);
    console.log('\n📝 生产环境测试报告已生成: production-workflow-report.html');
    
    console.log('\n🎯 生产环境测试完成！');
    
    if (errorCount === 0) {
        console.log('✨ 生产环境工作流程运行正常！');
    } else {
        console.log('⚠️  生产环境存在一些问题，请查看报告了解详情。');
    }
    
    return { success: successCount, error: errorCount, warning: warningCount, info: infoCount };
}

// 运行测试
runProductionTests().catch(console.error);