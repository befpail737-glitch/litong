import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 匹配需要处理的路径
export const config = {
  matcher: [
    // 匹配所有路径，但排除静态文件和 API 路由
    '/((?!api|_next/static|_next/image|favicon.ico|static|.*\\..*).*)'
  ],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log(`🔄 Middleware processing: ${pathname}`)

  // Studio 路由处理 - 确保 /studio 不被重定向
  if (pathname === '/studio' || pathname.startsWith('/studio/')) {
    console.log(`🎨 Studio route detected: ${pathname}`)

    // 如果是 /studio（没有尾部斜杠），添加尾部斜杠
    if (pathname === '/studio') {
      const url = request.nextUrl.clone()
      url.pathname = '/studio/'
      console.log(`🔀 Redirecting to: ${url.pathname}`)
      return NextResponse.redirect(url)
    }

    // 对于 /studio/ 和其子路径，直接继续处理
    console.log(`✅ Allowing Studio route: ${pathname}`)
    return NextResponse.next()
  }

  // Admin 路由处理（备用管理路径）
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    console.log(`⚙️ Admin route detected: ${pathname}`)
    return NextResponse.next()
  }

  // API 路由直接通过
  if (pathname.startsWith('/api/')) {
    console.log(`🔌 API route: ${pathname}`)
    return NextResponse.next()
  }

  // 静态资源直接通过
  if (pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // 品牌路由处理（支持中文字符）
  if (pathname.startsWith('/brands/')) {
    console.log(`🏢 Brand route: ${pathname}`)

    // 检查是否为品牌子目录页面
    const brandSubPaths = ['/products', '/solutions', '/support']
    const isBrandSubPath = brandSubPaths.some(subPath => {
      const pattern = new RegExp(`^/brands/[^/]+${subPath}/?$`)
      return pattern.test(pathname)
    })

    if (isBrandSubPath) {
      console.log(`📂 Brand subdirectory route: ${pathname}`)

      // 确保品牌子目录路径有尾部斜杠（如果需要）
      if (!pathname.endsWith('/') && !pathname.includes('?')) {
        const url = request.nextUrl.clone()
        url.pathname = pathname + '/'
        console.log(`🔀 Adding trailing slash: ${pathname} -> ${url.pathname}`)
        return NextResponse.redirect(url)
      }
    }

    return NextResponse.next()
  }

  // 其他路由正常处理
  console.log(`📄 Regular route: ${pathname}`)
  return NextResponse.next()
}