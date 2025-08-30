import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'solution',
  title: '解决方案',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '方案标题',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: '英文标题',
      type: 'string',
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
      title: '方案摘要',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: '方案内容',
      type: 'blockContent',
    }),
    defineField({
      name: 'featuredImage',
      title: '主图',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'category',
      title: '应用领域',
      type: 'string',
      options: {
        list: [
          {title: '汽车电子', value: 'automotive'},
          {title: '工业控制', value: 'industrial'},
          {title: '消费电子', value: 'consumer'},
          {title: '通信设备', value: 'communication'},
          {title: '医疗设备', value: 'medical'},
          {title: '新能源', value: 'renewable'},
        ],
      },
    }),
    defineField({
      name: 'relatedProducts',
      title: '相关产品',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
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
      subtitle: 'category',
      media: 'featuredImage',
    },
  },
})