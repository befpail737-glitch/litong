'use client'

import { useFormatters, usePriceFormatter, useDateRangeFormatter } from '@/hooks/use-formatters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LocalizationDemoProps {
  className?: string
}

export function LocalizationDemo({ className }: LocalizationDemoProps) {
  const formatters = useFormatters()
  const priceFormatter = usePriceFormatter()
  const dateRangeFormatter = useDateRangeFormatter()

  // 示例数据
  const sampleData = {
    number: 1234567.89,
    price: 299.99,
    priceRange: { min: 199.99, max: 599.99 },
    percentage: 85.5,
    fileSize: 1048576, // 1MB
    compactNumber: 15000,
    date: new Date('2024-03-15'),
    pastDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
    dateRange: {
      start: new Date('2024-03-01'),
      end: new Date('2024-03-31')
    }
  }

  const examples = [
    {
      label: '数字格式化',
      value: formatters.number(sampleData.number),
      description: '根据语言环境格式化数字'
    },
    {
      label: '货币格式化',
      value: priceFormatter.single(sampleData.price),
      description: '使用本地货币符号和格式'
    },
    {
      label: '价格范围',
      value: priceFormatter.range(sampleData.priceRange.min, sampleData.priceRange.max),
      description: '价格区间显示'
    },
    {
      label: '百分比',
      value: formatters.percent(sampleData.percentage),
      description: '百分比格式化'
    },
    {
      label: '文件大小',
      value: formatters.fileSize(sampleData.fileSize),
      description: '字节转换为可读格式'
    },
    {
      label: '紧凑数字',
      value: formatters.compactNumber(sampleData.compactNumber),
      description: '大数字的紧凑显示'
    },
    {
      label: '日期（短）',
      value: formatters.dateShort(sampleData.date),
      description: '短格式日期'
    },
    {
      label: '日期（长）',
      value: formatters.dateLong(sampleData.date),
      description: '长格式日期，包含星期'
    },
    {
      label: '相对时间',
      value: formatters.relativeTime(sampleData.pastDate),
      description: '相对当前时间的描述'
    },
    {
      label: '日期范围',
      value: dateRangeFormatter.short(sampleData.dateRange.start, sampleData.dateRange.end),
      description: '日期区间格式化'
    },
    {
      label: '当前语言',
      value: formatters.locale,
      description: '当前语言环境代码'
    }
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>本地化格式化演示</CardTitle>
        <CardDescription>
          展示不同数据类型在当前语言环境下的格式化效果
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((example, index) => (
            <div
              key={index}
              className="rounded-lg border p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {example.label}
                </Badge>
              </div>
              <div className="font-mono text-sm font-medium">
                {example.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {example.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">使用示例</h4>
          <pre className="text-xs overflow-x-auto">
            <code>
{`// 在组件中使用
const formatters = useFormatters()
const priceFormatter = usePriceFormatter()

// 格式化价格
const price = priceFormatter.single(299.99)

// 格式化数字
const views = formatters.compactNumber(15000)

// 格式化日期
const publishDate = formatters.dateShort(new Date())`}
            </code>
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}