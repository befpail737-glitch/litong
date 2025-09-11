import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'litong-electronics',
  title: '力通电子管理系统',
  
  projectId: 'oquvb2bs',
  dataset: 'production',
  
  basePath: '/admin',
  
  plugins: [
    structureTool(), // 使用默认结构，不自定义
    visionTool({
      defaultApiVersion: '2023-05-03',
    }),
  ],
  
  schema: {
    types: schemaTypes,
  },
})