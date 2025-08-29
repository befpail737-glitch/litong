import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemas } from './sanity/schemas'

const projectId = 'oquvb2bs'
const dataset = 'production'

export default defineConfig({
  name: 'default',
  title: 'LiTong Electronics',
  
  projectId,
  dataset,
  
  plugins: [
    deskTool(),
    visionTool()
  ],
  
  schema: {
    types: schemas
  },
  
  // 配置中文界面
  document: {
    productionUrl: 'https://www.elec-distributor.com',
  }
})