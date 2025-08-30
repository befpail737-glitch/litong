import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'LiTong Electronics CMS',
  
  projectId: 'oquvb2bs',
  dataset: 'production',
  
  basePath: '/admin',
  
  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('内容管理')
          .items([
            S.listItem()
              .title('产品管理')
              .child(
                S.list()
                  .title('产品管理')
                  .items([
                    S.listItem()
                      .title('产品大类')
                      .schemaType('productCategory')
                      .child(S.documentTypeList('productCategory')),
                    S.listItem()
                      .title('产品小类')
                      .schemaType('productSubcategory') 
                      .child(S.documentTypeList('productSubcategory')),
                    S.listItem()
                      .title('产品型号')
                      .schemaType('product')
                      .child(S.documentTypeList('product')),
                  ])
              ),
            S.listItem()
              .title('品牌管理')
              .schemaType('brand')
              .child(S.documentTypeList('brand')),
            S.listItem()
              .title('解决方案')
              .schemaType('solution')
              .child(S.documentTypeList('solution')),
            S.listItem()
              .title('新闻管理')
              .child(
                S.list()
                  .title('新闻管理')
                  .items([
                    S.listItem()
                      .title('公司新闻')
                      .schemaType('companyNews')
                      .child(S.documentTypeList('companyNews')),
                    S.listItem()
                      .title('行业动态')
                      .schemaType('industryNews')
                      .child(S.documentTypeList('industryNews')),
                  ])
              ),
            S.listItem()
              .title('技术支持')
              .child(
                S.list()
                  .title('技术支持')
                  .items([
                    S.listItem()
                      .title('选型指南')
                      .schemaType('selectionGuide')
                      .child(S.documentTypeList('selectionGuide')),
                    S.listItem()
                      .title('应用笔记')
                      .schemaType('applicationNote')
                      .child(S.documentTypeList('applicationNote')),
                    S.listItem()
                      .title('问题排查')
                      .schemaType('troubleshooting')
                      .child(S.documentTypeList('troubleshooting')),
                    S.listItem()
                      .title('新品评测')
                      .schemaType('productReview')
                      .child(S.documentTypeList('productReview')),
                  ])
              ),
            S.listItem()
              .title('作者管理')
              .schemaType('author')
              .child(S.documentTypeList('author')),
          ])
    }),
    visionTool()
  ],
  
  schema: {
    types: schemaTypes,
  },
})