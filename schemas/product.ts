import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: '产品型号',
  type: 'document',
  fields: [
    defineField({
      name: 'partNumber',
      title: '型号',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL标识',
      type: 'slug',
      options: {
        source: 'partNumber',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'brand',
      title: '品牌',
      type: 'reference',
      to: [{type: 'brand'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subcategory',
      title: '产品小类',
      type: 'reference',
      to: [{type: 'productSubcategory'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: '产品名称',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '产品描述',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'specifications',
      title: '产品参数',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'parameter',
              title: '参数名',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'value',
              title: '参数值',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'unit',
              title: '单位',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'parameter',
              subtitle: 'value',
            },
            prepare(selection) {
              const {title, subtitle} = selection
              return {
                title: title,
                subtitle: subtitle,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'images',
      title: '产品图片',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'datasheet',
      title: '数据手册',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    }),
    defineField({
      name: 'stock',
      title: '库存数量',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'price',
      title: '价格',
      type: 'object',
      fields: [
        {
          name: 'currency',
          title: '货币',
          type: 'string',
          initialValue: 'CNY',
          options: {
            list: [
              {title: '人民币', value: 'CNY'},
              {title: '美元', value: 'USD'},
              {title: '欧元', value: 'EUR'},
            ],
          },
        },
        {
          name: 'amount',
          title: '金额',
          type: 'number',
        },
        {
          name: 'minQuantity',
          title: '最小订购量',
          type: 'number',
          initialValue: 1,
        },
      ],
    }),
    defineField({
      name: 'leadTime',
      title: '交期（天）',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: '产品状态',
      type: 'string',
      options: {
        list: [
          {title: '量产', value: 'active'},
          {title: '停产', value: 'discontinued'},
          {title: '预览', value: 'preview'},
          {title: '缺货', value: 'out_of_stock'},
        ],
      },
      initialValue: 'active',
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
      name: 'isActive',
      title: '是否启用',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'partNumber',
      subtitle: 'name',
      brandName: 'brand.name',
      media: 'images.0',
    },
    prepare(selection) {
      const {title, subtitle, brandName} = selection
      return {
        title: title,
        subtitle: `${subtitle} (${brandName})`,
        media: selection.media,
      }
    },
  },
  orderings: [
    {
      title: '型号',
      name: 'partNumber',
      by: [{field: 'partNumber', direction: 'asc'}],
    },
    {
      title: '品牌',
      name: 'brand',
      by: [
        {field: 'brand.name', direction: 'asc'},
        {field: 'partNumber', direction: 'asc'},
      ],
    },
  ],
})