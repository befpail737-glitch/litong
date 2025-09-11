import Link from 'next/link';

import {
  Cpu,
  Zap,
  Radio,
  Gauge,
  Settings,
  Shield,
  Battery,
  Wifi,
  ChevronRight,
  TrendingUp,
  Star,
  Package
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// 产品大分类数据
const productCategories = [
  {
    id: 'microcontrollers',
    name: '微控制器',
    slug: 'microcontrollers',
    icon: Cpu,
    description: '8位、16位、32位微控制器，ARM Cortex-M系列，RISC-V架构等',
    productCount: 12580,
    brandCount: 25,
    features: ['低功耗设计', 'IoT应用', '实时控制', '丰富外设'],
    applications: ['工业控制', '汽车电子', '消费电子', '物联网'],
    subcategories: [
      { name: '8位MCU', count: 2450 },
      { name: '16位MCU', count: 1890 },
      { name: '32位MCU', count: 6780 },
      { name: 'ARM Cortex-M', count: 4560 },
      { name: 'RISC-V MCU', count: 890 }
    ],
    isHot: true,
    growth: '+15%'
  },
  {
    id: 'power-management',
    name: '电源管理',
    slug: 'power-management',
    icon: Battery,
    description: 'LDO、DC-DC转换器、电池管理、电源监控等电源管理芯片',
    productCount: 8920,
    brandCount: 18,
    features: ['高效转换', '低静态功耗', '宽输入范围', '过载保护'],
    applications: ['移动设备', '工业电源', '汽车电子', '通信设备'],
    subcategories: [
      { name: 'LDO稳压器', count: 2340 },
      { name: 'DC-DC转换器', count: 3210 },
      { name: '电池管理', count: 1890 },
      { name: '电源监控', count: 780 },
      { name: '充电管理', count: 700 }
    ],
    isHot: true,
    growth: '+22%'
  },
  {
    id: 'analog-ic',
    name: '模拟IC',
    slug: 'analog-ic',
    icon: Gauge,
    description: '运算放大器、比较器、ADC、DAC、模拟开关等模拟集成电路',
    productCount: 15640,
    brandCount: 32,
    features: ['高精度', '低噪声', '宽带宽', '低失真'],
    applications: ['精密测量', '音频处理', '信号调理', '数据采集'],
    subcategories: [
      { name: '运算放大器', count: 4560 },
      { name: 'ADC转换器', count: 3890 },
      { name: 'DAC转换器', count: 2340 },
      { name: '比较器', count: 2180 },
      { name: '模拟开关', count: 2670 }
    ],
    isHot: false,
    growth: '+8%'
  },
  {
    id: 'sensors',
    name: '传感器',
    slug: 'sensors',
    icon: Radio,
    description: '温湿度传感器、压力传感器、光学传感器、MEMS传感器等',
    productCount: 6780,
    brandCount: 28,
    features: ['高灵敏度', '低功耗', '小封装', '宽温度范围'],
    applications: ['环境监测', '工业自动化', '智能家居', '可穿戴设备'],
    subcategories: [
      { name: '温湿度传感器', count: 1890 },
      { name: '压力传感器', count: 1450 },
      { name: '光学传感器', count: 1230 },
      { name: 'MEMS传感器', count: 1560 },
      { name: '气体传感器', count: 650 }
    ],
    isHot: true,
    growth: '+28%'
  },
  {
    id: 'wireless-connectivity',
    name: '无线连接',
    slug: 'wireless-connectivity',
    icon: Wifi,
    description: 'WiFi、蓝牙、Zigbee、LoRa、NB-IoT等无线通信芯片',
    productCount: 3450,
    brandCount: 15,
    features: ['低功耗', '远距离', '高速率', '多协议'],
    applications: ['物联网', '智能家居', '工业互联', '资产追踪'],
    subcategories: [
      { name: 'WiFi芯片', count: 890 },
      { name: '蓝牙芯片', count: 1230 },
      { name: 'Zigbee芯片', count: 560 },
      { name: 'LoRa芯片', count: 450 },
      { name: 'NB-IoT芯片', count: 320 }
    ],
    isHot: true,
    growth: '+35%'
  },
  {
    id: 'interface-ic',
    name: '接口IC',
    slug: 'interface-ic',
    icon: Settings,
    description: 'USB控制器、以太网PHY、CAN收发器、RS485驱动器等接口芯片',
    productCount: 4890,
    brandCount: 22,
    features: ['高速传输', '抗干扰', '标准兼容', '易集成'],
    applications: ['通信设备', '工业控制', '汽车电子', '计算机外设'],
    subcategories: [
      { name: 'USB控制器', count: 1340 },
      { name: '以太网PHY', count: 890 },
      { name: 'CAN收发器', count: 1120 },
      { name: 'RS485驱动器', count: 780 },
      { name: 'I2C/SPI接口', count: 760 }
    ],
    isHot: false,
    growth: '+12%'
  },
  {
    id: 'protection-ic',
    name: '保护IC',
    slug: 'protection-ic',
    icon: Shield,
    description: 'ESD保护、TVS管、过压保护、过流保护等电路保护器件',
    productCount: 2890,
    brandCount: 18,
    features: ['快速响应', '低钳位电压', '大通流能力', '小封装'],
    applications: ['消费电子', '通信设备', '汽车电子', '工业设备'],
    subcategories: [
      { name: 'ESD保护器', count: 890 },
      { name: 'TVS管', count: 670 },
      { name: '过压保护', count: 560 },
      { name: '过流保护', count: 450 },
      { name: '浪涌保护', count: 320 }
    ],
    isHot: false,
    growth: '+6%'
  },
  {
    id: 'passive-components',
    name: '无源器件',
    slug: 'passive-components',
    icon: Package,
    description: '电阻、电容、电感、晶振、滤波器等无源电子元件',
    productCount: 25670,
    brandCount: 45,
    features: ['高精度', '低温漂', '长寿命', '宽频响应'],
    applications: ['所有电子设备', '信号处理', '电源滤波', '时钟产生'],
    subcategories: [
      { name: '贴片电阻', count: 8900 },
      { name: '贴片电容', count: 7800 },
      { name: '功率电感', count: 3450 },
      { name: '晶体振荡器', count: 2890 },
      { name: '陶瓷滤波器', count: 2630 }
    ],
    isHot: false,
    growth: '+3%'
  }
];

export default function CategoriesPage() {
  const hotCategories = productCategories.filter(cat => cat.isHot);
  const otherCategories = productCategories.filter(cat => !cat.isHot);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面头部 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          产品分类
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          力通电子提供全系列电子元器件产品，涵盖微控制器、电源管理、模拟IC、传感器等八大类别，
          超过80,000种产品型号，满足各行业的设计需求。
        </p>
      </div>

      {/* 统计概览 */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="text-center p-6 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {productCategories.length}
          </div>
          <p className="text-blue-700 font-medium">产品大类</p>
        </div>
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {productCategories.reduce((sum, cat) => sum + cat.productCount, 0).toLocaleString()}+
          </div>
          <p className="text-green-700 font-medium">产品型号</p>
        </div>
        <div className="text-center p-6 bg-purple-50 rounded-lg">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {Math.max(...productCategories.map(cat => cat.brandCount))}+
          </div>
          <p className="text-purple-700 font-medium">合作品牌</p>
        </div>
        <div className="text-center p-6 bg-orange-50 rounded-lg">
          <div className="text-3xl font-bold text-orange-600 mb-2">24h</div>
          <p className="text-orange-700 font-medium">快速交付</p>
        </div>
      </div>

      {/* 热门分类 */}
      {hotCategories.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">热门分类</h2>
            <Badge className="bg-yellow-100 text-yellow-800">高增长</Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {hotCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{category.name}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{category.productCount.toLocaleString()} 产品</span>
                            <span>{category.brandCount} 品牌</span>
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="h-3 w-3" />
                              <span>{category.growth}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">产品特性</h4>
                      <div className="flex flex-wrap gap-1">
                        {category.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">主要应用</h4>
                      <div className="flex flex-wrap gap-1">
                        {category.applications.map((app) => (
                          <Badge key={app} variant="outline" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">子分类</h4>
                      <div className="space-y-1">
                        {category.subcategories.slice(0, 3).map((sub) => (
                          <div key={sub.name} className="flex justify-between text-xs">
                            <span className="text-gray-600">{sub.name}</span>
                            <span className="text-gray-500">{sub.count}</span>
                          </div>
                        ))}
                        {category.subcategories.length > 3 && (
                          <div className="text-xs text-blue-600">
                            +{category.subcategories.length - 3} 更多分类
                          </div>
                        )}
                      </div>
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/categories/${category.slug}`}>
                        浏览 {category.name}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* 全部分类 */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Package className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">全部分类</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{category.productCount.toLocaleString()}</span>
                          <span>{category.brandCount} 品牌</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {category.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/categories/${category.slug}`}>
                      浏览分类
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 底部行动号召 */}
      <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          找不到合适的产品分类？
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          我们的专业团队拥有丰富的行业经验，能够为您提供定制化的产品推荐和技术支持。
          无论您的项目需求多么特殊，我们都能为您找到最合适的解决方案。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/inquiry">
              产品询价
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">
              联系专家
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// SEO元数据
export const metadata = {
  title: '产品分类 - 电子元器件产品大全 | 力通电子',
  description: '力通电子产品分类涵盖微控制器、电源管理IC、模拟IC、传感器、无线连接等八大类别，超过80,000种电子元器件型号，原装正品现货供应。',
  keywords: '电子元器件分类,微控制器,电源管理IC,模拟IC,传感器,无线连接,接口IC,保护IC,无源器件,芯片现货',
};
