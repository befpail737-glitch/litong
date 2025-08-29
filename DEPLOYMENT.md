# LiTong Electronics 部署指南

## Sanity CMS 配置

### 项目信息
- 项目名：litong
- 项目ID：oquvb2bs
- 数据集：production
- 域名：www.elec-distributor.com

### Sanity 配置步骤

1. **访问 Sanity 管理面板**
   ```
   https://manage.sanity.io/
   ```

2. **创建 API Token**
   - 登录 Sanity 管理面板
   - 进入项目设置 → API → Tokens
   - 创建新的 Token，权限设置为 Editor
   - 复制生成的 Token

3. **配置环境变量**
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=oquvb2bs
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=<your-sanity-api-token>
   NEXT_PUBLIC_SITE_URL=https://www.elec-distributor.com
   ```

4. **访问 Sanity Studio**
   ```
   https://www.elec-distributor.com/studio
   ```

## Cloudflare Pages 部署

### 方式一：通过 Cloudflare Dashboard

1. **登录 Cloudflare Dashboard**
   ```
   https://dash.cloudflare.com/
   ```

2. **创建 Pages 项目**
   - 选择 "Pages" → "Create a project"
   - 连接到 GitHub 仓库：`https://github.com/befpail737-glitch/litong.git`
   - 选择分支：`master`

3. **配置构建设置**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `/`
   - Node.js version: `18`

4. **设置环境变量**
   在 Cloudflare Pages 项目设置中添加：
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=oquvb2bs
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=<your-sanity-api-token>
   NEXT_PUBLIC_SITE_URL=https://www.elec-distributor.com
   ```

5. **配置自定义域名**
   - 在项目设置中添加自定义域名：`www.elec-distributor.com`
   - 在域名 DNS 设置中添加 CNAME 记录指向 Cloudflare Pages

### 方式二：通过 GitHub Actions

1. **设置 GitHub Secrets**
   在 GitHub 仓库设置 → Secrets and variables → Actions 中添加：
   ```
   CLOUDFLARE_API_TOKEN=<your-cloudflare-api-token>
   CLOUDFLARE_ACCOUNT_ID=<your-cloudflare-account-id>
   NEXT_PUBLIC_SANITY_PROJECT_ID=oquvb2bs
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=<your-sanity-api-token>
   NEXT_PUBLIC_SITE_URL=https://www.elec-distributor.com
   ```

2. **自动部署**
   推送代码到 `master` 分支会自动触发部署

### 方式三：使用 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **部署项目**
   ```bash
   wrangler pages deploy out --project-name=litong-electronics
   ```

## 域名配置

### DNS 设置
为域名 `elec-distributor.com` 添加以下 DNS 记录：

```
Type: CNAME
Name: www
Value: <cloudflare-pages-url>
TTL: Auto
```

### SSL/TLS 配置
- Cloudflare 自动提供 SSL 证书
- 确保 SSL/TLS 模式设置为 "Full" 或 "Full (strict)"

## 监控和维护

### 访问地址
- 生产环境：https://www.elec-distributor.com
- Sanity Studio：https://www.elec-distributor.com/studio
- 后台管理：https://www.elec-distributor.com/zh/admin

### 日志监控
- Cloudflare Pages 构建日志
- Sanity CMS 操作日志
- 应用程序错误日志

## 故障排除

### 常见问题
1. **构建失败**：检查环境变量是否正确设置
2. **Sanity 连接失败**：确认 API Token 权限
3. **域名无法访问**：检查 DNS 配置和 SSL 设置

### 联系支持
- Cloudflare Support
- Sanity Support
- GitHub Issues: https://github.com/befpail737-glitch/litong/issues