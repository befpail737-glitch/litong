import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'selectionGuide',
  title: '选型指南',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '指南标题',
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
      name: 'summary',
      title: '摘要',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: '指南内容',
      type: 'blockContent',
    }),
    defineField({
      name: 'category',
      title: '产品类别',
      type: 'reference',
      to: [{type: 'productCategory'}],
    }),
    defineField({
      name: 'relatedProducts',
      title: '相关产品',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
    }),
    defineField({
      name: 'author',
      title: '作者',
      type: 'reference',
      to: [{type: 'author'}],
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
      author: 'author.name',
      category: 'category.name',
    },
    prepare(selection) {
      const {author, category} = selection
      return {...selection, subtitle: `${category} - ${author}`}
    },
  },
})