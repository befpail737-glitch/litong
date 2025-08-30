import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'brand',
  title: '品牌',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '品牌名称',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameEn',
      title: '品牌英文名',
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
      name: 'logo',
      title: '品牌Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: '品牌描述',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'website',
      title: '官方网站',
      type: 'url',
    }),
    defineField({
      name: 'country',
      title: '国家/地区',
      type: 'string',
    }),
    defineField({
      name: 'founded',
      title: '成立年份',
      type: 'number',
    }),
    defineField({
      name: 'isActive',
      title: '是否启用',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: '排序',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'nameEn',
      media: 'logo',
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