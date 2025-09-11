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
  
  // CORS配置，允许本地开发服务器访问
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://litong.sanity.studio'
    ]
  },
  
  plugins: [
    structureTool(), // 使用默认结构，不自定义
    visionTool({
      defaultApiVersion: '2023-05-03',
    }),
  ],
  
  schema: {
    types: schemaTypes,
  },
  
  // 自定义文档操作配置
  document: {
    // 确保新文档模板显示正确的标题
    newDocumentOptions: (prev, { creationContext }) => {
      return prev.map(template => {
        // 为常用文档类型添加更清晰的描述
        const descriptions = {
          'brandBasic': '创建新的品牌信息',
          'product': '添加新的产品信息',
          'solution': '创建新的解决方案',
          'article': '撰写新的技术文章'
        }
        
        if (descriptions[template.templateId]) {
          return {
            ...template,
            description: descriptions[template.templateId]
          }
        }
        return template
      })
    }
  }
})