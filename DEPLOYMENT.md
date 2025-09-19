# 🚀 Cloudflare 自动部署配置

本文档说明如何使用新配置的GitHub Actions自动部署功能。

## 📋 配置要求

### 1. GitHub Secrets 配置

在GitHub仓库设置中，需要添加以下Secrets：

- `CLOUDFLARE_API_TOKEN`: Cloudflare API令牌
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare账户ID

### 2. Cloudflare Pages 项目设置

确保Cloudflare Pages项目配置：
- 项目名称：`litong-electronics`
- 构建输出目录：`out`
- 构建命令：使用GitHub Actions（无需在Cloudflare设置）

## 🔄 自动部署流程

### 触发条件

自动部署在以下情况触发：
- Push到`master`或`main`分支
- 创建Pull Request到主分支

### 部署步骤

1. **代码检出**: 获取最新代码
2. **环境设置**: 安装Node.js 20和依赖
3. **构建项目**:
   - 清理缓存
   - 设置生产环境变量
   - 执行`npm run build`
   - 验证构建输出
4. **部署到Cloudflare**: 自动推送到Cloudflare Pages

## 🛠️ 手动部署命令

```bash
# 检查部署准备情况
npm run deploy:check

# 构建预览版本
npm run deploy:preview

# 触发生产部署（提交并推送）
npm run deploy:production

# 手动触发部署
npm run deploy:trigger
```

## 📊 构建优化设置

GitHub Actions构建使用以下优化设置：
- `BUILD_STAGE=partial`: 平衡性能和覆盖率
- `EMERGENCY_BUILD=true`: 启用应急构建模式
- `NEXT_BUILD_LINT=false`: 跳过构建时lint检查
- `NEXT_TELEMETRY_DISABLED=1`: 禁用遥测

## 🔍 故障排除

### 部署失败

1. 检查GitHub Actions日志
2. 验证Cloudflare Secrets是否正确配置
3. 确认构建输出目录`out`存在
4. 检查Cloudflare Pages项目设置

### 构建错误

1. 本地运行`npm run deploy:check`
2. 检查TypeScript错误
3. 验证Sanity配置
4. 清理缓存：`npm run clear-cache`

## 📈 监控和日志

- **GitHub Actions**: 在仓库的Actions标签查看构建日志
- **Cloudflare Pages**: 在Cloudflare仪表板查看部署状态
- **网站状态**: 访问 https://litong.pages.dev 确认部署成功

## 🚀 快速开始

1. 配置GitHub Secrets（见上方要求）
2. 推送代码到主分支：
   ```bash
   git add .
   git commit -m "Enable auto-deployment"
   git push origin master
   ```
3. 在GitHub Actions中监控部署进度
4. 访问 https://litong.pages.dev 验证部署

现在每次代码更新都会自动触发部署！