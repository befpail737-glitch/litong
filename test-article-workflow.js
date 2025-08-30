#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 文章工作流测试 - 立通电子');
console.log('=====================================');

// 测试配置
const config = {
    localUrl: 'http://localhost:3002',
    productionUrl: 'https://elec-distributor.com',
    testArticle: {
        title: "STM32F4系列微控制器深度解析",
        titleEn: "STM32F4 Series Microcontroller Deep Analysis",
        summary: "本文深入分析STM32F4系列微控制器的特性、应用场景和开发技巧，为工程师提供全面的技术指导。",
        content: `# STM32F4系列微控制器深度解析

STM32F4系列微控制器是STMicroelectronics推出的基于ARM Cortex-M4内核的高性能32位微控制器，具有出色的处理能力和丰富的外设资源。

## 主要特性

### 1. 高性能内核
- ARM Cortex-M4 内核，主频高达180MHz
- 浮点运算单元(FPU)，支持单精度浮点运算
- DSP指令集，适合数字信号处理应用

### 2. 存储资源
- Flash存储器：512KB到2MB不等
- SRAM：192KB到256KB
- 支持外部存储器接口

### 3. 丰富的外设
- 多达17个定时器
- 最多3个SPI接口
- 最多4个USART/UART接口
- 2个CAN接口
- USB OTG接口

## 应用场景

STM32F4系列广泛应用于：

1. **工业自动化**
   - PLC控制系统
   - 电机控制
   - 传感器数据采集

2. **消费电子**
   - 音频处理设备
   - 人机界面(HMI)
   - 智能家居设备

3. **通信设备**
   - 网关设备
   - 协议转换器
   - 数据采集器

## 开发工具链

### 推荐开发环境
- **STM32CubeIDE**：官方集成开发环境
- **STM32CubeMX**：图形化配置工具
- **HAL库**：硬件抽象层库

### 调试工具
- ST-LINK调试器
- J-LINK调试器
- 串口调试助手

## 选型指南

选择STM32F4系列时需要考虑：

1. **性能需求**：根据应用复杂度选择合适的主频
2. **存储需求**：评估代码和数据的存储需求
3. **外设需求**：确认所需的通信接口和定时器数量
4. **封装形式**：根据PCB设计选择合适的封装

## 常见问题解答

**Q: STM32F4与STM32F1有什么区别？**
A: STM32F4采用Cortex-M4内核，性能更强，支持浮点运算和DSP指令。

**Q: 如何选择合适的晶振频率？**
A: 建议使用8MHz或25MHz外部晶振，通过PLL倍频到系统所需频率。

**Q: STM32F4支持哪些通信协议？**
A: 支持UART、SPI、I2C、CAN、USB等多种通信协议。

## 总结

STM32F4系列微控制器凭借其强大的性能和丰富的外设资源，成为工业控制、消费电子等领域的理想选择。合理的选型和开发工具链配置，能够显著提升开发效率。

---

*本文由立通电子技术团队原创，转载请注明出处。*`,
        category: "technical",
        tags: ["STM32", "微控制器", "嵌入式", "ARM"],
        author: "立通电子技术团队",
        publishDate: new Date().toISOString()
    }
};

let testResults = [];

// 添加测试结果
function addResult(test, status, details = '', data = null) {
    const result = {
        test,
        status,
        details,
        data,
        timestamp: new Date().toLocaleTimeString()
    };
    testResults.push(result);
    
    const icon = status === 'success' ? '✅' : status === 'error' ? '❌' : '⚠️';
    console.log(`${icon} ${test}: ${details || status}`);
    
    return result;
}

// 测试本地API上传
async function testLocalUpload() {
    try {
        console.log('\n📤 测试本地API上传...');
        
        // 首先测试服务器是否运行
        const healthCheck = await fetch(`${config.localUrl}/zh`).catch(err => null);
        if (!healthCheck || !healthCheck.ok) {
            addResult('本地服务器检查', 'error', '本地开发服务器未运行');
            return false;
        }
        
        addResult('本地服务器检查', 'success', '服务器运行正常');
        
        // 测试Sanity上传API
        const uploadResponse = await fetch(`${config.localUrl}/api/sanity/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: [config.testArticle],
                type: 'solutions'
            })
        });
        
        if (uploadResponse.ok) {
            const result = await uploadResponse.json();
            addResult('文章上传到Sanity', 'success', `成功上传文章: ${config.testArticle.title}`, result);
            return result;
        } else {
            const error = await uploadResponse.text();
            addResult('文章上传到Sanity', 'error', `上传失败: ${uploadResponse.status} - ${error}`);
            return false;
        }
    } catch (error) {
        addResult('本地API测试', 'error', error.message);
        return false;
    }
}

// 测试前端显示
async function testFrontendDisplay() {
    try {
        console.log('\n🌐 测试前端文章显示...');
        
        // 等待一段时间让数据同步
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 测试主页是否显示文章
        const homeResponse = await fetch(`${config.localUrl}/zh`);
        if (homeResponse.ok) {
            const homeContent = await homeResponse.text();
            
            if (homeContent.includes(config.testArticle.title) || 
                homeContent.includes('STM32F4')) {
                addResult('主页文章显示', 'success', '文章已在主页显示');
            } else {
                addResult('主页文章显示', 'warning', '主页暂未显示新文章，可能需要时间同步');
            }
        } else {
            addResult('主页访问测试', 'error', `无法访问主页: ${homeResponse.status}`);
        }
        
        // 测试解决方案页面
        const solutionsResponse = await fetch(`${config.localUrl}/zh/solutions`).catch(() => null);
        if (solutionsResponse && solutionsResponse.ok) {
            const solutionsContent = await solutionsResponse.text();
            
            if (solutionsContent.includes(config.testArticle.title)) {
                addResult('解决方案页面显示', 'success', '文章已在解决方案页面显示');
            } else {
                addResult('解决方案页面显示', 'warning', '解决方案页面暂未显示新文章');
            }
        } else {
            addResult('解决方案页面测试', 'warning', '解决方案页面不存在或无法访问');
        }
        
    } catch (error) {
        addResult('前端显示测试', 'error', error.message);
    }
}

// 测试生产环境显示
async function testProductionDisplay() {
    try {
        console.log('\n🌍 测试生产环境显示...');
        
        // 测试生产环境主页
        const prodHomeResponse = await fetch(`${config.productionUrl}/zh`);
        if (prodHomeResponse.ok) {
            const content = await prodHomeResponse.text();
            addResult('生产环境访问', 'success', '生产环境可正常访问');
            
            // 检查是否有文章显示
            if (content.includes('文章') || content.includes('新闻') || content.includes('解决方案')) {
                addResult('生产环境内容检查', 'success', '生产环境有内容展示');
            } else {
                addResult('生产环境内容检查', 'warning', '生产环境内容较少');
            }
        } else {
            addResult('生产环境访问', 'error', `生产环境访问失败: ${prodHomeResponse.status}`);
        }
        
    } catch (error) {
        addResult('生产环境测试', 'error', error.message);
    }
}

// 生成修复建议
function generateFixSuggestions() {
    const errors = testResults.filter(r => r.status === 'error');
    const warnings = testResults.filter(r => r.status === 'warning');
    
    const suggestions = [];
    
    if (errors.some(e => e.test.includes('本地服务器'))) {
        suggestions.push('启动本地开发服务器: npm run dev');
    }
    
    if (errors.some(e => e.test.includes('Sanity'))) {
        suggestions.push('检查Sanity配置和API密钥');
        suggestions.push('确认.env.local文件配置正确');
    }
    
    if (warnings.some(w => w.test.includes('显示'))) {
        suggestions.push('检查前端组件是否正确获取和显示文章数据');
        suggestions.push('确认路由配置正确');
        suggestions.push('检查数据同步是否需要时间');
    }
    
    return suggestions;
}

// 生成HTML报告
function generateHtmlReport() {
    const successCount = testResults.filter(r => r.status === 'success').length;
    const errorCount = testResults.filter(r => r.status === 'error').length;
    const warningCount = testResults.filter(r => r.status === 'warning').length;
    
    const suggestions = generateFixSuggestions();
    
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文章工作流测试报告 - 立通电子</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .report { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { padding: 20px; border-radius: 8px; text-align: center; }
        .stat-success { background: #d4edda; color: #155724; }
        .stat-error { background: #f8d7da; color: #721c24; }
        .stat-warning { background: #fff3cd; color: #856404; }
        .test-item { margin: 15px 0; padding: 15px; border-left: 4px solid #ddd; background: #f8f9fa; }
        .test-success { border-color: #28a745; }
        .test-error { border-color: #dc3545; }
        .test-warning { border-color: #ffc107; }
        .timestamp { color: #6c757d; font-size: 12px; margin-top: 5px; }
        .suggestions { background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .test-article { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        pre { background: #f1f1f1; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 12px; }
    </style>
</head>
<body>
    <div class="report">
        <h1>🧪 文章工作流测试报告</h1>
        <p>生成时间: ${new Date().toLocaleString()}</p>
        
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
        </div>
        
        <div class="test-article">
            <h3>📝 测试文章信息</h3>
            <p><strong>标题:</strong> ${config.testArticle.title}</p>
            <p><strong>分类:</strong> ${config.testArticle.category}</p>
            <p><strong>标签:</strong> ${config.testArticle.tags.join(', ')}</p>
            <p><strong>作者:</strong> ${config.testArticle.author}</p>
        </div>
        
        <h2>详细测试结果</h2>
        ${testResults.map(result => `
            <div class="test-item test-${result.status}">
                <h4>${result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⚠️'} ${result.test}</h4>
                <p>${result.details || result.status}</p>
                ${result.data ? `<pre>${JSON.stringify(result.data, null, 2)}</pre>` : ''}
                <div class="timestamp">${result.timestamp}</div>
            </div>
        `).join('')}
        
        ${suggestions.length > 0 ? `
            <div class="suggestions">
                <h3>🔧 修复建议</h3>
                <ul>
                    ${suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        
        <h2>🚀 下一步操作</h2>
        <ul>
            <li>如果本地测试成功，访问 <a href="http://localhost:3002/zh">http://localhost:3002/zh</a> 查看效果</li>
            <li>检查文章是否在适当位置显示</li>
            <li>测试文章详情页面功能</li>
            <li>确认样式和布局正确</li>
            <li>准备部署到生产环境</li>
        </ul>
        
        <h2>📊 测试环境信息</h2>
        <ul>
            <li>本地开发环境: ${config.localUrl}</li>
            <li>生产环境: ${config.productionUrl}</li>
            <li>测试时间: ${new Date().toLocaleString()}</li>
        </ul>
    </div>
</body>
</html>
    `;
    
    return html;
}

// 主测试流程
async function runAllTests() {
    console.log('开始文章工作流测试...\n');
    
    // 1. 测试本地上传
    const uploadResult = await testLocalUpload();
    
    if (uploadResult) {
        // 2. 测试前端显示
        await testFrontendDisplay();
    }
    
    // 3. 测试生产环境
    await testProductionDisplay();
    
    // 4. 生成报告
    console.log('\n📊 测试结果统计');
    console.log('==================');
    
    const successCount = testResults.filter(r => r.status === 'success').length;
    const errorCount = testResults.filter(r => r.status === 'error').length;
    const warningCount = testResults.filter(r => r.status === 'warning').length;
    
    console.log(`✅ 成功: ${successCount} 项`);
    console.log(`❌ 失败: ${errorCount} 项`);
    console.log(`⚠️  警告: ${warningCount} 项`);
    
    // 5. 生成HTML报告
    const htmlReport = generateHtmlReport();
    fs.writeFileSync(path.join(__dirname, 'article-workflow-report.html'), htmlReport);
    console.log('\n📝 详细报告已生成: article-workflow-report.html');
    
    // 6. 提供修复建议
    const suggestions = generateFixSuggestions();
    if (suggestions.length > 0) {
        console.log('\n🔧 修复建议:');
        suggestions.forEach(suggestion => console.log(`- ${suggestion}`));
    }
    
    console.log('\n🎉 文章工作流测试完成！');
    
    return {
        success: successCount,
        error: errorCount,
        warning: warningCount,
        results: testResults
    };
}

// 运行测试
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    runAllTests,
    config,
    addResult
};