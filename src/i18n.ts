import { notFound } from 'next/navigation';

import { getRequestConfig } from 'next-intl/server';

// 支持的语言列表
export const locales = [
  'zh-CN', // 简体中文 (默认)
  'zh-TW', // 繁体中文
  'en',    // 英语
  'ja',    // 日语
  'ko',    // 韩语
  'de',    // 德语
  'fr',    // 法语
  'es',    // 西班牙语
  'ru',    // 俄语
  'ar',    // 阿拉伯语
] as const;

export type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale }) => {
  // 验证传入的语言是否受支持
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
