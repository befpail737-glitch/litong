import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: '产品分类',
      links: [
        { name: '微控制器', href: '/products?category=microcontrollers' },
        { name: '传感器', href: '/products?category=sensors' },
        { name: '电源管理', href: '/products?category=power-management' },
        { name: '模拟IC', href: '/products?category=analog-ic' },
        { name: '数字IC', href: '/products?category=digital-ic' },
        { name: '连接器', href: '/products?category=connectors' },
      ]
    },
    {
      title: '服务支持',
      links: [
        { name: '技术文档', href: '/support/documents' },
        { name: '应用指南', href: '/support/application-notes' },
        { name: '参考设计', href: '/support/reference-designs' },
        { name: '开发工具', href: '/support/development-tools' },
        { name: '培训资料', href: '/support/training' },
        { name: '常见问题', href: '/support/faq' },
      ]
    },
    {
      title: '公司信息',
      links: [
        { name: '关于我们', href: '/about' },
        { name: '企业文化', href: '/about/culture' },
        { name: '发展历程', href: '/about/history' },
        { name: '资质认证', href: '/about/certifications' },
        { name: '招贤纳士', href: '/careers' },
        { name: '新闻动态', href: '/news' },
      ]
    },
    {
      title: '合作伙伴',
      links: [
        { name: '代理品牌', href: '/brands' },
        { name: '授权证书', href: '/certifications' },
        { name: '供应商入驻', href: '/supplier-portal' },
        { name: '渠道合作', href: '/partnerships' },
        { name: '经销商查询', href: '/distributors' },
        { name: 'OEM服务', href: '/oem-services' },
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* 主要内容区域 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* 公司信息 */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">力</span>
              </div>
              <span className="text-xl font-bold text-white">力通电子</span>
            </div>
            <p className="text-sm mb-4">
              专业的电子元器件分销商，为客户提供高品质产品和专业技术服务。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>深圳市福田区华强北</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>400-888-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>info@litong-electronics.com</span>
              </div>
            </div>
          </div>

          {/* 导航链接 */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 社交媒体和二维码 */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">关注我们</h4>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">微信</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">QQ</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">微博</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">抖音</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xs">微信群</span>
                </div>
                <p className="text-xs">扫码加入技术交流群</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xs">公众号</span>
                </div>
                <p className="text-xs">获取最新产品资讯</p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span>© {currentYear} 力通电子. 保留所有权利.</span>
              <Link href="/privacy" className="hover:text-white transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                服务条款
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                网站地图
              </Link>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <span>沪ICP备12345678号</span>
              <span>|</span>
              <span>沪公网安备 31010402000123号</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}