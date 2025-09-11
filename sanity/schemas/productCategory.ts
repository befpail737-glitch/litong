import { defineType, defineField } from 'sanity'
import { Folder } from 'lucide-react'

export const productCategory = defineType({
  name: 'productCategory',
  title: '产品分类',
  type: 'document',
  icon: Folder,
  
  fields: [
    defineField({
      name: 'name',
      title: '分类名称',
      type: 'string',
      validation: Rule => Rule.required().error('分类名称是必填项'),
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
      title: '分类描述',
      type: 'text',
      rows: 3,
    }),
    
    defineField({
      name: 'icon',
      title: '图标名称',
      type: 'string',
      description: 'Lucide图标名称，如：Cpu, Zap, Wifi等',
    }),
    
    defineField({
      name: 'image',
      title: '分类图片',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: '图片描述',
          validation: Rule => Rule.required().error('图片描述是必填项'),
        }
      ]
    }),
    
    defineField({
      name: 'parent',
      title: '父级分类',
      type: 'reference',
      to: [{ type: 'productCategory' }],
      description: '如果这是子分类，请选择父级分类',
    }),
    
    defineField({
      name: 'level',
      title: '层级',
      type: 'number',
      initialValue: 1,
      validation: Rule => Rule.required().min(1).max(5),
      description: '1为顶级分类，2为二级分类，以此类推',
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
    
    // SEO字段
    defineField({
      name: 'seoTitle',
      title: 'SEO标题',
      type: 'string',
      validation: Rule => Rule.max(60).warning('建议不超过60字符'),
    }),
    
    defineField({
      name: 'seoDescription',
      title: 'SEO描述',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(160).warning('建议不超过160字符'),
    }),
  ],
  
  preview: {
    select: {
      title: 'name',
      parent: 'parent.name',
      level: 'level',
      image: 'image',
      isVisible: 'isVisible'
    },
    prepare({ title, parent, level, image, isVisible }) {
      return {
        title,
        subtitle: `${parent ? `${parent} > ` : ''}L${level}${isVisible ? '' : ' (已隐藏)'}`,
        media: image
      }
    }
  },
  
  orderings: [
    {
      title: '排序',
      name: 'sortOrder',
      by: [
        { field: 'level', direction: 'asc' },
        { field: 'sortOrder', direction: 'asc' },
        { field: 'name', direction: 'asc' }
      ]
    },
    {
      title: '分类名称',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }]
    }
  ]
})