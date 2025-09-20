# 技术支持功能设置指南

## 问题描述

原来的技术支持页面显示的是"技术文章"而非"技术支持文章"，导致技术支持页面没有正确的内容显示。

## 解决方案

### 1. 架构改进

- **文章类型区分**: 在article schema中添加了`articleType`字段，明确区分技术文章和技术支持文章
- **技术支持分类**: 创建了专门的"technical-support"分类
- **页面修复**: 修改支持页面显示正确的技术支持文章

### 2. 设置步骤

#### 自动设置（推荐）

```bash
# 设置Sanity写入token（在.env.local中）
SANITY_TOKEN=your_sanity_token_with_write_permissions

# 运行完整设置脚本
node scripts/setup-technical-support.js
```

#### 手动设置

1. **创建技术支持分类**:
   ```bash
   node scripts/setup-technical-support-category.js
   ```

2. **创建示例技术支持文章**:
   ```bash
   node scripts/create-sample-support-articles.js
   ```

### 3. Sanity Studio配置

1. 访问 `/admin` 或运行 `npm run sanity:dev`
2. 检查"文章分类"中是否有"技术支持"分类
3. 查看示例技术支持文章是否创建成功
4. 根据需要编辑或创建更多技术支持文章

### 4. 验证设置

1. 启动开发服务器: `npm run dev`
2. 访问任意品牌的技术支持页面: `/zh-CN/brands/[品牌slug]/support`
3. 检查是否显示"技术支持文章"而非"技术文章"
4. 确认有技术支持文章显示或显示"暂无技术支持文章"的占位符

## 文件修改总结

### 新增文件
- `scripts/setup-technical-support-category.js` - 创建技术支持分类
- `scripts/create-sample-support-articles.js` - 创建示例技术支持文章
- `scripts/setup-technical-support.js` - 完整设置脚本

### 修改文件
- `sanity/schemas/article.ts` - 添加articleType字段
- `src/app/[locale]/brands/[slug]/support/page.tsx` - 修复支持页面显示
- `src/lib/sanity/brands.ts` - 增强getBrandSupportArticles函数

## 技术支持文章创建指南

在Sanity Studio中创建技术支持文章时：

1. **文章类型**: 选择"技术支持"
2. **分类**: 选择"技术支持"分类
3. **关联品牌**: 至少选择一个相关品牌
4. **发布状态**: 确保"是否发布"设置为true

## 故障排除

### 页面显示"暂无技术支持文章"

1. 检查Sanity中是否有技术支持文章
2. 确认文章的`isPublished`字段为true
3. 确认文章关联了正确的品牌
4. 检查文章的分类或articleType字段设置

### 脚本运行失败

1. 确认SANITY_TOKEN环境变量设置正确
2. 确认token有写入权限
3. 检查网络连接和Sanity服务状态

## 后续维护

- 定期检查技术支持文章的质量和时效性
- 根据用户反馈增加新的技术支持内容
- 保持文章的品牌关联关系准确