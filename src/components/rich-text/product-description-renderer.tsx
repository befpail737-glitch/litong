'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import {
  ExternalLink,
  Download,
  Package,
  Zap,
  Settings,
  Thermometer,
  Activity,
  Info,
  CheckCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// 产品描述专用 Portable Text 组件类型
interface ProductDescriptionRendererProps {
  value: any[]
  className?: string
}

// 产品规格表格组件
interface SpecTableProps {
  value: {
    title?: string
    rows: Array<{
      cells: string[]
    }>
    hasHeader?: boolean
    category?: 'electrical' | 'mechanical' | 'environmental' | 'general'
  }
}

const SpecTable: React.FC<SpecTableProps> = ({ value }) => {
  const { rows, title, hasHeader = true, category = 'general' } = value;

  if (!rows || rows.length === 0) return null;

  const categoryIcons = {
    electrical: Zap,
    mechanical: Settings,
    environmental: Thermometer,
    general: Activity
  };

  const categoryColors = {
    electrical: 'border-l-yellow-500 bg-yellow-50',
    mechanical: 'border-l-blue-500 bg-blue-50',
    environmental: 'border-l-green-500 bg-green-50',
    general: 'border-l-gray-500 bg-gray-50'
  };

  const IconComponent = categoryIcons[category];

  return (
    <div className={cn('my-8 border-l-4 rounded-r-lg overflow-hidden', categoryColors[category])}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          {hasHeader && rows[0] && (
            <thead className="bg-white/70">
              <tr>
                {rows[0].cells.map((cell, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="bg-white/50">
            {(hasHeader ? rows.slice(1) : rows).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-white/70 transition-colors">
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 text-sm text-gray-700 border-b border-gray-100">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 产品特色卡片组件
interface FeatureCardProps {
  value: {
    title: string
    description: string
    icon?: 'package' | 'zap' | 'settings' | 'activity' | 'check'
    color?: 'blue' | 'green' | 'orange' | 'purple' | 'red'
  }
}

const FeatureCard: React.FC<FeatureCardProps> = ({ value }) => {
  const { title, description, icon = 'package', color = 'blue' } = value;

  const icons = {
    package: Package,
    zap: Zap,
    settings: Settings,
    activity: Activity,
    check: CheckCircle
  };

  const colors = {
    blue: 'border-blue-200 bg-blue-50 text-blue-900',
    green: 'border-green-200 bg-green-50 text-green-900',
    orange: 'border-orange-200 bg-orange-50 text-orange-900',
    purple: 'border-purple-200 bg-purple-50 text-purple-900',
    red: 'border-red-200 bg-red-50 text-red-900'
  };

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    red: 'text-red-600'
  };

  const IconComponent = icons[icon];

  return (
    <Card className={cn('my-6 border-l-4', colors[color])}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn('w-12 h-12 rounded-lg bg-white flex items-center justify-center', iconColors[color])}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 产品文档下载组件
interface ProductDocumentProps {
  value: {
    file: {
      asset: {
        url: string
        originalFilename?: string
      }
    }
    title?: string
    description?: string
    type?: 'datasheet' | 'manual' | 'certificate' | 'guide' | 'other'
    fileSize?: string
  }
}

const ProductDocument: React.FC<ProductDocumentProps> = ({ value }) => {
  const { file, title, description, type = 'other', fileSize } = value;

  const typeLabels = {
    datasheet: '数据手册',
    manual: '用户手册',
    certificate: '认证证书',
    guide: '应用指南',
    other: '相关文档'
  };

  const typeColors = {
    datasheet: 'bg-blue-100 text-blue-800',
    manual: 'bg-green-100 text-green-800',
    certificate: 'bg-purple-100 text-purple-800',
    guide: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800'
  };

  return (
    <Card className="my-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <Badge className={typeColors[type]}>
                {typeLabels[type]}
              </Badge>
            </div>
            <h4 className="font-medium text-lg mb-1">
              {title || file.asset.originalFilename || '产品文档'}
            </h4>
            {description && (
              <p className="text-sm text-gray-600 mb-2">{description}</p>
            )}
            {fileSize && (
              <p className="text-xs text-gray-500">文件大小: {fileSize}</p>
            )}
          </div>
          <Button asChild>
            <a href={file.asset.url} download target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" />
              下载
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// 产品提示信息组件
interface ProductNoticeProps {
  value: {
    type: 'info' | 'warning' | 'success'
    title?: string
    content: any[]
  }
}

const ProductNotice: React.FC<ProductNoticeProps> = ({ value }) => {
  const { type, title, content } = value;

  const typeConfig = {
    info: {
      icon: Info,
      color: 'border-blue-200 bg-blue-50 text-blue-900',
      iconColor: 'text-blue-600'
    },
    warning: {
      icon: AlertTriangle,
      color: 'border-yellow-200 bg-yellow-50 text-yellow-900',
      iconColor: 'text-yellow-600'
    },
    success: {
      icon: CheckCircle,
      color: 'border-green-200 bg-green-50 text-green-900',
      iconColor: 'text-green-600'
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <div className={cn('border-l-4 p-6 my-6 rounded-r-lg', config.color)}>
      <div className="flex items-start gap-3">
        <IconComponent className={cn('w-5 h-5 flex-shrink-0 mt-0.5', config.iconColor)} />
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-2">{title}</h4>
          )}
          <PortableText
            value={content}
            components={productDescriptionComponents}
          />
        </div>
      </div>
    </div>
  );
};

// 产品描述专用 Portable Text 组件配置
const productDescriptionComponents = {
  types: {
    image: ({ value }: any) => {
      const { asset, alt, caption } = value;
      return (
        <figure className="my-8">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={asset.url}
              alt={alt || '产品图片'}
              width={800}
              height={600}
              className="w-full h-auto"
            />
          </div>
          {caption && (
            <figcaption className="text-center text-sm text-gray-600 mt-3">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    },

    table: SpecTable,
    featureCard: FeatureCard,
    pdf: ProductDocument,
    notice: ProductNotice
  },

  marks: {
    link: ({ children, value }: any) => {
      const isExternal = value.href?.startsWith('http');
      return (
        <Link
          href={value.href || '#'}
          className={cn(
            'text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1',
            isExternal && "after:content-['_↗']"
          )}
          target={value.target || (isExternal ? '_blank' : '_self')}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
          {isExternal && <ExternalLink className="w-3 h-3 ml-1" />}
        </Link>
      );
    },

    strong: ({ children }: any) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),

    em: ({ children }: any) => (
      <em className="italic">{children}</em>
    ),

    code: ({ children }: any) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
        {children}
      </code>
    ),

    underline: ({ children }: any) => (
      <u className="underline decoration-gray-400">{children}</u>
    ),

    'strike-through': ({ children }: any) => (
      <s className="line-through text-gray-500">{children}</s>
    ),

    // 自定义字体颜色和大小支持
    color: ({ children, value }: any) => (
      <span style={{ color: value.hex }}>{children}</span>
    ),

    fontSize: ({ children, value }: any) => (
      <span className={value.size}>{children}</span>
    )
  },

  block: {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold mt-12 mb-6 first:mt-0 text-gray-900">
        {children}
      </h1>
    ),

    h2: ({ children }: any) => (
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900">
        {children}
      </h2>
    ),

    h3: ({ children }: any) => (
      <h3 className="text-xl font-medium mt-8 mb-3 text-gray-900">
        {children}
      </h3>
    ),

    h4: ({ children }: any) => (
      <h4 className="text-lg font-medium mt-6 mb-2 text-gray-900">
        {children}
      </h4>
    ),

    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-6 py-2 my-6 italic bg-gray-50 rounded-r">
        <div className="space-y-4 text-gray-700">{children}</div>
      </blockquote>
    ),

    normal: ({ children }: any) => (
      <p className="mb-4 leading-7 text-gray-700">{children}</p>
    ),
  },

  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside mb-6 space-y-2 pl-4 text-gray-700">
        {children}
      </ul>
    ),

    number: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-6 space-y-2 pl-4 text-gray-700">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }: any) => (
      <li className="leading-7">{children}</li>
    ),

    number: ({ children }: any) => (
      <li className="leading-7">{children}</li>
    ),
  },
};

export function ProductDescriptionRenderer({ value, className }: ProductDescriptionRendererProps) {
  if (!value || !Array.isArray(value)) {
    return null;
  }

  return (
    <div className={cn('max-w-none', className)}>
      <PortableText
        value={value}
        components={productDescriptionComponents}
      />
    </div>
  );
}

export { productDescriptionComponents };