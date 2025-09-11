import { Locale } from '@/i18n';

// RTL语言列表
export const rtlLanguages: Locale[] = ['ar'];

/**
 * 检查语言是否为RTL
 */
export function isRTL(locale: string): boolean {
  return rtlLanguages.includes(locale as Locale);
}

/**
 * 获取语言方向
 */
export function getDirection(locale: string): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}

/**
 * RTL样式工具函数
 */
export const rtlUtils = {
  /**
   * 根据语言方向返回对应的边距类
   */
  marginStart: (locale: string, className: string) =>
    isRTL(locale) ? className.replace('ml-', 'mr-') : className,

  marginEnd: (locale: string, className: string) =>
    isRTL(locale) ? className.replace('mr-', 'ml-') : className,

  paddingStart: (locale: string, className: string) =>
    isRTL(locale) ? className.replace('pl-', 'pr-') : className,

  paddingEnd: (locale: string, className: string) =>
    isRTL(locale) ? className.replace('pr-', 'pl-') : className,

  textAlign: (locale: string) =>
    isRTL(locale) ? 'text-right' : 'text-left',

  flexDirection: (locale: string, reverse: boolean = false) =>
    isRTL(locale)
      ? (reverse ? 'flex-row' : 'flex-row-reverse')
      : (reverse ? 'flex-row-reverse' : 'flex-row'),
};
