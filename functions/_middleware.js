// Cloudflare Pages Function - 处理根路径重定向
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // 如果是根路径，返回重定向页面
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const html = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LiTong Electronics - 力通电子</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
            color: white; padding: 20px;
        }
        .container { 
            text-align: center; max-width: 600px; width: 100%;
            background: rgba(255,255,255,0.1); backdrop-filter: blur(20px);
            border-radius: 24px; padding: 3rem 2rem; 
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .logo { font-size: 2.8rem; margin-bottom: 0.5rem; font-weight: 200; }
        .chinese { font-size: 2rem; margin-bottom: 1rem; font-weight: 300; }
        .tagline { font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.9; }
        .loading { 
            display: inline-flex; align-items: center; justify-content: center;
            margin: 2rem 0; font-size: 1.1rem; font-weight: 500;
        }
        .spinner { 
            width: 24px; height: 24px; margin-right: 12px;
            border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; 
            border-top-color: #fff; animation: spin 1s linear infinite; 
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .links { 
            display: grid; grid-template-columns: repeat(2, 1fr);
            gap: 1rem; margin-top: 2rem;
        }
        .link { 
            color: white; text-decoration: none; padding: 1rem;
            border: 2px solid rgba(255,255,255,0.3); border-radius: 30px;
            background: rgba(255,255,255,0.1); font-weight: 600;
            transition: all 0.3s ease; display: block;
        }
        .link:hover { 
            background: rgba(255,255,255,0.2); 
            transform: translateY(-2px);
        }
        .primary { 
            background: rgba(255,255,255,0.2); 
            grid-column: 1 / -1;
        }
        .status { 
            margin-top: 2rem; font-size: 0.8rem; opacity: 0.8; 
            padding: 0.5rem; background: rgba(0,255,0,0.1); 
            border-radius: 10px; border: 1px solid rgba(0,255,0,0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">LiTong Electronics</div>
        <div class="chinese">力通电子</div>
        <div class="tagline">专业电子元件代理商 · 正品原装现货</div>
        
        <div class="loading">
            <div class="spinner"></div>
            正在跳转到中文网站...
        </div>
        
        <div class="links">
            <a href="/zh/" class="link primary">进入中文网站</a>
            <a href="/en/" class="link">English Site</a>
            <a href="/ja/" class="link">日本語サイト</a>
            <a href="/ko/" class="link">한국어 사이트</a>
        </div>
        
        <div class="status">
            ✅ Pages Function 修复完成！<br>
            🕒 ${new Date().toLocaleString('zh-CN')}
        </div>
    </div>
    
    <script>
        setTimeout(() => {
            window.location.href = '/zh/';
        }, 2500);
    </script>
</body>
</html>`;
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });
  }
  
  // 其他请求继续正常处理
  return context.next();
}