'use client';

import { useLocale } from 'next-intl';

import { Locale } from '@/i18n';
import {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatDateShort,
  formatDateLong,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatFileSize,
  formatCompactNumber,
} from '@/lib/formatters';

/**
 * 本地化格式化钩子
 * 提供各种格式化函数，自动使用当前语言环境
 */
export function useFormatters() {
  const locale = useLocale() as Locale;

  return {
    // 数字格式化
    number: (value: number) => formatNumber(value, locale),

    // 货币格式化
    currency: (value: number, currency?: string) => formatCurrency(value, locale, currency),

    // 百分比格式化
    percent: (value: number, decimals?: number) => formatPercent(value, locale, decimals),

    // 日期格式化
    dateShort: (date: Date) => formatDateShort(date, locale),
    dateLong: (date: Date) => formatDateLong(date, locale),
    time: (date: Date, includeSeconds?: boolean) => formatTime(date, locale, includeSeconds),
    dateTime: (date: Date) => formatDateTime(date, locale),
    relativeTime: (date: Date) => formatRelativeTime(date, locale),

    // 文件大小格式化
    fileSize: (bytes: number) => formatFileSize(bytes, locale),

    // 紧凑数字格式化
    compactNumber: (value: number) => formatCompactNumber(value, locale),

    // 获取当前语言环境
    locale,
  };
}

/**
 * 价格范围格式化钩子
 */
export function usePriceFormatter() {
  const { currency, number } = useFormatters();

  return {
    // 单个价格
    single: (price: number, currencyCode?: string) => currency(price, currencyCode),

    // 价格范围
    range: (minPrice: number, maxPrice: number, currencyCode?: string) => {
      if (minPrice === maxPrice) {
        return currency(minPrice, currencyCode);
      }
      return `${currency(minPrice, currencyCode)} - ${currency(maxPrice, currencyCode)}`;
    },

    // 起价（从...起）
    startingFrom: (price: number, currencyCode?: string) => {
      // 这里需要从翻译文件获取"从"的翻译
      return `${currency(price, currencyCode)}+`;
    },

    // 数量 x 单价
    quantity: (qty: number, unitPrice: number, currencyCode?: string) => {
      return `${number(qty)} × ${currency(unitPrice, currencyCode)} = ${currency(qty * unitPrice, currencyCode)}`;
    }
  };
}

/**
 * 日期范围格式化钩子
 */
export function useDateRangeFormatter() {
  const { dateShort, dateLong } = useFormatters();

  return {
    // 短格式日期范围
    short: (startDate: Date, endDate: Date) => {
      return `${dateShort(startDate)} - ${dateShort(endDate)}`;
    },

    // 长格式日期范围
    long: (startDate: Date, endDate: Date) => {
      return `${dateLong(startDate)} - ${dateLong(endDate)}`;
    },

    // 同月日期范围优化显示
    optimized: (startDate: Date, endDate: Date) => {
      const sameMonth = startDate.getMonth() === endDate.getMonth() &&
                       startDate.getFullYear() === endDate.getFullYear();

      if (sameMonth) {
        const start = startDate.getDate();
        const end = endDate.getDate();
        const month = dateShort(startDate).replace(start.toString(), '');
        return `${start}-${end}${month}`;
      }

      return `${dateShort(startDate)} - ${dateShort(endDate)}`;
    }
  };
}
