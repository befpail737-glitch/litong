import Link from 'next/link';

import {
  Building2,
  Users,
  Award,
  Globe,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  Target,
  Zap,
  Heart,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              15年专业经验
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              专业的电子元器件
              <br />
              <span className="text-blue-600">供应链服务商</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              力通电子致力于为全球客户提供高品质的电子元器件供应链服务，
              通过专业的技术支持和完善的服务体系，成为您值得信赖的合作伙伴。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild>
                <Link href="/inquiry">
                  立即合作
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/brands">
                  查看品牌
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">年行业经验</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">50,000+</div>
              <div className="text-gray-600">种产品型号</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">10,000+</div>
              <div className="text-gray-600">家客户信赖</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">99.5%</div>
              <div className="text-gray-600">客户满意度</div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
                公司简介
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                深耕电子元器件供应链
                <br />
                服务全球客户
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                力通电子成立于2009年，总部位于深圳，是一家专业的电子元器件供应商。我们专注于为客户提供高品质的电子元器件、
                完善的技术支持和优质的供应链服务。
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                经过15年的发展，我们已经建立了覆盖全球的供应商网络，代理和分销多个知名品牌的产品，
                包括意法半导体、德州仪器、模拟器件、英飞凌等，产品广泛应用于工业控制、汽车电子、
                通信设备、消费电子等领域。
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">原厂授权代理</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">全球供应网络</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">专业技术支持</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">快速交付能力</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8 text-center">
              <Building2 className="mx-auto h-24 w-24 text-blue-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                深圳总部
              </h3>
              <p className="text-gray-600 mb-4">
                广东省深圳市南山区科技园南区高新南七道16号德维森大厦15楼
              </p>
              <p className="text-sm text-gray-500">
                在上海、北京、成都设有分支机构
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100">
              企业价值观
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              我们的核心价值观
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              以客户为中心，以品质为生命，以创新为动力，以诚信为根本。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">客户至上</h3>
                <p className="text-sm text-gray-600">
                  始终以客户需求为导向，提供最优质的产品和服务
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">品质保证</h3>
                <p className="text-sm text-gray-600">
                  严格的质量管控体系，确保每一个产品的可靠性
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">持续创新</h3>
                <p className="text-sm text-gray-600">
                  不断优化服务流程，提升客户体验和服务效率
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">诚信经营</h3>
                <p className="text-sm text-gray-600">
                  坚持诚信为本，建立长期稳定的合作关系
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Advantages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
              竞争优势
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              为什么选择力通电子
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              凭借专业的团队、完善的服务和丰富的经验，为您提供一站式电子元器件采购解决方案。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">全球供应网络</h3>
                <p className="text-gray-600 text-sm">
                  与全球500+原厂建立合作关系，确保供货稳定性和价格优势
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">专业团队</h3>
                <p className="text-gray-600 text-sm">
                  拥有资深的技术和销售团队，提供专业的技术咨询和解决方案
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">快速响应</h3>
                <p className="text-gray-600 text-sm">
                  24小时快速报价，48小时内发货，为您争取宝贵时间
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">品质认证</h3>
                <p className="text-gray-600 text-sm">
                  通过ISO9001质量管理体系认证，确保产品质量可靠
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">成本优化</h3>
                <p className="text-gray-600 text-sm">
                  通过规模采购和供应链优化，为客户提供具有竞争力的价格
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">定制服务</h3>
                <p className="text-gray-600 text-sm">
                  根据客户需求提供定制化的供应链解决方案和技术支持
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              发展历程
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              15年专注 成就专业
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              从初创到行业领先，我们始终专注于电子元器件供应链服务。
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-blue-600">2009</span>
                  <span className="text-gray-500">|</span>
                  <h3 className="text-lg font-semibold text-gray-900">公司成立</h3>
                </div>
                <p className="text-gray-600">
                  在深圳成立力通电子，专注于电子元器件的销售和技术服务，初期主要服务于珠三角地区的电子制造企业。
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-green-600">2012</span>
                  <span className="text-gray-500">|</span>
                  <h3 className="text-lg font-semibold text-gray-900">业务扩展</h3>
                </div>
                <p className="text-gray-600">
                  获得多家知名原厂授权，建立完善的供应链体系，客户群体扩展到全国各地，年销售额突破千万元。
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-purple-600">2016</span>
                  <span className="text-gray-500">|</span>
                  <h3 className="text-lg font-semibold text-gray-900">质量认证</h3>
                </div>
                <p className="text-gray-600">
                  通过ISO9001质量管理体系认证，建立标准化的质量管控流程，在上海设立分公司，进一步扩大市场覆盖。
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-orange-600">2020</span>
                  <span className="text-gray-500">|</span>
                  <h3 className="text-lg font-semibold text-gray-900">数字化转型</h3>
                </div>
                <p className="text-gray-600">
                  投资数字化系统建设，建立在线询价平台，提升服务效率。在北京、成都设立办事处，形成全国服务网络。
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-indigo-600">2024</span>
                  <span className="text-gray-500">|</span>
                  <h3 className="text-lg font-semibold text-gray-900">行业领先</h3>
                </div>
                <p className="text-gray-600">
                  服务客户超过10,000家，产品覆盖50,000+型号，成为行业内知名的电子元器件供应链服务商。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备开始合作了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            让我们的专业团队为您提供最优质的电子元器件供应链服务
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/inquiry">
                <Mail className="h-5 w-5 mr-2" />
                立即询价
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/contact">
                <Phone className="h-5 w-5 mr-2" />
                联系我们
              </Link>
            </Button>
          </div>
          <p className="text-blue-200 mt-6 text-sm">
            <MapPin className="h-4 w-4 inline mr-1" />
            深圳总部 • 全国服务 • 值得信赖
          </p>
        </div>
      </section>
    </div>
  );
}

// SEO元数据
export const metadata = {
  title: '关于我们 - 15年专业电子元器件供应商 | 力通电子',
  description: '力通电子成立于2009年，专注电子元器件供应链服务15年。全球供应网络，专业技术支持，为10,000+客户提供优质服务。',
  keywords: '力通电子,关于我们,电子元器件供应商,供应链服务,深圳电子公司,原厂授权代理',
};
