import { defineType, defineField } from 'sanity'
import { FolderOpen } from 'lucide-react'

export const productSubcategory = defineType({
  name: 'productSubcategory',
  title: '产品子分类',
  type: 'document',
  icon: FolderOpen,
  
  fields: [
    defineField({
      name: 'name',
      title: '子分类名称',
      type: 'string',
      validation: Rule => Rule.required().error('子分类名称是必填项'),
    }),
    
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required().error('URL标识是必填项'),
    }),
    
    defineField({
      name: 'description',
      title: '子分类描述',
      type: 'text',
      rows: 3,
    }),
    
    defineField({
      name: 'category',
      title: '所属分类',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      validation: Rule => Rule.required().error('所属分类是必填项'),
    }),
    
    defineField({
      name: 'sortOrder',
      title: '排序',
      type: 'number',
      initialValue: 0,
    }),
    
    defineField({
      name: 'isVisible',
      title: '是否显示',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  
  preview: {
    select: {
      title: 'name',
      category: 'category.name',
      isVisible: 'isVisible'
    },
    prepare({ title, category, isVisible }) {
      return {
        title,
        subtitle: `${category}${isVisible ? '' : ' (已隐藏)'}`,
      }
    }
  },
  
  orderings: [
    {
      title: '排序',
      name: 'sortOrder',
      by: [
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' }
      ]
    }
  ]
})