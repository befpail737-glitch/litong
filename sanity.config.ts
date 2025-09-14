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
  }
})