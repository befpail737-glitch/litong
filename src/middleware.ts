// 临时禁用中间件以支持静态导出
// import createMiddleware from 'next-intl/middleware';
// import { locales } from './i18n';

// export default createMiddleware({
//   // 支持的语言列表
//   locales,
//   // 默认语言
//   defaultLocale: 'zh-CN',
//   // 禁用语言检测以支持静态导出
//   localeDetection: false,
//   // 路径前缀策略 - 总是使用前缀以确保静态导出兼容性
//   localePrefix: 'always'
// });

export const config = {
  // 空匹配器以禁用中间件
  matcher: []
};
