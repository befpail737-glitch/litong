# LiTong Electronics - 电子元件代理网站

专业的电子元件代理网站，基于 Next.js 14 构建，支持多语言、SEO优化、产品筛选和后台管理。

## 功能特性

### 🌍 多语言支持
- 支持11种语言：中文、英语、日语、韩语、俄语、越南语、法语、德语、意大利语、土耳其语、阿拉伯语
- 使用 next-intl 实现国际化

### 🔍 SEO优化
- 静态URL结构，利于搜索引擎收录
- 面包屑导航
- Meta标签优化
- 结构化数据（JSON-LD Schema）
- 网站地图自动生成

### 📦 产品管理
- 产品多维度筛选（品牌、分类、封装、电压等）
- Excel批量导入产品数据
- 产品规格参数展示
- 现货库存管理

### 🏢 品牌管理
- 品牌中心页面
- 品牌产品分类
- 品牌解决方案展示
- 技术支持文档

### 📝 内容管理
- 技术支持文章系统（选型指南、应用笔记、问题排查、新品评测）
- 解决方案展示
- 新闻中心（公司新闻、行业动态）
- 内部链接优化
- 相关内容推荐

### 🛠️ 后台管理
- 简单的管理员认证（admin/123）
- 产品管理和Excel导入
- 文章编辑和发布
- 仪表板统计

### 📱 响应式设计
- 完美支持移动端浏览
- Tailwind CSS实现优雅界面
- 现代化设计风格

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **国际化**: next-intl
- **图标**: Heroicons + 自定义SVG
- **部署**: Cloudflare Pages

## 项目结构

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # 多语言路由
│   │   │   ├── page.tsx       # 首页
│   │   │   ├── brands/        # 品牌页面
│   │   │   ├── products/      # 产品页面
│   │   │   ├── about/         # 关于我们
│   │   │   └── admin/         # 后台管理
│   │   └── globals.css        # 全局样式
│   ├── components/            # 组件库
│   │   ├── layout/           # 布局组件
│   │   ├── home/             # 首页组件
│   │   ├── brands/           # 品牌相关组件
│   │   ├── products/         # 产品相关组件
│   │   ├── admin/            # 后台管理组件
│   │   └── ui/               # 基础UI组件
│   ├── lib/                  # 工具库
│   ├── types/                # TypeScript类型定义
│   └── i18n.ts              # 国际化配置
├── messages/                 # 多语言文件
├── public/                   # 静态资源
│   ├── icons/               # 图标文件
│   └── images/              # 图片资源
└── next.config.js           # Next.js配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看网站

### 构建生产版本

```bash
npm run build
```

### 类型检查

```bash
npm run type-check
```

### 代码规范检查

```bash
npm run lint
```

## 管理后台

访问 `/admin` 进入管理后台

- 用户名: `admin`
- 密码: `123`

功能包括：
- 产品管理（CRUD操作）
- Excel批量导入产品
- 文章管理（技术支持内容）
- 系统统计

## 产品Excel导入格式

Excel文件应包含以下列：

| 列名 | 说明 | 示例 |
|------|------|------|
| 产品名称 | 产品型号 | STM32F407VGT6 |
| 品牌 | 制造商名称 | STMicroelectronics |
| 产品分类 | 分类标识符 | microcontrollers |
| 产品小类 | 子分类 | ARM Cortex-M4 |
| 封装 | 封装类型 | LQFP100 |
| 描述 | 产品描述 | 32位ARM Cortex-M4微控制器 |
| 价格 | 单价 | 25.50 |
| 库存 | 现货数量 | 1000 |
| 规格书链接 | 数据手册URL | /datasheets/STM32F407VGT6.pdf |
| 参数1-5 | 技术参数 | 内核:ARM Cortex-M4 |

## SEO优化特性

### 页面结构
- 每个页面都有优化的Title、Description、Keywords
- 使用H1、H2、H3标签构建内容层次
- 面包屑导航提供清晰的页面路径

### 结构化数据
- Organization schema（公司信息）
- Product schema（产品信息）  
- Article schema（文章内容）
- BreadcrumbList schema（面包屑导航）

### 关键词优化
- 首页：电子元件核心代理、正品原装现货
- 产品页：产品分类 + 代理、现货
- 品牌页：品牌名 + 代理、现货
- 技术文章：长尾问题型关键词

### 内部链接
- 产品页面链接到相关技术文章
- 技术文章链接到相关产品规格书
- 解决方案页面链接到产品详情页
- "相关文章"和"相关产品"推荐模块

## 部署到Cloudflare Pages

1. 将代码推送到GitHub仓库
2. 连接Cloudflare Pages到GitHub仓库
3. 设置构建配置：
   - 构建命令: `npm run build`
   - 输出目录: `out`
4. 部署完成后访问分配的域名

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

力通电子 - LiTong Electronics

- 电话: +86 400-123-4567
- 邮箱: sales@litong.com
- 网站: https://www.litong-electronics.com

---

⚡ 专业电子元件代理，正品原装现货，值得信赖！