# CMS数据模型设计 (Sanity Schema)

## 项目配置信息
```javascript
// sanity.config.js
export default defineConfig({
  name: 'litong',
  title: 'LiTong Electronics CMS',
  projectId: 'oquvb2bs',
  dataset: 'production',
  basePath: '/admin',
  plugins: [
    deskTool(),
    visionTool(),
    codeInput()
  ],
  schema: {
    types: [
      // 数据模型定义
    ],
  },
})
```

## 核心数据模型

### 1. Brand (品牌模型)
```javascript
export default {
  name: 'brand',
  title: 'Brand (品牌)',
  type: 'document',
  icon: () => '🏷️',
  fields: [
    {
      name: 'name',
      title: 'Brand Name (品牌名称)',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug (URL路径)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: input => input
                          .toLowerCase()
                          .replace(/\s+/g, '-')
                          .slice(0, 96)
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'logo',
      title: 'Logo (品牌标志)',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text'
        }
      ]
    },
    {
      name: 'description',
      title: 'Description (品牌描述)',
      type: 'text',
      rows: 3
    },
    {
      name: 'officialWebsite',
      title: 'Official Website (官方网站)',
      type: 'url'
    },
    {
      name: 'foundedYear',
      title: 'Founded Year (成立年份)',
      type: 'number'
    },
    {
      name: 'headquarters',
      title: 'Headquarters (总部所在地)',
      type: 'string'
    },
    {
      name: 'productCategories',
      title: 'Product Categories (产品类别)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'productCategory' }
        }
      ]
    },
    {
      name: 'isActive',
      title: 'Is Active (是否活跃)',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: '页面SEO标题，不填写将使用品牌名称'
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      description: '页面SEO描述'
    }
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo'
    }
  }
}
```

### 2. ProductCategory (产品大类)
```javascript
export default {
  name: 'productCategory',
  title: 'Product Category (产品大类)',
  type: 'document',
  icon: () => '📦',
  fields: [
    {
      name: 'name',
      title: 'Category Name (类别名称)',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug (URL路径)',
      type: 'slug',
      options: {
        source: 'name'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description (类别描述)',
      type: 'text'
    },
    {
      name: 'icon',
      title: 'Category Icon (类别图标)',
      type: 'image',
      description: 'SVG格式的类别图标'
    },
    {
      name: 'features',
      title: 'Key Features (关键特性)',
      type: 'array',
      of: [{ type: 'string' }],
      description: '该类别产品的主要特性列表'
    },
    {
      name: 'subcategories',
      title: 'Subcategories (子类别)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'productSubcategory' }
        }
      ]
    },
    {
      name: 'sortOrder',
      title: 'Sort Order (排序)',
      type: 'number',
      description: '数字越小排序越靠前'
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string'
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text'
    }
  ]
}
```

### 3. ProductSubcategory (产品小类)
```javascript
export default {
  name: 'productSubcategory',
  title: 'Product Subcategory (产品小类)',
  type: 'document',
  icon: () => '📋',
  fields: [
    {
      name: 'name',
      title: 'Subcategory Name (小类名称)',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug (URL路径)',
      type: 'slug',
      options: {
        source: 'name'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'parentCategory',
      title: 'Parent Category (所属大类)',
      type: 'reference',
      to: { type: 'productCategory' },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description (描述)',
      type: 'text'
    },
    {
      name: 'specifications',
      title: 'Common Specifications (通用规格)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'parameter',
            title: 'Parameter (参数)',
            type: 'string'
          },
          {
            name: 'description',
            title: 'Description (说明)',
            type: 'string'
          },
          {
            name: 'unit',
            title: 'Unit (单位)',
            type: 'string'
          }
        ]
      }]
    }
  ]
}
```

### 4. Product (产品模型)
```javascript
export default {
  name: 'product',
  title: 'Product (产品)',
  type: 'document',
  icon: () => '🔧',
  fields: [
    {
      name: 'partNumber',
      title: 'Part Number (产品型号)',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug (URL路径)',
      type: 'slug',
      options: {
        source: 'partNumber'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'brand',
      title: 'Brand (品牌)',
      type: 'reference',
      to: { type: 'brand' },
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category (产品大类)',
      type: 'reference',
      to: { type: 'productCategory' },
      validation: Rule => Rule.required()
    },
    {
      name: 'subcategory',
      title: 'Subcategory (产品小类)',
      type: 'reference',
      to: { type: 'productSubcategory' }
    },
    {
      name: 'description',
      title: 'Description (产品描述)',
      type: 'text',
      rows: 3
    },
    {
      name: 'image',
      title: 'Product Image (产品图片)',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text'
        }
      ]
    },
    {
      name: 'specifications',
      title: 'Specifications (技术规格)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'parameter',
            title: 'Parameter (参数名)',
            type: 'string'
          },
          {
            name: 'value',
            title: 'Value (参数值)',
            type: 'string'
          },
          {
            name: 'unit',
            title: 'Unit (单位)',
            type: 'string'
          }
        ],
        preview: {
          select: {
            title: 'parameter',
            subtitle: 'value'
          }
        }
      }]
    },
    {
      name: 'pricing',
      title: 'Pricing (价格信息)',
      type: 'object',
      fields: [
        {
          name: 'unitPrice',
          title: 'Unit Price (单价)',
          type: 'number'
        },
        {
          name: 'currency',
          title: 'Currency (货币)',
          type: 'string',
          options: {
            list: [
              { title: 'CNY (人民币)', value: 'CNY' },
              { title: 'USD (美元)', value: 'USD' }
            ]
          },
          initialValue: 'CNY'
        },
        {
          name: 'priceBreaks',
          title: 'Price Breaks (阶梯价格)',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'quantity',
                title: 'Minimum Quantity',
                type: 'number'
              },
              {
                name: 'price',
                title: 'Unit Price',
                type: 'number'
              }
            ]
          }]
        }
      ]
    },
    {
      name: 'inventory',
      title: 'Inventory (库存信息)',
      type: 'object',
      fields: [
        {
          name: 'stockQuantity',
          title: 'Stock Quantity (库存数量)',
          type: 'number',
          initialValue: 0
        },
        {
          name: 'stockStatus',
          title: 'Stock Status (库存状态)',
          type: 'string',
          options: {
            list: [
              { title: '现货', value: 'in-stock' },
              { title: '期货', value: 'backorder' },
              { title: '缺货', value: 'out-of-stock' }
            ]
          },
          initialValue: 'in-stock'
        },
        {
          name: 'leadTime',
          title: 'Lead Time (交货期)',
          type: 'string',
          description: '例如：2-3周'
        }
      ]
    },
    {
      name: 'documents',
      title: 'Documents (技术文档)',
      type: 'object',
      fields: [
        {
          name: 'datasheet',
          title: 'Datasheet (规格书)',
          type: 'file',
          options: {
            accept: '.pdf'
          }
        },
        {
          name: 'certificate',
          title: 'Certificate (认证证书)',
          type: 'file',
          options: {
            accept: '.pdf'
          }
        },
        {
          name: 'customsDocument',
          title: 'Customs Document (报关单)',
          type: 'file',
          options: {
            accept: '.pdf'
          }
        }
      ]
    },
    {
      name: 'isActive',
      title: 'Is Active (是否活跃)',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'featured',
      title: 'Featured Product (推荐产品)',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string'
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text'
    }
  ],
  preview: {
    select: {
      title: 'partNumber',
      subtitle: 'brand.name',
      media: 'image'
    }
  }
}
```

### 5. Author (作者模型 - FAE工程师)
```javascript
export default {
  name: 'author',
  title: 'Author (作者)',
  type: 'document',
  icon: () => '👤',
  fields: [
    {
      name: 'name',
      title: 'Name (姓名)',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug (URL路径)',
      type: 'slug',
      options: {
        source: 'name'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'avatar',
      title: 'Avatar (头像)',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'jobTitle',
      title: 'Job Title (职位)',
      type: 'string',
      placeholder: '例如：高级FAE工程师'
    },
    {
      name: 'bio',
      title: 'Biography (个人简介)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H4', value: 'h4' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' }
            ]
          }
        }
      ]
    },
    {
      name: 'expertise',
      title: 'Expertise (专业领域)',
      type: 'array',
      of: [{ type: 'string' }],
      description: '擅长的技术领域，例如：模拟电路设计、嵌入式系统等'
    },
    {
      name: 'experience',
      title: 'Years of Experience (从业年限)',
      type: 'number'
    },
    {
      name: 'education',
      title: 'Education (教育背景)',
      type: 'string'
    },
    {
      name: 'certifications',
      title: 'Certifications (认证证书)',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'contactEmail',
      title: 'Contact Email (联系邮箱)',
      type: 'email'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'jobTitle',
      media: 'avatar'
    }
  }
}
```

### 6. Tag (标签模型)
```javascript
export default {
  name: 'tag',
  title: 'Tag (标签)',
  type: 'document',
  icon: () => '🏷️',
  fields: [
    {
      name: 'name',
      title: 'Tag Name (标签名称)',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug (URL路径)',
      type: 'slug',
      options: {
        source: 'name'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description (描述)',
      type: 'text',
      rows: 2
    },
    {
      name: 'color',
      title: 'Color (颜色)',
      type: 'string',
      options: {
        list: [
          { title: 'Blue', value: '#3B82F6' },
          { title: 'Green', value: '#10B981' },
          { title: 'Purple', value: '#8B5CF6' },
          { title: 'Red', value: '#EF4444' },
          { title: 'Yellow', value: '#F59E0B' },
          { title: 'Gray', value: '#6B7280' }
        ]
      },
      initialValue: '#3B82F6'
    }
  ]
}
```

### 7. Article (技术文章模型)
```javascript
export default {
  name: 'article',
  title: 'Technical Article (技术文章)',
  type: 'document',
  icon: () => '📄',
  fields: [
    {
      name: 'title',
      title: 'Title (标题)',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug (URL路径)',
      type: 'slug',
      options: {
        source: 'title'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'brand',
      title: 'Related Brand (关联品牌)',
      type: 'reference',
      to: { type: 'brand' },
      description: '如果文章属于特定品牌，请选择对应品牌'
    },
    {
      name: 'category',
      title: 'Category (文章分类)',
      type: 'string',
      options: {
        list: [
          { title: '选型指南', value: 'selection-guide' },
          { title: '应用笔记', value: 'application-note' },
          { title: '问题排查', value: 'troubleshooting' },
          { title: '新品评测', value: 'product-review' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'author',
      title: 'Author (作者)',
      type: 'reference',
      to: { type: 'author' },
      validation: Rule => Rule.required()
    },
    {
      name: 'publishedAt',
      title: 'Published Date (发布日期)',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm'
      }
    },
    {
      name: 'excerpt',
      title: 'Excerpt (摘要)',
      type: 'text',
      rows: 3,
      description: '文章摘要，用于列表页显示'
    },
    {
      name: 'featuredImage',
      title: 'Featured Image (特色图片)',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text'
        }
      ]
    },
    {
      name: 'content',
      title: 'Content (内容)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' }
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url'
                  }
                ]
              },
              {
                title: 'Product Link',
                name: 'productLink',
                type: 'object',
                fields: [
                  {
                    title: 'Product',
                    name: 'product',
                    type: 'reference',
                    to: { type: 'product' }
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text'
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        },
        {
          type: 'file',
          title: 'File Download'
        },
        {
          type: 'table'
        },
        {
          name: 'codeBlock',
          title: 'Code Block',
          type: 'code',
          options: {
            language: 'javascript',
            languageAlternatives: [
              { title: 'Javascript', value: 'javascript' },
              { title: 'C', value: 'c' },
              { title: 'C++', value: 'cpp' },
              { title: 'Python', value: 'python' }
            ]
          }
        }
      ]
    },
    {
      name: 'tags',
      title: 'Tags (标签)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'tag' }
        }
      ]
    },
    {
      name: 'relatedProducts',
      title: 'Related Products (相关产品)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'product' }
        }
      ]
    },
    {
      name: 'readingTime',
      title: 'Reading Time (阅读时间)',
      type: 'number',
      description: '预计阅读时间（分钟）'
    },
    {
      name: 'featured',
      title: 'Featured Article (推荐文章)',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string'
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text'
    }
  ],
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedDateDesc',
      by: [
        { field: 'publishedAt', direction: 'desc' }
      ]
    },
    {
      title: 'Published Date, Old',
      name: 'publishedDateAsc',
      by: [
        { field: 'publishedAt', direction: 'asc' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'featuredImage'
    },
    prepare(selection) {
      const { author } = selection
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`
      })
    }
  }
}
```

## 内容类型关联图

```
数据模型关联关系
├── Brand (品牌)
│   ├── → ProductCategory (产品大类)
│   ├── → Article (技术文章)
│   ├── → Solution (解决方案)
│   └── → News (新闻)
├── ProductCategory (产品大类)
│   ├── → ProductSubcategory (产品小类)
│   └── → Product (产品)
├── Product (产品)
│   ├── → Brand (所属品牌)
│   ├── → ProductCategory (产品大类)
│   └── → ProductSubcategory (产品小类)
├── Article (技术文章)
│   ├── → Author (作者)
│   ├── → Tag (标签)
│   ├── → Product (相关产品)
│   └── → Brand (关联品牌)
├── Author (作者)
│   └── → Article (发表文章)
└── Tag (标签)
    └── → Article (相关文章)
```