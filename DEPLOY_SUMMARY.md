# LiTong Electronics 部署总结

## 完成的配置

### ✅ 1. GitHub 仓库
- **仓库地址**: https://github.com/befpail737-glitch/litong.git
- **状态**: 已完成代码上传
- **分支**: master

### ✅ 2. Sanity CMS 配置
- **项目名**: litong
- **项目ID**: oquvb2bs
- **数据集**: production
- **域名**: www.elec-distributor.com
- **Studio访问**: www.elec-distributor.com/studio

### ✅ 3. Cloudflare Pages 部署配置
- **构建命令**: `npm run build:production`
- **输出目录**: `out`
- **Node.js版本**: 20
- **自定义域名**: www.elec-distributor.com

## 下一步操作

### Cloudflare Pages 部署步骤：

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 选择 "Pages" → "Create a project"

2. **连接 GitHub 仓库**
   - 选择 GitHub 连接
   - 选择仓库：`befpail737-glitch/litong`
   - 分支：`master`

3. **配置构建设置**
   ```
   Project name: litong-electronics
   Production branch: master
   Build command: npm run build:production
   Build output directory: out
   Root directory: /
   ```

4. **设置环境变量**
   ```
   NODE_VERSION=20
   NEXT_PUBLIC_SANITY_PROJECT_ID=oquvb2bs
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=<从Sanity管理面板获取>
   NEXT_PUBLIC_SITE_URL=https://www.elec-distributor.com
   ```

### Sanity CMS 配置步骤：

1. **访问 Sanity 管理面板**
   - https://manage.sanity.io/
   - 找到项目 ID: oquvb2bs

2. **生成 API Token**
   - 项目设置 → API → Tokens
   - 创建新 Token，权限：Editor
   - 复制 Token 到 Cloudflare Pages 环境变量

3. **配置 CORS**
   - 在 Sanity 项目设置中添加允许的域名：
   - `https://www.elec-distributor.com`
   - `https://*.pages.dev` (用于预览)

### 域名配置：

1. **DNS 设置**
   ```
   Type: CNAME
   Name: www
   Value: <cloudflare-pages-url>
   ```

2. **SSL/TLS**
   - 模式：Full (strict)
   - 自动 HTTPS 重写：开启

## 访问地址

部署完成后的访问地址：
- **主站**: https://www.elec-distributor.com
- **后台管理**: https://www.elec-distributor.com/zh/admin
- **Sanity Studio**: https://www.elec-distributor.com/studio

## 文件说明

- `next.config.production.js`: 生产环境配置（支持静态导出）
- `wrangler.toml`: Cloudflare Workers 配置
- `.github/workflows/deploy.yml`: 自动部署工作流
- `cloudflare-pages.json`: Pages 项目配置
- `DEPLOYMENT.md`: 详细部署文档

## 注意事项

1. 环境变量 `SANITY_API_TOKEN` 需要从 Sanity 后台生成
2. 域名 DNS 需要指向 Cloudflare
3. 首次部署后需要配置自定义域名
4. 开发环境使用常规配置，生产环境使用静态导出