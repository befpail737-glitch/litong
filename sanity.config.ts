import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'litong-electronics',
  title: '力通电子管理系统',

  projectId: 'oquvb2bs',
  dataset: 'production',

  basePath: '/studio',

  // 启用调试和监控
  useCdn: false, // 生产环境中获取最新数据
  perspective: 'published', // 只显示已发布的内容
  
  // CORS配置，允许本地开发服务器和生产环境访问
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://litong.pages.dev',
      'https://litong.sanity.studio'
    ]
  },
  
  plugins: [
    structureTool(), // 使用默认结构
    visionTool({
      defaultApiVersion: '2023-05-03',
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  // Studio 工具配置
  tools: (prev) => {
    // 在控制台显示项目信息和调试信息
    if (typeof window !== 'undefined') {
      console.log('🎨 Sanity Studio 正在加载...', {
        projectId: 'oquvb2bs',
        dataset: 'production',
        basePath: '/studio',
        hostname: window.location.hostname,
        currentUser: 'befpail737@gmail.com (期望)',
        timestamp: new Date().toISOString(),
        correctURL: 'https://litong.pages.dev/studio',
        wrongURL: '❌ 不要使用: sanity.io/@onLmQUoxi/...'
      });
    }
    return prev;
  },

  // 自定义 Studio 加载配置
  document: {
    // 改善用户体验的配置
    unstable_comments: {
      enabled: true
    }
  }
})