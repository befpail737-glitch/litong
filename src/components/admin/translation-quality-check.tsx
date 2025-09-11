'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  BarChart3,
  Languages,
  FileText,
  RefreshCw
} from 'lucide-react'
import { TranslationValidator, TranslationIssue, TranslationStats, validationRules } from '@/lib/translation-validator'
import { LocalizedString } from '@/lib/sanity-i18n'
import { locales } from '@/i18n'

interface TranslationQualityCheckProps {
  data: Record<string, LocalizedString>
  entityName?: string
  onRefresh?: () => void
  className?: string
}

export function TranslationQualityCheck({ 
  data, 
  entityName = '内容',
  onRefresh,
  className 
}: TranslationQualityCheckProps) {
  const validator = new TranslationValidator()
  
  // 使用预设规则验证数据
  const rules = {
    title: validationRules.productName,
    description: validationRules.productDescription,
    seoTitle: validationRules.seoTitle,
    seoDescription: validationRules.seoDescription,
  }
  
  const stats = validator.validateMultipleFields(data, rules)

  // 按严重程度分组问题
  const groupedIssues = {
    error: stats.issues.filter(issue => issue.severity === 'error'),
    warning: stats.issues.filter(issue => issue.severity === 'warning'),
    info: stats.issues.filter(issue => issue.severity === 'info'),
  }

  // 按语言分组问题
  const issuesByLocale = locales.reduce((acc, locale) => {
    acc[locale] = stats.issues.filter(issue => issue.locale === locale)
    return acc
  }, {} as Record<string, TranslationIssue[]>)

  // 获取完成度最低的语言
  const localeCompleteness = locales.map(locale => {
    const totalFields = Object.keys(data).length
    const translatedFields = Object.values(data).filter(field => field?.[locale]?.trim()).length
    const completionRate = totalFields > 0 ? (translatedFields / totalFields) * 100 : 0
    
    return {
      locale,
      completionRate,
      translatedFields,
      totalFields,
    }
  }).sort((a, b) => a.completionRate - b.completionRate)

  const getSeverityIcon = (severity: TranslationIssue['severity']) => {
    switch (severity) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: TranslationIssue['severity']) => {
    switch (severity) {
      case 'error':
        return 'destructive'
      case 'warning':
        return 'default'
      case 'info':
        return 'secondary'
    }
  }

  const getLocaleDisplayName = (locale: string) => {
    const localeNames: Record<string, string> = {
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      'en': 'English',
      'ja': '日本語',
      'ko': '한국어',
      'de': 'Deutsch',
      'fr': 'Français',
      'es': 'Español',
      'ru': 'Русский',
      'ar': 'العربية'
    }
    return localeNames[locale] || locale
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                翻译质量检查 - {entityName}
              </CardTitle>
              <CardDescription>
                检查翻译完整性和质量问题
              </CardDescription>
            </div>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* 总览统计 */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  总体完成度
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</div>
                <Progress value={stats.completionRate} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.translatedFields} / {stats.totalFields} 个字段已翻译
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  严重问题
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-2xl font-bold text-red-600">
                  {groupedIssues.error.length}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  需要立即修复
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  警告
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-2xl font-bold text-yellow-600">
                  {groupedIssues.warning.length}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  建议修复
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 详细信息标签页 */}
          <Tabs defaultValue="issues" className="w-full">
            <TabsList>
              <TabsTrigger value="issues">问题详情</TabsTrigger>
              <TabsTrigger value="languages">语言完成度</TabsTrigger>
              <TabsTrigger value="summary">总结建议</TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="space-y-4">
              {stats.issues.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>恭喜！</AlertTitle>
                  <AlertDescription>
                    没有发现翻译质量问题。所有翻译都符合标准。
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {stats.issues.map((issue, index) => (
                    <Alert key={index} variant={issue.severity === 'error' ? 'destructive' : 'default'}>
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1 space-y-1">
                          <AlertTitle className="text-sm">
                            <Badge variant={getSeverityColor(issue.severity)} className="mr-2">
                              {getLocaleDisplayName(issue.locale)}
                            </Badge>
                            {issue.field}
                          </AlertTitle>
                          <AlertDescription className="text-sm">
                            {issue.message}
                            {issue.suggestion && (
                              <div className="mt-1 text-xs italic text-muted-foreground">
                                建议: {issue.suggestion}
                              </div>
                            )}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="languages" className="space-y-4">
              <div className="grid gap-4">
                {localeCompleteness.map(({ locale, completionRate, translatedFields, totalFields }) => (
                  <Card key={locale}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{getLocaleDisplayName(locale)}</span>
                        <span className="text-sm text-muted-foreground">
                          {translatedFields} / {totalFields}
                        </span>
                      </div>
                      <Progress value={completionRate} className="mb-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {completionRate.toFixed(1)}%
                        </span>
                        {issuesByLocale[locale].length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {issuesByLocale[locale].length} 个问题
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <div className="space-y-4">
                {stats.completionRate === 100 && stats.issues.length === 0 && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>翻译质量优秀</AlertTitle>
                    <AlertDescription>
                      所有语言的翻译都已完成，且没有发现质量问题。
                    </AlertDescription>
                  </Alert>
                )}

                {groupedIssues.error.length > 0 && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>需要立即处理的问题</AlertTitle>
                    <AlertDescription>
                      发现 {groupedIssues.error.length} 个严重问题，可能影响内容显示或SEO效果。
                      请优先修复这些问题。
                    </AlertDescription>
                  </Alert>
                )}

                {stats.completionRate < 50 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>翻译完成度较低</AlertTitle>
                    <AlertDescription>
                      当前翻译完成度为 {stats.completionRate.toFixed(1)}%，
                      建议优先完成主要语言（英语、繁体中文、日语、韩语）的翻译。
                    </AlertDescription>
                  </Alert>
                )}

                {localeCompleteness[0].completionRate === 0 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>优先翻译建议</AlertTitle>
                    <AlertDescription>
                      建议优先翻译 {getLocaleDisplayName(localeCompleteness[0].locale)}，
                      这是完成度最低的语言。
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}