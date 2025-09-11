# 产品需求文档 (PRD) - 电子元件代理网站

## 项目概述

### 项目名称
力通电子元件代理网站 (LiTong Electronic Components Distributor)

### 项目背景
构建一个专业的电子元件代理商网站，提供全面的产品信息、技术支持和解决方案服务。

### 技术栈
- 前端框架：Next.js 20 (App Router) + TypeScript
- 样式框架：Tailwind CSS
- CMS：Sanity.io
- 部署：Cloudflare Pages/Workers
- 多语言：支持11种语言（中文、英语、日语、韩语、俄语、越南语、法语、德语、意大利语、土耳其语、阿拉伯语）

### 项目目标
1. 建立权威专业的电子元件代理商形象
2. 优化SEO，提升搜索引擎排名
3. 提供完整的产品和技术支持体系
4. 构建强大的内容管理系统

## 网站架构设计

### 一级导航结构
```
├── 首页 (Homepage) - /
├── 品牌列表 (Brands) - /brands
├── 产品列表 (Products) - /products  
└── 关于我们 (About Us) - /about
```

### 二级导航结构（品牌中心页）
```
/brands/{brand-name}/
├── 关于品牌 - /brands/{brand-name}/about
├── 产品分类 - /brands/{brand-name}/categories
├── 解决方案 - /brands/{brand-name}/solutions
├── 技术支持 - /brands/{brand-name}/support
└── 新闻中心 - /brands/{brand-name}/news
```

### URL结构设计
- 静态URL结构
- SEO友好的路径命名
- 面包屑导航支持
- 自动生成网站地图

### 详细URL路径规划
```
首页: /
品牌列表: /brands
品牌中心: /brands/{brand-slug}
  - 关于品牌: /brands/{brand-slug}/about
  - 产品分类: /brands/{brand-slug}/categories
  - 产品分类详情: /brands/{brand-slug}/categories/{category-slug}
  - 解决方案列表: /brands/{brand-slug}/solutions
  - 解决方案详情: /brands/{brand-slug}/solutions/{solution-slug}
  - 技术支持列表: /brands/{brand-slug}/support
  - 技术支持详情: /brands/{brand-slug}/support/{article-slug}
  - 新闻中心: /brands/{brand-slug}/news
  - 公司新闻详情: /brands/{brand-slug}/news/company/{news-slug}
  - 行业动态详情: /brands/{brand-slug}/news/industry/{news-slug}

产品列表: /products
产品大类: /products/{category-slug}
产品小类: /products/{category-slug}/{subcategory-slug}
产品详情: /products/{category-slug}/{subcategory-slug}/{product-slug}

关于我们: /about
  - 公司简介: /about/company
  - 发展历程: /about/history  
  - 公司优势: /about/advantages
  - 客户案例: /about/cases
  - 联系我们: /about/contact
```

## 页面功能需求

### 1. 首页 (Homepage)

#### 核心模块
1. **英雄横幅 (Hero Banner)**
   - 强冲击力文案
   - 核心价值主张展示
   - 主要行动号召按钮

2. **核心优势 (Why Choose Us)**
   - 电子元件代理核心竞争力
   - 库存深度、技术支持、物流能力
   - 数字证书追踪和权威性展示

3. **核心产品领域 (Core Product Areas)**
   - 按类别展示产品
   - 引导用户深入了解
   - 内链优化

4. **解决方案与应用领域 (Solutions & Applications)**
   - 针对目标行业的解决方案展示
   - 长尾关键词优化
   - 专业客户吸引

5. **最新动态 (Latest News)**
   - 公司活力展示
   - 首页内容更新
   - 行业动态整合

6. **最终行动号召 (Final CTA)**
   - 页面底部引导联系
   - 多渠道联系方式

#### SEO优化要求
- **Title**: `<title>电子元件核心代理 | 提供正品原装现货 | LiTong</title>`
- **Description**: 力通是电子元件核心代理，长期稳定供应提供正品原装现货。并提供技术支持和优势价格，欢迎咨询。
- **Keywords**: LiTong,电子元件代理,电子元件现货

### 2. 品牌列表页 (/brands)

#### 功能需求
- 品牌展示网格布局
- 每个品牌卡片包含：
  - 品牌Logo
  - 品牌简介
  - 核心产品类别
  - 进入品牌中心按钮

### 3. 品牌中心页 (/brands/{brand-name})

#### 关于品牌页面
- 品牌历史和介绍
- 品牌优势和特色
- 合作关系说明

#### 产品分类页面
- 分类列表展示
- 每个分类特性介绍
- PDF文档上传支持
- 产品筛选表格页

#### 解决方案页面
**内容结构要求：**
- 独立URL：`/brands/{brand-name}/solutions/{solution-id}`
- H2/H3标签结构化内容
- 必需模块：
  - 方案框图
  - 核心优势
  - 推荐物料清单 (BOM List)
  - 应用场景

**SEO优化：**
- 页面标题：行业 + 解决方案
- 每个解决方案摘要（500字以上）
- 图文并茂，alt属性优化
- 物料清单内链到产品详情页

#### 技术支持页面
**内容分类：**
- 选型指南
- 应用笔记  
- 问题排查
- 新品评测

**功能特性：**
- 标签系统 (Tags)
- 上下文链接 (产品型号链接到规格书)
- 相关文章推荐
- 作者简介系统（FAE工程师）

#### 新闻中心页面
**分类管理：**
- 公司新闻 - 独立管理
- 行业动态 - 热点关键词优化

**内容要求：**
- 每篇文章500字以上
- 权威来源引用
- 独立详情页
- 深度分析和解读

### 4. 产品列表页 (/products)

#### 层级结构
- 产品大类列表页 (`/products`)
- 产品大类详情页 (`/products/{category-slug}`)
- 产品小类详情页 (`/products/{category-slug}/{subcategory-slug}`)
- 产品详情页 (`/products/{category-slug}/{subcategory-slug}/{product-slug}`)

#### 产品大类列表页功能
- 展示所有产品大类
- 每个大类显示产品数量
- 大类特性简介
- SVG图标展示

#### 产品筛选表格页功能
- 多维度筛选（品牌、价格、规格、封装等）
- 实时搜索功能
- 库存状态显示（现货/期货/缺货）
- 数据表格展示（型号、规格、价格、库存）
- 批量询价功能
- 导出功能（PDF/Excel）

#### 产品详情页功能
- 产品基本信息（型号、品牌、描述）
- 技术规格表
- 价格和库存信息
- 数字证书和报关单
- 规格书PDF下载
- 相关产品推荐
- 应用案例链接
- 技术支持文章链接

### 5. 关于我们页 (/about)

#### 核心内容模块
1. **公司简介**
   - 发展历程时间线
   - 核心团队介绍

2. **数字证书追踪**
   - 产品溯源系统
   - 报关单展示
   - 权威性证明

3. **公司优势**
   - 库存深度
   - 技术支持团队
   - 物流配送能力

4. **客户案例**
   - 成功案例展示
   - 行业应用实例

5. **联系我们**
   - 多渠道联系方式
   - 地理位置信息
   - 在线咨询功能

## CMS系统需求 (Sanity.io)

### 项目配置
- 项目名：litong
- 项目ID：oquvb2bs  
- 数据集：production
- Sanity Token：skcH3gNsfBNrrk7DlrAqF7ocB0o4QagJoWWQGRhXvZYyh1ULE0ef96EBqZ2kRWCnH6YnRDTo7bUBJn0dpjjLuZIz8S4wkpo0Sb9AXLxfO1Y6gG4agwbw60hskt6aIW1arCcAeM44oS6iZdUQ9jNcWEnOaEIhSYQRynnwKoI5oSixuHwYy9gk
- 域名：www.elec-distributor.com
- Studio URL：litong.sanity.studio

### 后台管理功能
- 管理员账号：admin / 123
- 管理界面：/admin
- 支持内容类型：
  - 品牌管理（Brand）
  - 产品管理（Product）- 大类/小类层级
  - 文章管理（Article）- 技术支持文章
  - 解决方案管理（Solution）
  - 新闻管理（News）- 公司新闻/行业动态
  - 作者管理（Author）- FAE工程师信息
  - 标签管理（Tag）- 文章标签系统

### Sanity Schema定义

#### Brand Schema
```javascript
{
  name: 'brand',
  title: 'Brand',
  type: 'document',
  fields: [
    {name: 'name', type: 'string', title: 'Brand Name'},
    {name: 'slug', type: 'slug', title: 'Slug'},
    {name: 'logo', type: 'image', title: 'Logo'},
    {name: 'description', type: 'text', title: 'Description'},
    {name: 'website', type: 'url', title: 'Official Website'},
    {name: 'products', type: 'array', of: [{type: 'reference', to: {type: 'productCategory'}}]}
  ]
}
```

#### Product Schema
```javascript
{
  name: 'product',
  title: 'Product', 
  type: 'document',
  fields: [
    {name: 'partNumber', type: 'string', title: 'Part Number'},
    {name: 'slug', type: 'slug', title: 'Slug'},
    {name: 'brand', type: 'reference', to: {type: 'brand'}, title: 'Brand'},
    {name: 'category', type: 'reference', to: {type: 'productCategory'}},
    {name: 'subcategory', type: 'reference', to: {type: 'productSubcategory'}},
    {name: 'description', type: 'text', title: 'Description'},
    {name: 'specifications', type: 'array', of: [{type: 'object', fields: [
      {name: 'parameter', type: 'string'},
      {name: 'value', type: 'string'},
      {name: 'unit', type: 'string'}
    ]}]},
    {name: 'price', type: 'number', title: 'Price'},
    {name: 'stock', type: 'number', title: 'Stock Quantity'},
    {name: 'stockStatus', type: 'string', options: {list: ['现货', '期货', '缺货']}},
    {name: 'datasheet', type: 'file', title: 'Datasheet PDF'},
    {name: 'certificate', type: 'file', title: 'Certificate'},
    {name: 'customsDocument', type: 'file', title: 'Customs Document'}
  ]
}
```

#### Article Schema (技术支持)
```javascript
{
  name: 'article',
  title: 'Technical Article',
  type: 'document',
  fields: [
    {name: 'title', type: 'string', title: 'Title'},
    {name: 'slug', type: 'slug', title: 'Slug'},
    {name: 'category', type: 'string', options: {list: ['选型指南', '应用笔记', '问题排查', '新品评测']}},
    {name: 'author', type: 'reference', to: {type: 'author'}},
    {name: 'tags', type: 'array', of: [{type: 'reference', to: {type: 'tag'}}]},
    {name: 'content', type: 'array', of: [
      {type: 'block'},
      {type: 'image'},
      {type: 'file'},
      {type: 'table'}
    ]},
    {name: 'relatedProducts', type: 'array', of: [{type: 'reference', to: {type: 'product'}}]},
    {name: 'publishedAt', type: 'datetime'}
  ]
}
```

### 编辑器功能
- 富文本编辑器（Portable Text）
- 图片上传和管理
- PDF文件上传和管理
- 表格插入和编辑
- 超链接管理
- 格式化工具（加粗、斜体、标题等）
- 代码块插入
- 内容块重排序
- 草稿和发布状态管理

## SEO优化策略

### 关键词布局策略
- **品牌中心页**：品牌词优化
- **产品分类页**：产品分类关键词
- **解决方案页**：应用领域 + 解决方案
- **技术文章**：长尾问题型关键词

### 长尾关键词策略
- 品牌词 + 产品
- 品牌词 + 代理
- 行业术语 + 解决方案
- 技术问题 + 指南

### Meta标签优化
- 所有页面自定义Title/Description
- 图片alt属性优化
- Schema.org结构化数据
- Organization/Corporation标记

### 内链策略
1. **技术文章内链**
   - 产品型号链接到规格书
   - 概念链接到相关文章
   - 相关文章自动推荐

2. **产品页内链**
   - 关联应用笔记
   - 相关解决方案文章
   - 同类产品推荐

3. **解决方案内链**
   - BOM清单链接到产品页
   - 技术文档交叉引用

## 用户体验设计

### 响应式设计
- 移动端优先设计
- 平板设备适配
- 桌面端优化

### 页面性能
- SSG静态生成优先
- 图片懒加载
- CDN加速
- 核心Web指标优化

### 交互设计
- 面包屑导航
- 搜索功能
- 筛选排序
- 分页机制

## 内容质量标准

### E-E-A-T原则
- **Experience (经验)**：实际应用案例
- **Expertise (专业性)**：技术深度内容  
- **Authoritativeness (权威性)**：作者认证系统
- **Trustworthiness (可信度)**：证书追踪系统

### 内容创作要求
1. **深度要求**
   - 每篇文章最少500字
   - 解决实际问题
   - 提供独特见解

2. **质量控制**
   - 避免关键词堆砌
   - 人工校对润色
   - 定期内容更新

3. **多媒体整合**
   - 技术图表
   - 产品图片
   - 方案框图
   - 视频演示

## 技术实现规范

### 开发规范
- TypeScript严格模式
- ESLint/Prettier代码规范
- 组件化开发
- 单元测试覆盖

### 性能优化
- 图片格式优化 (WebP/AVIF)
- 代码分割
- 预加载策略
- 缓存策略

### 安全要求
- HTTPS加密
- XSS防护
- CSRF防护
- 内容安全策略

## 视觉设计要求

### SVG图标系统
1. **产品类别图标**
   - 统一风格设计
   - 矢量格式
   - 可缩放

2. **页面装饰图标**
   - 新闻页插图
   - 关于我们封面
   - 联系我们图标

3. **抽象背景图**
   - 科技感电路纹理
   - 横幅背景图案
   - 行业特色设计

4. **企业Logo**
   - SVG格式
   - 多尺寸适配
   - 品牌一致性

### 色彩方案
- 主色调：专业蓝色系 (#1E40AF, #3B82F6)
- 辅助色：科技灰色系 (#64748B, #94A3B8)
- 强调色：橙色系 (#F59E0B, #EAB308)
- 成功色：绿色系 (#10B981, #059669)
- 警告色：红色系 (#EF4444, #DC2626)
- 背景色：中性色 (#F8FAFC, #FFFFFF, #F1F5F9)

### 图片素材需求
#### 产品类别图标 (需要设计的SVG图标)
- 集成电路芯片图标 (ic-chip.svg)
- 电阻器图标 (resistor.svg)
- 电容器图标 (capacitor.svg)
- 二极管图标 (diode.svg)
- 三极管图标 (transistor.svg)
- 连接器图标 (connector.svg)
- 传感器图标 (sensor.svg)
- 电源管理图标 (power-management.svg)

#### 页面装饰图标
- 新闻页面封面 (news-hero.svg)
- 关于我们横幅 (about-hero.svg)
- 联系我们图标集 (contact-icons.svg)
- 技术支持图标 (tech-support.svg)
- 解决方案框图模板 (solution-diagram.svg)

#### 抽象背景图
- 电路板纹理背景 (circuit-bg.svg)
- 科技线条背景 (tech-lines-bg.svg)
- 芯片网格背景 (chip-grid-bg.svg)
- 横幅科技背景 (hero-tech-bg.svg)

## 国际化需求

### 多语言支持
支持11种语言：
- 中文（简体）
- English
- 日本語  
- 한국어
- Русский
- Tiếng Việt
- Français
- Deutsch
- Italiano
- Türkçe
- العربية

### 本地化策略
- URL路径本地化
- 内容完整翻译
- 文化适应性调整
- 本地SEO优化

## 部署和运维

### 部署策略
- Cloudflare Pages自动部署
- GitHub Actions CI/CD
- 环境变量管理
- SSL证书自动更新

### 监控和维护
- 性能监控
- 错误日志追踪
- SEO数据分析
- 用户行为分析

## 页脚设计规范

### 页脚内容要求
根据需求，页脚必须在全站范围内重复强调核心身份，增加关键词密度：

```html
<footer>
  <div class="footer-main">
    <div class="company-info">
      <h3>力通电子 - 电子元件代理专家</h3>
      <p>专业电子元件代理商，提供正品原装芯片现货，覆盖全球知名品牌</p>
    </div>
    
    <div class="quick-links">
      <h4>快速链接</h4>
      <ul>
        <li><a href="/brands">品牌中心</a></li>
        <li><a href="/products">产品分类</a></li>
        <li><a href="/about">电子元件代理服务</a></li>
      </ul>
    </div>
    
    <div class="services">
      <h4>核心服务</h4>
      <ul>
        <li>芯片现货供应</li>
        <li>电子元件代理</li>
        <li>技术支持服务</li>
        <li>BOM配单服务</li>
      </ul>
    </div>
    
    <div class="contact">
      <h4>联系我们</h4>
      <p>专业电子元件代理，期待为您服务</p>
    </div>
  </div>
  
  <div class="footer-bottom">
    <p>&copy; 2024 力通电子 - 值得信赖的电子元件代理商</p>
    <p>Schema.org/Corporation markup here</p>
  </div>
</footer>
```

## 功能补充需求

### 搜索功能详细规范
1. **全局搜索**
   - 产品型号搜索
   - 品牌名称搜索  
   - 技术文章搜索
   - 实时搜索建议

2. **高级筛选**
   - 产品参数筛选
   - 价格区间筛选
   - 库存状态筛选
   - 品牌多选筛选

### 用户询价系统
1. **单个产品询价**
   - 产品详情页询价按钮
   - 询价表单（数量、交期需求）
   - 自动生成询价编号

2. **批量询价功能**
   - BOM表格上传（Excel/CSV）
   - 批量产品选择
   - 一键生成询价单

### 下载中心功能
- 产品规格书批量下载
- 解决方案PDF下载
- 公司资质证书下载
- 产品选型指南下载

## 项目里程碑

### 第一阶段（基础框架 - 2周）
- [ ] Next.js 20 + TypeScript项目初始化
- [ ] Tailwind CSS配置和基础样式
- [ ] Sanity CMS配置和Schema定义
- [ ] 基础页面结构和路由设置
- [ ] 响应式布局框架
- [ ] GitHub仓库连接

### 第二阶段（核心功能 - 3周）
- [ ] 首页设计和开发
- [ ] 品牌管理系统开发
- [ ] 产品管理系统（大类/小类/详情页）
- [ ] 品牌中心页面开发
- [ ] 基础CMS内容录入功能
- [ ] SEO基础优化（Meta标签、结构化数据）

### 第三阶段（内容和功能完善 - 3周）
- [ ] 技术支持系统（文章管理、标签、作者）
- [ ] 解决方案管理系统
- [ ] 新闻中心系统
- [ ] 搜索和筛选功能
- [ ] 询价系统开发
- [ ] 内链系统实现

### 第四阶段（高级功能 - 2周）
- [ ] 多语言支持实现（11种语言）
- [ ] 高级SEO优化（Schema标记、网站地图）
- [ ] 性能优化（图片优化、代码分割）
- [ ] SVG图标系统设计和实现

### 第五阶段（测试和部署 - 1周）
- [ ] 功能测试和调试
- [ ] Cloudflare Pages部署配置
- [ ] 域名绑定和SSL配置
- [ ] 性能测试和优化

### 第六阶段（内容填充和上线 - 2周）
- [ ] 示例品牌和产品数据导入
- [ ] 技术文章内容创作
- [ ] 解决方案案例编写
- [ ] SEO检查和最终优化
- [ ] 正式上线发布

## 成功指标

### SEO指标
- 核心关键词排名Top 10
- 自然搜索流量增长50%
- 页面收录率达90%以上

### 用户体验指标  
- Core Web Vitals全绿
- 移动端友好性100分
- 页面加载时间<3秒

### 业务指标
- 询盘转化率提升30%
- 用户停留时间增长40%
- 页面浏览深度增加50%

## 遗漏问题补充

### 1. 首页H1标签优化
**要求**: 首页必须有明确的H1标签，包含核心关键词
**建议内容**: `<h1>电子元件代理专家 | 芯片现货供应商 - 力通电子</h1>`

### 2. 分销商行动号召 (CTA) 要求
根据需求，必须在以下页面结尾加入"分销商"CTA：
- 产品详情页
- 选型指南页  
- 技术文章页

**CTA内容**:
```html
<div class="distributor-cta">
  <h3>寻找可靠的电子元件代理商？</h3>
  <p>力通电子作为专业的电子元件代理商，为您提供原装正品芯片现货和专业技术支持</p>
  <button>立即联系我们</button>
</div>
```

### 3. 解决方案发布要求
**必须发布3个解决方案**，建议行业方向：
1. 工业控制解决方案
2. 汽车电子解决方案  
3. 消费电子解决方案

### 4. 网站结构化数据标记
**Organization Schema示例**:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization", 
  "name": "力通电子",
  "alternateName": "LiTong Electronics",
  "url": "https://www.elec-distributor.com",
  "logo": "https://www.elec-distributor.com/logo.svg",
  "description": "专业电子元件代理商，提供正品原装芯片现货",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CN"
  },
  "sameAs": []
}
```

### 5. 缺失的页面模板
需要补充的页面模板：
- **404错误页面** - 包含搜索功能和热门产品推荐
- **搜索结果页面** - 统一的搜索结果展示
- **标签聚合页面** - 技术文章标签聚合页
- **作者介绍页面** - FAE工程师个人页面

### 6. 面包屑导航详细规范
所有页面必须包含面包屑导航：
```html
首页 > 品牌中心 > [品牌名] > [具体页面]
首页 > 产品分类 > [大类] > [小类] > [产品型号]
首页 > 关于我们 > [子页面]
```

### 7. 移动端特殊优化
- 产品筛选页面移动端侧边栏
- 触摸友好的表格交互
- 移动端搜索体验优化
- 移动端询价表单优化

### 8. GitHub仓库信息
**仓库地址**: https://github.com/befpail737-glitch/litong.git
**部署分支**: main
**开发分支**: develop

---

**文档版本**: v1.1  
**创建日期**: 2025-09-06  
**最后更新**: 2025-09-06  
**负责人**: 产品开发团队  
**审核状态**: 已补充完善，待最终审核

## PRD完整性检查清单

### ✅ 已覆盖需求
- [x] 网站目录结构完整定义
- [x] SEO优化策略详细规划
- [x] 首页6大模块设计
- [x] 品牌中心页面功能规范
- [x] 产品管理系统设计
- [x] 技术支持系统规范
- [x] 解决方案页面要求
- [x] 新闻中心分类管理
- [x] CMS系统详细配置
- [x] 多语言支持方案
- [x] 响应式设计要求
- [x] SVG图标系统设计
- [x] 内链策略规划
- [x] 页脚SEO优化
- [x] 项目里程碑规划
- [x] 技术栈和部署方案

### ✅ 新增补充内容
- [x] 详细URL路径规划
- [x] 产品筛选功能详述
- [x] Sanity Schema定义
- [x] 图片素材清单
- [x] 搜索功能规范
- [x] 询价系统设计
- [x] 分销商CTA要求
- [x] 结构化数据标记
- [x] 移动端优化细节