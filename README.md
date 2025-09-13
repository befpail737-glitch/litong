# 力通电子官方网站

专业的电子元器件分销商网站，基于 Next.js + TypeScript + Tailwind CSS 开发。

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git >= 2.30.0

### 开发环境配置
```bash
# 克隆项目
git clone <repository-url>
cd litong-electronics-website

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 📁 项目结构

```
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── layout.tsx      # 根布局组件
│   │   ├── page.tsx        # 首页
│   │   └── globals.css     # 全局样式
│   ├── components/         # React组件
│   │   └── ui/            # 基础UI组件
│   ├── lib/               # 工具库
│   │   └── utils.ts       # 通用工具函数
│   └── types/             # TypeScript类型定义
│       └── global.d.ts    # 全局类型
├── public/                # 静态资源
├── scripts/              # 构建和开发脚本
└── docs/                 # 项目文档
```

## 🛠 可用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build           # 生产构建
npm run start           # 启动生产服务器

# 代码质量
npm run lint            # ESLint检查
npm run lint:fix        # 自动修复ESLint问题
npm run format          # Prettier格式化
npm run typecheck       # TypeScript检查

# 开发工具
npm run setup:dev       # 自动配置开发环境
```

## 🏗️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: Radix UI
- **代码规范**: ESLint + Prettier
- **字体**: Inter, Poppins

## 📝 开发状态

🚧 项目正在开发中... (更新: 品牌页面已优化)

### 当前进度
- ✅ 基础架构搭建
- ✅ TypeScript配置
- ✅ Tailwind CSS配置
- ✅ 基础页面结构
- 🔄 UI组件库开发中
- ⏳ Sanity CMS集成
- ⏳ 产品目录功能
- ⏳ 多语言支持

## 🤝 贡献

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。

## 📞 联系我们

力通电子团队 - [联系邮箱]

项目链接: [项目仓库地址]