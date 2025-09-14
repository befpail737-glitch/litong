'use client';

import { useState, useEffect } from 'react';
import { diagnoseProductPublishStatus, testProductQuery } from '@/lib/sanity/client';

interface DiagnosisResult {
  timestamp: string;
  stats: {
    totalProducts: number;
    publishedProducts: number;
    draftProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    featuredProducts: number;
    productsWithBrands: number;
    productsWithoutBrands: number;
    productsWithCategories: number;
    productsWithoutCategories: number;
  };
  publishedProducts: any[];
  draftProducts: any[];
  brands: any[];
  categories: any[];
  dataIntegrityIssues: any[];
  summary: {
    totalIssues: number;
    publishRatio: string;
    activeRatio: string;
    mainIssues: string[];
  };
}

interface QueryTestResult {
  queryType: string;
  duration: number;
  resultCount: number;
  results: any;
  success: boolean;
  error?: string;
  timestamp: string;
}

export default function DebugPage() {
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [queryTests, setQueryTests] = useState<QueryTestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'tests' | 'raw'>('overview');

  const runDiagnosis = async () => {
    setLoading(true);
    try {
      console.log('🚀 开始运行产品诊断...');
      const result = await diagnoseProductPublishStatus({ limit: 20 });
      setDiagnosis(result);

      // 运行查询测试
      const testResults = [];
      for (const queryType of ['basic', 'detailed', 'raw'] as const) {
        const testResult = await testProductQuery(queryType);
        testResults.push(testResult);
      }
      setQueryTests(testResults);

    } catch (error) {
      console.error('❌ 诊断失败:', error);
      alert('诊断失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnosis();
  }, []);

  if (loading && !diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">正在诊断 Sanity 数据状态...</p>
          <p className="text-sm text-gray-500 mt-2">这可能需要几秒钟时间</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sanity CMS 数据诊断</h1>
              <p className="text-gray-600 mt-2">
                深度分析产品发布状态和数据完整性问题
              </p>
              {diagnosis && (
                <p className="text-sm text-gray-500 mt-1">
                  最后更新: {new Date(diagnosis.timestamp).toLocaleString('zh-CN')}
                </p>
              )}
            </div>
            <button
              onClick={runDiagnosis}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  诊断中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  重新诊断
                </>
              )}
            </button>
          </div>
        </div>

        {diagnosis && (
          <>
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: '概览', count: diagnosis.summary.totalIssues },
                    { id: 'products', label: '产品详情', count: diagnosis.stats.publishedProducts },
                    { id: 'tests', label: '查询测试', count: queryTests.length },
                    { id: 'raw', label: '原始数据', count: null }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                      {tab.count !== null && (
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{diagnosis.stats.totalProducts}</div>
                    <div className="text-sm text-gray-600">总产品数</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">{diagnosis.stats.publishedProducts}</div>
                    <div className="text-sm text-gray-600">已发布产品</div>
                    <div className="text-xs text-gray-500">{diagnosis.summary.publishRatio}</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">{diagnosis.stats.activeProducts}</div>
                    <div className="text-sm text-gray-600">激活产品</div>
                    <div className="text-xs text-gray-500">{diagnosis.summary.activeRatio}</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-red-600">{diagnosis.summary.totalIssues}</div>
                    <div className="text-sm text-gray-600">数据问题</div>
                  </div>
                </div>

                {/* Issues */}
                {diagnosis.summary.totalIssues > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">❌ 发现的问题</h3>
                    <div className="space-y-3">
                      {diagnosis.dataIntegrityIssues.map((issue, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                          </div>
                          <div>
                            <p className="font-medium text-red-900">{issue.productName}</p>
                            <p className="text-sm text-red-700">{issue.issue}</p>
                            <p className="text-xs text-red-600">ID: {issue.productId}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brand & Category Stats */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">品牌状态</h3>
                    <div className="space-y-3">
                      {diagnosis.brands.slice(0, 5).map((brand) => (
                        <div key={brand._id} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{brand.name}</span>
                            {!brand.isActive && <span className="text-xs text-red-500 ml-2">未激活</span>}
                          </div>
                          <div className="text-sm text-gray-500">
                            {brand.activeProductCount}/{brand.productCount} 产品
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">分类状态</h3>
                    <div className="space-y-3">
                      {diagnosis.categories.slice(0, 5).map((category) => (
                        <div key={category._id} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{category.name}</span>
                            {!category.isVisible && <span className="text-xs text-red-500 ml-2">不可见</span>}
                          </div>
                          <div className="text-sm text-gray-500">
                            {category.activeProductCount}/{category.productCount} 产品
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">产品详情</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">品牌</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {diagnosis.publishedProducts.map((product) => (
                        <tr key={product._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.title || product.partNumber}</div>
                              <div className="text-sm text-gray-500">{product.partNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm ${product.brand ? 'text-gray-900' : 'text-red-500'}`}>
                              {product.brand || '缺少品牌'}
                            </span>
                            {product.brand && !product.brandActive && (
                              <span className="text-xs text-red-500 block">品牌未激活</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.category || <span className="text-red-500">缺少分类</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {product.isActive ? '激活' : '未激活'}
                              </span>
                              {product.isFeatured && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  推荐
                                </span>
                              )}
                              {product.hasDraft && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  有草稿
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(product._createdAt).toLocaleDateString('zh-CN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Query Tests Tab */}
            {activeTab === 'tests' && (
              <div className="space-y-6">
                {queryTests.map((test, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        查询测试: {test.queryType}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          test.success
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {test.success ? '成功' : '失败'}
                        </span>
                        <span className="text-sm text-gray-500">{test.duration}ms</span>
                        <span className="text-sm text-gray-500">
                          {test.resultCount} 条结果
                        </span>
                      </div>
                    </div>

                    {test.success ? (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-green-800 text-sm mb-2">
                          ✅ 查询成功返回 {test.resultCount} 条记录
                        </p>
                        {test.results && Array.isArray(test.results) && test.results.length > 0 && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-green-700">查看首条数据</summary>
                            <pre className="mt-2 bg-white p-2 rounded border overflow-auto max-h-40">
                              {JSON.stringify(test.results[0], null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ) : (
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-800 text-sm">❌ 查询失败</p>
                        <p className="text-red-700 text-xs mt-1">{test.error}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Raw Data Tab */}
            {activeTab === 'raw' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">原始诊断数据</h3>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-xs max-h-96">
                  {JSON.stringify(diagnosis, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}