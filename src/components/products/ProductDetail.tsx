'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useState } from 'react';

interface ProductDetailProps {
  product: {
    id: string;
    partNumber: string;
    fullName: string;
    brand: string;
    brandSlug: string;
    category: string;
    categoryName: string;
    description: string;
    detailedDescription: string;
    specifications: Record<string, string>;
    features: string[];
    applications: string[];
    pinout?: string;
    blockDiagram?: string;
    package: {
      type: string;
      dimensions: string;
      pitch: string;
      pins: number;
    };
    documents: Array<{
      type: string;
      name: string;
      url: string;
      size: string;
    }>;
    developmentTools: Array<{
      name: string;
      description: string;
      url: string;
    }>;
    relatedProducts: Array<{
      partNumber: string;
      description: string;
      link: string;
    }>;
    pricing: {
      price: string;
      currency: string;
      quantity: number;
      stock: number;
      moq: number;
      leadTime: string;
      priceBreaks: Array<{
        quantity: number;
        price: number;
      }>;
    };
    images: string[];
    videos?: Array<{
      title: string;
      url: string;
      thumbnail: string;
    }>;
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // 根据数量计算价格
  const calculatePrice = (qty: number) => {
    const priceBreak = product.pricing.priceBreaks
      .slice()
      .reverse()
      .find(pb => qty >= pb.quantity);
    return priceBreak ? priceBreak.price : product.pricing.priceBreaks[0].price;
  };

  const currentPrice = calculatePrice(quantity);
  const totalPrice = (currentPrice * quantity).toFixed(2);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Product Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div>
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden mb-4">
              <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-400 mb-2">{product.partNumber}</div>
                  <p className="text-sm text-gray-500">产品图片: {product.images[selectedImage]}</p>
                </div>
              </div>
            </div>
            
            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 bg-gray-100 rounded border-2 flex items-center justify-center text-xs ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center mb-2">
              <Link
                href={`/${locale}/brands/${product.brandSlug}`}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                {product.brand}
              </Link>
              <span className="mx-2 text-gray-400">•</span>
              <Link
                href={`/${locale}/brands/${product.brandSlug}/products/${product.category}`}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                {product.categoryName}
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.partNumber}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {product.description}
            </p>

            {/* Key Specifications */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">主要参数</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">CPU内核</span>
                  <div className="font-semibold">{product.specifications.core}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">主频</span>
                  <div className="font-semibold">{product.specifications.frequency}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Flash</span>
                  <div className="font-semibold">{product.specifications.flash}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">RAM</span>
                  <div className="font-semibold">{product.specifications.ram}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">封装</span>
                  <div className="font-semibold">{product.specifications.package}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">工作温度</span>
                  <div className="font-semibold">{product.specifications.temperature}</div>
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-red-600">{product.pricing.price}</span>
                  <span className="text-sm text-gray-500 ml-2">/ 片</span>
                </div>
                <div className="text-right">
                  <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    product.pricing.stock > 100 
                      ? 'bg-green-100 text-green-800' 
                      : product.pricing.stock > 10 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    库存: {product.pricing.stock}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {product.pricing.leadTime}
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-medium text-gray-700">数量:</label>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-2 text-center border-0 focus:ring-0"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  总价: <span className="font-semibold text-red-600">¥{totalPrice}</span>
                </div>
              </div>

              {/* Price Breaks */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">阶梯价格</h4>
                <div className="flex flex-wrap gap-2">
                  {product.pricing.priceBreaks.map((pb, index) => (
                    <button
                      key={index}
                      onClick={() => setQuantity(pb.quantity)}
                      className={`px-3 py-1 text-xs rounded border ${
                        quantity >= pb.quantity
                          ? 'bg-primary-100 text-primary-800 border-primary-300'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {pb.quantity}+ 片: ¥{pb.price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href={`/${locale}/contact?subject=询价 ${product.partNumber} ${quantity}片`}
                  className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  立即询价
                </Link>
                <Link
                  href={`/${locale}/contact?subject=申请样品 ${product.partNumber}`}
                  className="flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  申请样品
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: '产品概述' },
              { id: 'specifications', name: '详细参数' },
              { id: 'documents', name: '技术文档' },
              { id: 'tools', name: '开发工具' },
              { id: 'related', name: '相关产品' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">产品描述</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.detailedDescription}
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">主要特性</h4>
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mb-3">应用领域</h4>
                <div className="flex flex-wrap gap-2">
                  {product.applications.map((app, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">封装信息</h4>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">封装类型:</span>
                      <span className="font-semibold">{product.package.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">尺寸:</span>
                      <span className="font-semibold">{product.package.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">引脚间距:</span>
                      <span className="font-semibold">{product.package.pitch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">引脚数:</span>
                      <span className="font-semibold">{product.package.pins}</span>
                    </div>
                  </div>
                </div>

                {/* Pinout Diagram */}
                {product.pinout && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">引脚图</h4>
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">引脚图: {product.pinout}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">详细技术参数</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                        参数项目
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                        规格/值
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                          {key}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">技术文档下载</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.documents.map((doc, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{doc.name}</h4>
                        <p className="text-sm text-gray-600 mb-4">文件大小: {doc.size}</p>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          下载
                        </a>
                      </div>
                      <div className="ml-4">
                        <svg className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">开发工具与软件</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.developmentTools.map((tool, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h4>
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
                    >
                      访问官网
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'related' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">相关产品推荐</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.relatedProducts.map((related, index) => (
                  <Link
                    key={index}
                    href={related.link}
                    className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{related.partNumber}</h4>
                    <p className="text-gray-600">{related.description}</p>
                    <div className="mt-4 flex items-center text-primary-600">
                      <span className="text-sm font-medium">查看详情</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-primary-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            需要{product.partNumber}技术支持？
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            我们的专业FAE团队为您提供产品选型、技术咨询、样品申请和现货供应等全方位支持服务。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/contact?subject=${product.partNumber}技术支持`}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              联系FAE
            </Link>
            <Link
              href={`/${locale}/brands/${product.brandSlug}/support`}
              className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-base font-medium rounded-md text-white bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              技术文档
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}