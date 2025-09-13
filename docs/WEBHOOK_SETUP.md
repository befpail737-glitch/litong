# Sanity Webhook 自动部署配置指南

## 问题背景

**根本问题**: 项目使用静态导出(`output: 'export'`)，品牌数据在构建时"烘焙"到HTML中，后台添加新品牌不会自动触发重新构建。

**解决方案**: 配置Sanity Webhook自动触发Cloudflare Pages重新构建。

## 配置步骤

### 1. 获取Cloudflare Pages构建触发URL

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Pages → `litong` 项目
3. 选择 `Settings` → `Builds & deployments`
4. 找到 `Deploy hooks` 部分
5. 点击 `Create deploy hook`
6. 命名为: `Sanity Brand Update`
7. 复制生成的Webhook URL (格式如: `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/xxx`)

### 2. 配置Sanity项目Webhook

1. 登录 [Sanity Management](https://www.sanity.io/manage/)
2. 选择项目 `oquvb2bs`
3. 进入 `API` → `Webhooks`
4. 点击 `Create webhook`
5. 配置以下信息:
   - **Name**: `Cloudflare Pages Auto Deploy`
   - **URL**: 粘贴步骤1中的Webhook URL
   - **Trigger on**: `Create`, `Update`, `Delete`
   - **Filter**: `_type in ["brandBasic", "product", "article", "solution"]` (针对所有内容变更)
   - **HTTP method**: `POST`
   - **HTTP headers**: 
     ```
     Content-Type: application/json
     ```

### 3. 高级配置 (可选)

如果需要更精细的控制，可以添加条件过滤:

```groq
_type in ["brandBasic", "product", "solution", "article"] && (
  _rev != _originalRev || 
  defined(_originalRev) == false ||
  wasDeleted() == true
)
```

### 4. 测试Webhook

1. 在Sanity Studio中添加/修改任何内容（品牌/产品/文章/方案）
2. 检查Cloudflare Pages是否自动开始构建
3. 构建完成后验证生产环境是否反映变更

## 工作原理

```
[Sanity CMS] ---(任何内容变更)---> [Webhook触发] 
     ↓
[Cloudflare Pages] ---(自动构建)---> [更新生产环境]
     ↓
[用户访问] ---(看到最新内容)---> [问题解决]
```

## 预期效果

- ✅ 后台添加任何内容后2-5分钟自动部署
- ✅ 保持静态站点高性能优势
- ✅ 无需手动触发重新构建
- ✅ SEO和缓存优化不受影响

## 故障排除

### Webhook不触发
1. 检查Sanity Webhook配置是否正确
2. 验证Cloudflare Deploy Hook URL是否有效
3. 查看Sanity Webhook日志

### 构建失败
1. 检查代码是否有语法错误
2. 验证Sanity查询是否返回有效数据
3. 查看Cloudflare Pages构建日志

## 备注

- Webhook响应时间通常为1-2分钟
- 建议在测试环境先验证配置
- 可以设置Slack/邮件通知构建状态

## 联系支持

如遇问题，请提供:
- Sanity项目ID: `oquvb2bs`
- Webhook配置截图
- 构建错误日志