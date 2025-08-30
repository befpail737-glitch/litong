import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productCategory',
  title: '产品大类',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '分类名称（中文）',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameEn',
      title: '分类名称（英文）',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: {
        source: 'nameEn',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '分类描述',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'icon',
      title: '分类图标',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO标题',
      type: 'string',
      description: '搜索引擎优化标题',
    }),
    defineField({
      name: 'seoDescription', 
      title: 'SEO描述',
      type: 'text',
      rows: 2,
      description: '搜索引擎优化描述',
    }),
    defineField({
      name: 'keywords',
      title: 'SEO关键词',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'sortOrder',
      title: '排序',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      title: '是否启用',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'nameEn',
      media: 'icon',
    },
  },
  orderings: [
    {
      title: '排序',
      name: 'sortOrder',
      by: [
        {field: 'sortOrder', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
})