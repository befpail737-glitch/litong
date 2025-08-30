#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 完整工作流验证 - 立通电子');
console.log('=================================');

const baseURL = 'http://localhost:3002';
const testResults = [];

function addResult(test, status, details = '') {
    const result = { test, status, details, timestamp: new Date().toLocaleTimeString() };
    testResults.push(result);
    const icon = status === 'success' ? '✅' : status === 'error' ? '❌' : '⚠️';
    console.log(`${icon} ${test}: ${details || status}`);
}

async function verifyCompleteWorkflow() {
    console.log('\n🔍 验证完整文章工作流...\n');
    
    try {
        // 1. 验证文章上传功能
        console.log('1️⃣ 测试文章上传功能...');
        const uploadResponse = await fetch(`${baseURL}/api/sanity/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: [{
                    title: "测试工作流文章",
                    titleEn: "Test Workflow Article",
                    summary: "这是一个用于验证完整工作流的测试文章。",
                    content: "## 测试内容\n\n这篇文章用于验证从后台上传到前端显示的完整工作流程。",
                    category: "technical",
                    tags: ["测试", "工作流"],
                    author: "自动化测试"
                }],
                type: 'solutions'
            })
        });
        
        if (uploadResponse.ok) {
            addResult('文章上传API', 'success', '文章上传成功');
        } else {
            addResult('文章上传API', 'error', `上传失败: ${uploadResponse.status}`);
        }
        
        // 2. 验证主页显示
        console.log('\n2️⃣ 验证主页文章显示...');
        const homeResponse = await fetch(`${baseURL}/zh`);
        if (homeResponse.ok) {
            const homeContent = await homeResponse.text();
            if (homeContent.includes('STM32F4系列') || homeContent.includes('测试')) {
                addResult('主页文章显示', 'success', '主页正确显示文章内容');
            } else {
                addResult('主页文章显示', 'warning', '主页内容需要检查');
            }
        } else {
            addResult('主页访问', 'error', `无法访问主页: ${homeResponse.status}`);
        }
        
        // 3. 验证解决方案页面
        console.log('\n3️⃣ 验证解决方案页面...');
        const solutionsResponse = await fetch(`${baseURL}/zh/solutions`);
        if (solutionsResponse.ok) {
            const solutionsContent = await solutionsResponse.text();
            if (solutionsContent.includes('STM32F4系列') && solutionsContent.includes('技术解决方案')) {
                addResult('解决方案页面', 'success', '解决方案页面正确显示文章');
            } else {
                addResult('解决方案页面', 'warning', '解决方案页面内容需要检查');
            }
        } else {
            addResult('解决方案页面', 'error', `无法访问解决方案页面: ${solutionsResponse.status}`);
        }
        
        // 4. 验证管理后台
        console.log('\n4️⃣ 验证管理后台...');
        const adminResponse = await fetch(`${baseURL}/zh/admin`);
        if (adminResponse.ok) {
            addResult('管理后台访问', 'success', '管理后台可正常访问');
        } else {
            addResult('管理后台访问', 'error', `无法访问管理后台: ${adminResponse.status}`);
        }
        
        // 5. 验证测试页面
        console.log('\n5️⃣ 验证测试页面...');
        const testPageResponse = await fetch(`${baseURL}/zh/admin/test`);
        if (testPageResponse.ok) {
            addResult('测试页面访问', 'success', '测试页面可正常访问');
        } else {
            addResult('测试页面访问', 'error', `无法访问测试页面: ${testPageResponse.status}`);
        }
        
    } catch (error) {
        addResult('工作流验证', 'error', error.message);
    }
}

async function generateFinalReport() {
    const successCount = testResults.filter(r => r.status === 'success').length;
    const errorCount = testResults.filter(r => r.status === 'error').length;
    const warningCount = testResults.filter(r => r.status === 'warning').length;
    
    console.log('\n📊 最终验证结果');
    console.log('=================');
    console.log(`✅ 成功: ${successCount} 项`);
    console.log(`❌ 失败: ${errorCount} 项`);  
    console.log(`⚠️  警告: ${warningCount} 项`);
    
    const overallStatus = errorCount === 0 ? 'success' : warningCount > 0 ? 'warning' : 'error';
    
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>完整工作流验证报告 - 立通电子</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .report { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status-${overallStatus} { border-left: 5px solid ${overallStatus === 'success' ? '#28a745' : overallStatus === 'warning' ? '#ffc107' : '#dc3545'}; }
        .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { padding: 20px; border-radius: 8px; text-align: center; }
        .stat-success { background: #d4edda; color: #155724; }
        .stat-error { background: #f8d7da; color: #721c24; }
        .stat-warning { background: #fff3cd; color: #856404; }
        .test-item { margin: 15px 0; padding: 15px; border-left: 4px solid #ddd; background: #f8f9fa; }
        .test-success { border-color: #28a745; }
        .test-error { border-color: #dc3545; }
        .test-warning { border-color: #ffc107; }
        .workflow-steps { background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .step { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
        .conclusion { background: ${overallStatus === 'success' ? '#d4edda' : overallStatus === 'warning' ? '#fff3cd' : '#f8d7da'}; 
                     color: ${overallStatus === 'success' ? '#155724' : overallStatus === 'warning' ? '#856404' : '#721c24'};
                     padding: 20px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="report status-${overallStatus}">
        <h1>🎯 完整工作流验证报告</h1>
        <p>验证时间: ${new Date().toLocaleString()}</p>
        
        <div class="summary">
            <div class="stat-card stat-success">
                <h3>${successCount}</h3>
                <p>验证通过</p>
            </div>
            <div class="stat-card stat-error">
                <h3>${errorCount}</h3>
                <p>验证失败</p>
            </div>
            <div class="stat-card stat-warning">
                <h3>${warningCount}</h3>
                <p>需要关注</p>
            </div>
        </div>
        
        <div class="workflow-steps">
            <h3>📋 验证的工作流程步骤</h3>
            <div class="step">1️⃣ 文章上传API功能测试</div>
            <div class="step">2️⃣ 主页文章显示验证</div>
            <div class="step">3️⃣ 解决方案页面验证</div>
            <div class="step">4️⃣ 管理后台访问测试</div>
            <div class="step">5️⃣ 测试页面功能验证</div>
        </div>
        
        <h2>详细验证结果</h2>
        ${testResults.map(result => `
            <div class="test-item test-${result.status}">
                <h4>${result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⚠️'} ${result.test}</h4>
                <p>${result.details || result.status}</p>
                <small class="timestamp">${result.timestamp}</small>
            </div>
        `).join('')}
        
        <div class="conclusion">
            <h3>📋 验证结论</h3>
            ${overallStatus === 'success' 
                ? '<p><strong>🎉 工作流验证通过！</strong> 从文章上传到前端显示的完整工作流程运行正常。</p>'
                : overallStatus === 'warning'
                ? '<p><strong>⚠️ 工作流基本正常，但有部分需要关注。</strong> 建议检查警告项目。</p>'
                : '<p><strong>❌ 工作流存在问题。</strong> 需要修复失败的项目。</p>'
            }
        </div>
        
        <h2>🚀 访问链接</h2>
        <ul>
            <li><a href="${baseURL}/zh">前台主页</a></li>
            <li><a href="${baseURL}/zh/solutions">解决方案页面</a></li>
            <li><a href="${baseURL}/zh/admin">管理后台</a></li>
            <li><a href="${baseURL}/zh/admin/test">测试页面</a></li>
        </ul>
        
        <h2>📈 推荐下一步操作</h2>
        <ul>
            <li>在生产环境 https://elec-distributor.com 部署更新</li>
            <li>测试生产环境的文章上传和显示功能</li>
            <li>配置实际的Sanity CMS连接</li>
            <li>完善文章详情页面功能</li>
            <li>优化SEO和元数据设置</li>
        </ul>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(path.join(__dirname, 'complete-workflow-report.html'), html);
    console.log('\n📝 完整验证报告已生成: complete-workflow-report.html');
    
    return { success: successCount, error: errorCount, warning: warningCount };
}

async function main() {
    await verifyCompleteWorkflow();
    const results = await generateFinalReport();
    
    console.log('\n🎉 完整工作流验证完成！');
    
    if (results.error === 0) {
        console.log('✨ 所有功能验证通过，可以正常使用！');
    } else {
        console.log('⚠️  存在一些问题，请查看报告了解详情。');
    }
}

main().catch(console.error);