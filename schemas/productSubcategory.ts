import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'productSubcategory',
  title: '产品小类',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '小类名称（中文）',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameEn',
      title: '小类名称（英文）',
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
      name: 'category',
      title: '所属大类',
      type: 'reference',
      to: [{type: 'productCategory'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '小类描述',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'specifications',
      title: '参数规格定义',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'parameterName',
              title: '参数名称',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'parameterNameEn', 
              title: '参数英文名',
              type: 'string',
            },
            {
              name: 'parameterType',
              title: '参数类型',
              type: 'string',
              options: {
                list: [
                  {title: '文本', value: 'text'},
                  {title: '数值', value: 'number'},
                  {title: '选项', value: 'select'},
                  {title: '范围', value: 'range'},
                  {title: '布尔值', value: 'boolean'},
                ],
              },
              initialValue: 'text',
            },
            {
              name: 'unit',
              title: '单位',
              type: 'string',
            },
            {
              name: 'options',
              title: '可选值',
              type: 'array',
              of: [{type: 'string'}],
              description: '当参数类型为选项时填写',
            },
            {
              name: 'isFilterable',
              title: '可筛选',
              type: 'boolean',
              initialValue: true,
            },
            {
              name: 'isRequired',
              title: '必填',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'sortOrder',
              title: '排序',
              type: 'number',
              initialValue: 0,
            },
          ],
          preview: {
            select: {
              title: 'parameterName',
              subtitle: 'parameterType',
            },
          },
        },
      ],
      description: '定义该小类产品的参数规格，将用于Excel上传和筛选功能',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO标题',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO描述', 
      type: 'text',
      rows: 2,
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
      categoryName: 'category.name',
    },
    prepare(selection) {
      const {title, subtitle, categoryName} = selection
      return {
        title: title,
        subtitle: `${subtitle} (${categoryName})`,
      }
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