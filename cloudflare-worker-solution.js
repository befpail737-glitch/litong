// Cloudflare Worker解决方案
// 部署到域名：68554fa0.litong-electronics.pages.dev
// 
// 这个Worker将处理根路径404问题

export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // 检查是否是我们的域名（Pages域名或自定义域名）
    if (url.hostname === '68554fa0.litong-electronics.pages.dev' || 
        url.hostname === 'litong-electronics.com' || 
        url.hostname === 'www.litong-electronics.com') {
      
      // 根路径处理 - 显示专业重定向页面
      if (url.pathname === '/' || url.pathname === '/index.html') {
        const html = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LiTong Electronics - 力通电子</title>
    <meta name="description" content="力通电子 - 专业电子元件代理商，提供正品原装现货">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
            color: white; padding: 20px;
        }
        .container { 
            text-align: center; max-width: 700px; width: 100%;
            background: rgba(255,255,255,0.1); backdrop-filter: blur(20px);
            border-radius: 24px; padding: 4rem 2rem; 
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .logo { font-size: 3.2rem; margin-bottom: 0.5rem; font-weight: 200; letter-spacing: -1px; }
        .chinese { font-size: 2.2rem; margin-bottom: 1rem; font-weight: 300; }
        .tagline { font-size: 1.3rem; margin-bottom: 3rem; opacity: 0.9; line-height: 1.6; }
        .loading { 
            display: inline-flex; align-items: center; justify-content: center;
            margin: 2.5rem 0; font-size: 1.2rem; font-weight: 500;
        }
        .spinner { 
            width: 28px; height: 28px; margin-right: 15px;
            border: 4px solid rgba(255,255,255,0.2); border-radius: 50%; 
            border-top-color: #fff; animation: spin 1.2s linear infinite; 
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .links { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 1.2rem; margin-top: 3rem; max-width: 500px; margin-left: auto; margin-right: auto;
        }
        .link { 
            color: white; text-decoration: none; padding: 1.2rem 1.5rem;
            border: 2px solid rgba(255,255,255,0.3); border-radius: 35px;
            background: rgba(255,255,255,0.1); font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 1rem; display: block;
        }
        .link:hover { 
            background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.8);
            transform: translateY(-4px) scale(1.02); 
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        .primary { 
            background: rgba(255,255,255,0.2); 
            font-size: 1.1rem; 
            border-width: 3px;
            grid-column: 1 / -1;
        }
        .stats {
            display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;
            margin: 3rem 0; padding: 2rem; border-radius: 16px;
            background: rgba(255,255,255,0.05);
        }
        .stat { text-align: center; }
        .stat-number { font-size: 1.8rem; font-weight: 700; color: #fbbf24; }
        .stat-label { font-size: 0.9rem; margin-top: 0.5rem; opacity: 0.8; }
        
        @media (max-width: 768px) {
            .container { padding: 3rem 1.5rem; }
            .logo { font-size: 2.5rem; }
            .chinese { font-size: 1.8rem; }
            .tagline { font-size: 1.1rem; }
            .stats { grid-template-columns: 1fr; gap: 1rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">LiTong Electronics</div>
        <div class="chinese">力通电子</div>
        <div class="tagline">专业电子元件代理商<br>正品原装现货 · 技术支持 · 优势价格</div>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-number">20+</div>
                <div class="stat-label">年行业经验</div>
            </div>
            <div class="stat">
                <div class="stat-number">10万+</div>
                <div class="stat-label">现货型号</div>
            </div>
        </div>
        
        <div class="loading">
            <div class="spinner"></div>
            正在跳转到中文网站...
        </div>
        
        <div class="links">
            <a href="/zh/" class="link primary">进入中文网站 Chinese</a>
            <a href="/en/" class="link">English Site</a>
            <a href="/ja/" class="link">日本語サイト</a>
            <a href="/ko/" class="link">한국어 사이트</a>
        </div>
    </div>
    
    <script>
        // 自动重定向
        setTimeout(() => {
            window.location.href = '/zh/';
        }, 3000);
        
        // 点击任何地方也可以跳转
        document.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A') {
                window.location.href = '/zh/';
            }
        });
    </script>
</body>
</html>`;
        
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=300'
          }
        });
      }
    }
    
    // 其他请求继续正常处理
    return fetch(request);
  }
};