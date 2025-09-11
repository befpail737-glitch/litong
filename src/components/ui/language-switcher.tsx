'use client';

import { useState, useTransition } from 'react';

import { useRouter, usePathname } from 'next/navigation';

import { Globe, Check } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { locales, type Locale } from '@/i18n';
import { isRTL } from '@/lib/rtl';
import { cn } from '@/lib/utils';

const languageNames: Record<Locale, string> = {
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
};

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'button'
  showLabel?: boolean
}

export function LanguageSwitcher({
  variant = 'dropdown',
  showLabel = true
}: LanguageSwitcherProps) {
  const t = useTranslations('common');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // 移除当前语言前缀（如果存在）
      const cleanPathname = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '/';

      // 构建新的URL
      const newUrl = newLocale === 'zh-CN'
        ? cleanPathname  // 默认语言不需要前缀
        : `/${newLocale}${cleanPathname}`;

      router.replace(newUrl);
      setIsOpen(false);
    });
  };

  if (variant === 'button') {
    return (
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isPending}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {showLabel && (
            <span className="hidden sm:inline">
              {languageNames[locale]}
            </span>
          )}
        </Button>

        {isOpen && (
          <div className={cn(
            'absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50',
            isRTL(locale) ? 'left-0' : 'right-0'
          )}>
            <div className="py-1">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLanguageChange(loc)}
                  className={cn(
                    'flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100',
                    isRTL(loc) ? 'text-right' : 'text-left'
                  )}
                  disabled={isPending}
                  dir={isRTL(loc) ? 'rtl' : 'ltr'}
                >
                  <span style={{ fontFamily: isRTL(loc) ? 'Arial, sans-serif' : 'inherit' }}>
                    {languageNames[loc]}
                  </span>
                  {locale === loc && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 点击外部关闭下拉菜单 */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  // 下拉选择器变体
  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <Globe className="h-4 w-4 text-gray-500" />
      )}
      <Select
        value={locale}
        onValueChange={handleLanguageChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-auto border-none shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              <div className="flex items-center gap-2">
                <span>{languageNames[loc]}</span>
                {locale === loc && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
