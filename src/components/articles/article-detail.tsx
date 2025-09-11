'use client';

import Image from 'next/image';
import Link from 'next/link';

import { PortableText } from '@portabletext/react';
import {
  CalendarDays,
  Clock,
  User,
  Tag,
  Star,
  Share2,
  BookOpen,
  ArrowLeft,
  Eye,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useFormatters } from '@/hooks/use-formatters';
import type { Locale } from '@/i18n';
import { getLocalizedValue, getLocalizedRichText } from '@/lib/sanity-i18n';
import { cn } from '@/lib/utils';

// 文章详情类型定义
interface ArticleDetail {
  _id: string
  slug: { current: string }
  title: Record<Locale, string>
  excerpt: Record<Locale, string>
  content: Record<Locale, any[]>
  image: {
    asset: any
    alt: string
    caption?: string
  }
  author: {
    name: string
    slug: { current: string }
    image?: { asset: any }
    bio?: Record<Locale, string>
  }
  category: {
    title: Record<Locale, string>
    slug: { current: string }
    color?: string
  }
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  readTime: number
  publishedAt: string
  isFeatured: boolean
  relatedProducts?: Array<{
    _id: string
    name: Record<Locale, string>
    slug: { current: string }
    image?: { asset: any }
  }>
  // 文章统计
  views?: number
  likes?: number
  comments?: number
}

// 相关文章类型
interface RelatedArticle {
  _id: string
  slug: { current: string }
  title: Record<Locale, string>
  excerpt: Record<Locale, string>
  image?: { asset: any; alt: string }
  author: { name: string }
  readTime: number
  publishedAt: string
}

interface ArticleDetailProps {
  article: ArticleDetail
  relatedArticles?: RelatedArticle[]
  locale: Locale
  onShare?: () => void
  onLike?: () => void
  className?: string
}

// Portable Text 组件配置
const portableTextComponents = {
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <Image
          src={value.asset.url}
          alt={value.alt || ''}
          width={800}
          height={600}
          className="rounded-lg w-full h-auto"
        />
        {value.caption && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            {value.caption}
          </p>
        )}
      </div>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <Link
        href={value.href}
        className="text-primary hover:underline"
        target={value.blank ? '_blank' : '_self'}
        rel={value.blank ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    ),
    code: ({ children }: any) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-medium mt-5 mb-2">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-medium mt-4 mb-2">{children}</h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="mb-4 leading-7">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
    ),
  },
};

export function ArticleDetail({
  article,
  relatedArticles = [],
  locale,
  onShare,
  onLike,
  className
}: ArticleDetailProps) {
  const t = useTranslations('articles');
  const { dateShort } = useFormatters();

  const title = getLocalizedValue(article.title, locale);
  const excerpt = getLocalizedValue(article.excerpt, locale);
  const content = getLocalizedRichText(article.content, locale);
  const categoryTitle = getLocalizedValue(article.category.title, locale);
  const authorBio = article.author.bio ? getLocalizedValue(article.author.bio, locale) : '';

  // 难度级别映射
  const difficultyMap = {
    beginner: { label: t('difficulty.beginner'), color: 'bg-green-100 text-green-800' },
    intermediate: { label: t('difficulty.intermediate'), color: 'bg-blue-100 text-blue-800' },
    advanced: { label: t('difficulty.advanced'), color: 'bg-orange-100 text-orange-800' },
    expert: { label: t('difficulty.expert'), color: 'bg-red-100 text-red-800' }
  };

  return (
    <div className={className}>
      {/* 返回按钮 */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/articles">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToArticles')}
          </Link>
        </Button>
      </div>

      {/* 文章头部 */}
      <Card className="mb-8">
        <CardHeader>
          {/* 分类和难度标签 */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge
              variant="outline"
              style={{
                borderColor: article.category.color,
                color: article.category.color
              }}
            >
              {categoryTitle}
            </Badge>
            <Badge className={cn(difficultyMap[article.difficulty].color)}>
              {difficultyMap[article.difficulty].label}
            </Badge>
            {article.isFeatured && (
              <Badge className="bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                {t('featured')}
              </Badge>
            )}
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} {t('minRead')}
            </Badge>
          </div>

          {/* 标题和摘要 */}
          <CardTitle className="text-3xl md:text-4xl font-bold leading-tight">
            {title}
          </CardTitle>

          {excerpt && (
            <CardDescription className="text-lg mt-4">
              {excerpt}
            </CardDescription>
          )}

          {/* 作者信息和发布日期 */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center gap-4">
              {article.author.image?.asset && (
                <Image
                  src={article.author.image.asset.url}
                  alt={article.author.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <Link
                    href={`/authors/${article.author.slug.current}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {article.author.name}
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <CalendarDays className="w-4 h-4" />
                  {dateShort(new Date(article.publishedAt))}
                </div>
              </div>
            </div>

            {/* 文章统计和操作 */}
            <div className="flex items-center gap-4">
              {article.views && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  {article.views}
                </div>
              )}
              {article.likes && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLike}
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {article.likes}
                </Button>
              )}
              {article.comments && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  {article.comments}
                </div>
              )}
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 className="w-4 h-4 mr-2" />
                {t('share')}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* 封面图片 */}
        {article.image?.asset && (
          <div className="px-6 pb-6">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={article.image.asset.url}
                alt={article.image.alt || title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {article.image.caption && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                {article.image.caption}
              </p>
            )}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 主要内容 */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="pt-6">
              {/* 文章内容 */}
              <div className="prose prose-slate max-w-none">
                <PortableText
                  value={content}
                  components={portableTextComponents}
                />
              </div>

              {/* 标签 */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {t('tags')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 作者简介 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('aboutAuthor')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                {article.author.image?.asset && (
                  <Image
                    src={article.author.image.asset.url}
                    alt={article.author.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h4 className="font-medium">{article.author.name}</h4>
                  {authorBio && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {authorBio}
                    </p>
                  )}
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href={`/authors/${article.author.slug.current}`}>
                      {t('viewProfile')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 相关产品 */}
          {article.relatedProducts && article.relatedProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('relatedProducts')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {article.relatedProducts.slice(0, 3).map((product) => (
                    <div key={product._id} className="flex items-center gap-3">
                      {product.image?.asset && (
                        <Image
                          src={product.image.asset.url}
                          alt={getLocalizedValue(product.name, locale)}
                          width={40}
                          height={40}
                          className="rounded"
                        />
                      )}
                      <div>
                        <Link
                          href={`/products/${product.slug.current}`}
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          {getLocalizedValue(product.name, locale)}
                        </Link>
                      </div>
                    </div>
                  ))}
                  {article.relatedProducts.length > 3 && (
                    <Button variant="outline" size="sm" className="w-full">
                      {t('viewMore')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 目录（如果内容很长） */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {t('tableOfContents')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {/* 这里可以根据文章内容自动生成目录 */}
                <p className="text-muted-foreground">
                  {t('tocWillBeGenerated')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 相关文章 */}
      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <Separator className="mb-8" />
          <h3 className="text-2xl font-bold mb-6">{t('relatedArticles')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.slice(0, 3).map((relatedArticle) => (
              <Card key={relatedArticle._id} className="group hover:shadow-lg transition-all duration-300">
                {relatedArticle.image?.asset && (
                  <div className="relative aspect-video">
                    <Image
                      src={relatedArticle.image.asset.url}
                      alt={relatedArticle.image.alt || getLocalizedValue(relatedArticle.title, locale)}
                      fill
                      className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/articles/${relatedArticle.slug.current}`}>
                      {getLocalizedValue(relatedArticle.title, locale)}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {getLocalizedValue(relatedArticle.excerpt, locale)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{relatedArticle.author.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {relatedArticle.readTime} min
                      </span>
                      <span>{dateShort(new Date(relatedArticle.publishedAt))}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
