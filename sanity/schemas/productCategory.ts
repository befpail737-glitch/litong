import { defineType, defineField } from 'sanity'

export const productCategory = defineType({
  name: 'productCategory',
  title: '产品分类',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '分类名称',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: '分类标识符',
      type: 'slug',
      description: '用于URL的唯一标识符（英文）',
      options: {
        source: 'name'
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'nameEn',
      title: '英文名称',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: '分类描述',
      type: 'text'
    }),
    defineField({
      name: 'parent',
      title: '父级分类',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      description: '留空表示这是大类'
    }),
    defineField({
      name: 'icon',
      title: '分类图标',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'sort',
      title: '排序',
      type: 'number',
      description: '数字越小排序越前',
      initialValue: 0
    }),
    defineField({
      name: 'isActive',
      title: '是否启用',
      type: 'boolean',
      initialValue: true
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'nameEn',
      media: 'icon'
    }
  },
  orderings: [
    {
      title: '按排序',
      name: 'sortAsc',
      by: [{ field: 'sort', direction: 'asc' }]
    },
    {
      title: '按名称',
      name: 'nameAsc', 
      by: [{ field: 'name', direction: 'asc' }]
    }
  ]
})