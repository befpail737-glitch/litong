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

  // 权限优化配置
  useCdn: true, // 使用 CDN 缓存以改善权限同步
  // 移除 perspective 限制，允许完整权限检查
  
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

  // Studio 工具配置 - 增强权限调试
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
        wrongURL: '❌ 不要使用: sanity.io/@onLmQUoxi/...',
        configChanges: '✅ 已移除 perspective 限制，启用 CDN 缓存'
      });

      // 权限状态检查
      setTimeout(() => {
        const sanityUser = (window as any).sanity?.currentUser;
        console.log('🔐 权限检查:', {
          sanityUserObject: sanityUser,
          expectedEmail: 'befpail737@gmail.com',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
      }, 3000);
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