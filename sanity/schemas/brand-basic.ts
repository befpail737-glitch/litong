import { defineType, defineField } from 'sanity'
import { Award } from 'lucide-react'

export const brandBasic = defineType({
  name: 'brandBasic',
  title: '品牌（基础版）',
  type: 'document',
  icon: Award,
  
  fields: [
    defineField({
      name: 'name',
      title: '品牌名称',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-\u4e00-\u9fff]/g, '')
          .slice(0, 96)
      },
      validation: Rule => Rule.required().custom((slug) => {
        if (!slug || !slug.current) {
          return 'Slug是必需的'
        }
        
        const current = slug.current
        
        if (current !== current.trim()) {
          return 'Slug不能包含前后空格'
        }
        
        if (current.includes('  ')) {
          return 'Slug不能包含连续空格'
        }
        
        if (!/^[\w\-\u4e00-\u9fff]+$/.test(current)) {
          return 'Slug只能包含字母、数字、中文、连字符'
        }
        
        return true
      })
    }),
    
    defineField({
      name: 'description',
      title: '品牌介绍',
      type: 'text',
    }),
    
    defineField({
      name: 'website',
      title: '官方网站',
      type: 'string',
    }),
    
    defineField({
      name: 'country',
      title: '国家',
      type: 'string',
    }),
    
    defineField({
      name: 'headquarters',
      title: '总部',
      type: 'string',
    }),
    
    defineField({
      name: 'established',
      title: '成立年份',
      type: 'string',
    }),
    
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    
    defineField({
      name: 'isActive',
      title: '启用',
      type: 'boolean',
      initialValue: true,
    }),
    
    defineField({
      name: 'isFeatured',
      title: '特色品牌',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  
  preview: {
    select: {
      title: 'name',
      subtitle: 'country',
      media: 'logo',
      isActive: 'isActive',
      isFeatured: 'isFeatured'
    },
    prepare({ title, subtitle, media, isActive, isFeatured }) {
      const statusIcons = []
      if (isFeatured) statusIcons.push('⭐')
      if (!isActive) statusIcons.push('🚫')
      
      return {
        title: title || '未命名品牌',
        subtitle: `${subtitle || '未知国家'}${statusIcons.length ? ` ${statusIcons.join(' ')}` : ''}`,
        media: media
      }
    }
  },

  orderings: [
    {
      title: '品牌名称',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }]
    },
    {
      title: '创建时间（最新）',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }]
    },
    {
      title: '特色品牌优先',
      name: 'featuredFirst',
      by: [
        { field: 'isFeatured', direction: 'desc' },
        { field: 'name', direction: 'asc' }
      ]
    }
  ],
})