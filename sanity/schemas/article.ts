import { defineType, defineField } from 'sanity'
import { FileText } from 'lucide-react'

export const article = defineType({
  name: 'article',
  title: '技术文章',
  type: 'document',
  icon: FileText,
  
  fields: [
    // 简化标题字段
    defineField({
      name: 'title',
      title: '文章标题',
      type: 'string',
      validation: Rule => Rule.required(),
      description: '文章标题',
    }),
    
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    
    // 简化摘要字段
    defineField({
      name: 'excerpt',
      title: '文章摘要',
      type: 'text',
      rows: 3,
      description: '文章摘要，用于列表展示和SEO',
    }),
    
    // 增强内容字段 - 完整富文本编辑器
    defineField({
      name: 'content',
      title: '文章内容',
      type: 'array',
      validation: Rule => Rule.required(),
      description: '文章正文内容，支持富文本编辑、链接、图片、PDF、表格等',
      of: [
        {
          type: 'block',
          styles: [
            { title: '正文', value: 'normal' },
            { title: '标题1', value: 'h1' },
            { title: '标题2', value: 'h2' },
            { title: '标题3', value: 'h3' },
            { title: '标题4', value: 'h4' },
            { title: '引用', value: 'blockquote' },
          ],
          lists: [
            { title: '无序列表', value: 'bullet' },
            { title: '有序列表', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: '粗体', value: 'strong' },
              { title: '斜体', value: 'em' },
              { title: '下划线', value: 'underline' },
              { title: '删除线', value: 'strike-through' },
              { title: '代码', value: 'code' },
            ],
            annotations: [
              // 增强链接功能
              {
                name: 'link',
                type: 'object',
                title: '超链接',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: '链接地址',
                    validation: Rule => Rule.required().uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    }),
                  },
                  {
                    name: 'target',
                    type: 'string',
                    title: '打开方式',
                    options: {
                      list: [
                        { title: '当前窗口', value: '_self' },
                        { title: '新窗口', value: '_blank' },
                      ]
                    },
                    initialValue: '_blank',
                  },
                ],
              },
              // 字体颜色
              {
                name: 'color',
                type: 'object',
                title: '字体颜色',
                fields: [
                  {
                    name: 'hex',
                    type: 'string',
                    title: '颜色',
                    options: {
                      list: [
                        { title: '黑色', value: '#000000' },
                        { title: '红色', value: '#DC2626' },
                        { title: '蓝色', value: '#2563EB' },
                        { title: '绿色', value: '#059669' },
                        { title: '橙色', value: '#EA580C' },
                        { title: '紫色', value: '#7C3AED' },
                        { title: '灰色', value: '#6B7280' },
                      ]
                    },
                    initialValue: '#000000',
                  },
                ],
              },
              // 字体大小
              {
                name: 'fontSize',
                type: 'object',
                title: '字体大小',
                fields: [
                  {
                    name: 'size',
                    type: 'string',
                    title: '大小',
                    options: {
                      list: [
                        { title: '小号 (12px)', value: 'text-xs' },
                        { title: '正常 (14px)', value: 'text-sm' },
                        { title: '中号 (16px)', value: 'text-base' },
                        { title: '大号 (18px)', value: 'text-lg' },
                        { title: '特大 (20px)', value: 'text-xl' },
                        { title: '超大 (24px)', value: 'text-2xl' },
                      ]
                    },
                    initialValue: 'text-base',
                  },
                ],
              },
            ],
          },
        },
        // 图片支持
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: '图片描述',
              validation: Rule => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: '图片标题',
            },
          ],
        },
        // PDF文件支持
        {
          type: 'file',
          name: 'pdf',
          title: 'PDF文档',
          options: {
            accept: '.pdf',
          },
          fields: [
            {
              name: 'title',
              type: 'string',
              title: '文档标题',
              validation: Rule => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              title: '文档描述',
            },
          ],
        },
        // 表格支持
        {
          type: 'object',
          name: 'table',
          title: '表格',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: '表格标题',
            },
            {
              name: 'rows',
              type: 'array',
              title: '表格行',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'cells',
                      type: 'array',
                      title: '单元格',
                      of: [{ type: 'string' }],
                    },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare({ title }) {
              return {
                title: title || '表格',
                subtitle: '数据表格',
              };
            },
          },
        },
      ],
    }),
    
    defineField({
      name: 'image',
      title: '封面图片',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '替代文本',
          validation: Rule => Rule.required()
        },
        {
          name: 'caption',
          type: 'string',
          title: '图片说明'
        }
      ]
    }),
    
    defineField({
      name: 'author',
      title: '作者',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: Rule => Rule.required(),
    }),

    // 关联品牌（必填）
    defineField({
      name: 'relatedBrands',
      title: '关联品牌',
      type: 'array',
      validation: Rule => Rule.required().min(1).max(5).error('请至少选择1个品牌，最多5个'),
      of: [{ 
        type: 'reference', 
        to: [{ type: 'brandBasic' }],
        options: {
          filter: 'isActive == true && !(_id in path("drafts.**"))',
          disableNew: true
        }
      }],
      description: '技术文章必须关联至少一个品牌，用于在品牌技术支持页面显示'
    }),
    
    defineField({
      name: 'category',
      title: '文章分类',
      type: 'reference',
      to: [{ type: 'articleCategory' }],
      validation: Rule => Rule.required(),
    }),
    
    // 标签
    defineField({
      name: 'tags',
      title: '标签',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      description: '文章标签，用于分类和搜索'
    }),
    
    // 阅读时长估算
    defineField({
      name: 'readTime',
      title: '阅读时长（分钟）',
      type: 'number',
      validation: Rule => Rule.min(1).max(120),
      description: '预估阅读时长'
    }),
    
    // 文章类型
    defineField({
      name: 'articleType',
      title: '文章类型',
      type: 'string',
      options: {
        list: [
          { title: '技术文章', value: 'technical' },
          { title: '技术支持', value: 'support' },
          { title: '教程指南', value: 'tutorial' },
          { title: '案例研究', value: 'case-study' },
          { title: '产品发布', value: 'product-release' }
        ],
        layout: 'radio'
      },
      initialValue: 'technical',
      description: '选择文章类型，技术支持文章会显示在品牌技术支持页面'
    }),

    // 技术难度级别
    defineField({
      name: 'difficulty',
      title: '技术难度',
      type: 'string',
      options: {
        list: [
          { title: '初级', value: 'beginner' },
          { title: '中级', value: 'intermediate' },
          { title: '高级', value: 'advanced' },
          { title: '专家', value: 'expert' }
        ],
        layout: 'radio'
      },
      initialValue: 'intermediate'
    }),
    
    // 相关产品
    defineField({
      name: 'relatedProducts',
      title: '相关产品',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: '与此文章相关的产品'
    }),
    
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    
    defineField({
      name: 'isPublished',
      title: '是否发布',
      type: 'boolean',
      initialValue: false,
      description: '控制文章是否在前端显示'
    }),
    
    defineField({
      name: 'isFeatured',
      title: '是否推荐',
      type: 'boolean',
      initialValue: false,
      description: '推荐文章会在首页等位置优先展示'
    }),
    
    // 简化SEO设置
    defineField({
      name: 'seoTitle',
      title: 'SEO标题',
      type: 'string',
      description: '搜索引擎显示的标题，留空则使用文章标题'
    }),
    
    defineField({
      name: 'seoDescription',
      title: 'SEO描述',
      type: 'text',
      rows: 2,
      description: '搜索引擎显示的描述，留空则使用文章摘要'
    }),
    
    defineField({
      name: 'seoKeywords',
      title: 'SEO关键词',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      },
      description: 'SEO关键词标签'
    }),
  ],
  
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      image: 'image',
      isPublished: 'isPublished',
      isFeatured: 'isFeatured',
      difficulty: 'difficulty'
    },
    prepare({ title, author, image, isPublished, isFeatured, difficulty }) {
      const difficultyMap: Record<string, string> = {
        beginner: '初级',
        intermediate: '中级', 
        advanced: '高级',
        expert: '专家'
      }
      
      const statusIcons = []
      if (isFeatured) statusIcons.push('⭐')
      if (!isPublished) statusIcons.push('📝')
      
      return {
        title: title || '未命名文章',
        subtitle: `${author || '未知作者'} • ${difficultyMap[difficulty] || difficulty} ${statusIcons.join(' ')}`,
        media: image,
      }
    }
  },
  
  orderings: [
    {
      title: '发布时间（最新）',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    },
    {
      title: '发布时间（最早）',
      name: 'publishedAsc', 
      by: [{ field: 'publishedAt', direction: 'asc' }]
    },
    {
      title: '标题',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    },
    {
      title: '难度级别',
      name: 'difficultyAsc',
      by: [{ field: 'difficulty', direction: 'asc' }]
    }
  ]
})