import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // 支持的语言列表
  locales,
  
  // 默认语言
  defaultLocale: 'zh-CN',
  
  // 语言检测策略
  localeDetection: true,
  
  // 路径前缀策略
  localePrefix: 'always' // 所有语言都需要前缀
});

export const config = {
  // 匹配除了API、静态文件、admin、studio等之外的所有路径
  matcher: ['/((?!api|_next|_vercel|admin|studio|.*\\..*).*)']
};