'use client';

import { useEffect } from 'react';

export default function RootPage() {
  useEffect(() => {
    // 获取浏览器语言偏好
    const userLang = navigator.language || (navigator as any).userLanguage;
    const supportedLangs = ['zh', 'en', 'ja', 'ko', 'ru', 'vi', 'fr', 'de', 'it', 'tr', 'ar'];
    const defaultLang = 'zh';
    let targetLang = defaultLang;
    
    // 尝试匹配用户语言
    if (userLang) {
      const langCode = userLang.toLowerCase().split('-')[0];
      if (supportedLangs.indexOf(langCode) !== -1) {
        targetLang = langCode;
      }
    }
    
    // 重定向到对应语言页面
    window.location.replace(`/${targetLang}/`);
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
          LiTong Electronics
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1rem' }}>
          力通电子 - 专业电子元件代理商
        </p>
        <p style={{ fontSize: '0.9rem', color: '#888' }}>
          Redirecting to your language...
        </p>
        <div style={{ marginTop: '2rem' }}>
          <a href="/zh/" style={{ margin: '0 10px', color: '#007bff', textDecoration: 'none' }}>中文</a>
          <a href="/en/" style={{ margin: '0 10px', color: '#007bff', textDecoration: 'none' }}>English</a>
          <a href="/ja/" style={{ margin: '0 10px', color: '#007bff', textDecoration: 'none' }}>日本語</a>
        </div>
      </div>
    </div>
  );
}