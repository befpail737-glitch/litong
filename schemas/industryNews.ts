import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'industryNews',
  title: '行业动态',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '标题',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: '摘要',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: '内容',
      type: 'blockContent',
    }),
    defineField({
      name: 'featuredImage',
      title: '头图',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'source',
      title: '来源',
      type: 'string',
    }),
    defineField({
      name: 'sourceUrl',
      title: '原文链接',
      type: 'url',
    }),
    defineField({
      name: 'tags',
      title: '标签',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
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
      title: 'title',
      subtitle: 'source',
      media: 'featuredImage',
    },
  },
})