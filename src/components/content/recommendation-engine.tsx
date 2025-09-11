'use client';

import { useState, useEffect } from 'react';

import {
  Brain,
  Target,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  BarChart3,
  RefreshCw,
  Settings,
  Play,
  Pause,
  TestTube,
  Zap,
  Filter,
  Search,
  Plus,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Star,
  Download,
  Upload,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useLocale } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface RecommendationItem {
  contentId: string
  contentType: string
  title: string
  score: number
  reason: string
  confidence: number
  position: number
  metadata: {
    similarity_features: string[]
    user_segments: string[]
    interaction_count: number
    conversion_rate: number
  }
}

interface ContentRecommendation {
  id: string
  title: string
  sourceContent: {
    contentId: string
    contentType: string
    contentTitle: string
  }
  recommendationType: 'content_based' | 'collaborative' | 'hybrid' | 'manual'
  algorithm: {
    type: string
    parameters: {
      similarity_threshold: number
      max_recommendations: number
      min_score: number
      weight_factors: {
        content_similarity: number
        user_behavior: number
        popularity: number
        recency: number
      }
    }
  }
  recommendations: RecommendationItem[]
  performance: {
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    conversion_rate: number
    relevance_score: number
    user_feedback: {
      helpful_votes: number
      not_helpful_votes: number
      average_rating: number
    }
  }
  settings: {
    enabled: boolean
    refresh_frequency: number
    cache_duration: number
    a_b_testing: {
      enabled: boolean
      variant_split: number
      test_duration_days: number
    }
    personalization: string
  }
  lastUpdated: string
}

const mockRecommendations: ContentRecommendation[] = [
  {
    id: '1',
    title: 'STM32H743 相关推荐',
    sourceContent: {
      contentId: 'stm32-h743',
      contentType: 'product',
      contentTitle: 'STM32H743VIT6 Microcontroller'
    },
    recommendationType: 'hybrid',
    algorithm: {
      type: 'cosine_similarity',
      parameters: {
        similarity_threshold: 0.7,
        max_recommendations: 8,
        min_score: 0.2,
        weight_factors: {
          content_similarity: 0.4,
          user_behavior: 0.3,
          popularity: 0.2,
          recency: 0.1
        }
      }
    },
    recommendations: [
      {
        contentId: 'stm32-h753',
        contentType: 'product',
        title: 'STM32H753VIT6 Advanced Microcontroller',
        score: 0.92,
        reason: 'similar_content',
        confidence: 0.88,
        position: 1,
        metadata: {
          similarity_features: ['ARM Cortex-M7', 'High Performance', 'Industrial'],
          user_segments: ['engineers', 'enterprise'],
          interaction_count: 1250,
          conversion_rate: 0.15
        }
      },
      {
        contentId: 'stm32-development-board',
        contentType: 'product',
        title: 'STM32H743 Development Board',
        score: 0.87,
        reason: 'complementary',
        confidence: 0.92,
        position: 2,
        metadata: {
          similarity_features: ['STM32H743', 'Development', 'Evaluation'],
          user_segments: ['engineers', 'students'],
          interaction_count: 890,
          conversion_rate: 0.22
        }
      }
    ],
    performance: {
      impressions: 15420,
      clicks: 1234,
      conversions: 186,
      ctr: 0.08,
      conversion_rate: 0.151,
      relevance_score: 4.2,
      user_feedback: {
        helpful_votes: 89,
        not_helpful_votes: 12,
        average_rating: 4.1
      }
    },
    settings: {
      enabled: true,
      refresh_frequency: 24,
      cache_duration: 60,
      a_b_testing: {
        enabled: true,
        variant_split: 50,
        test_duration_days: 14
      },
      personalization: 'high'
    },
    lastUpdated: '2025-01-15T10:30:00Z'
  }
];

export function RecommendationEngine() {
  const locale = useLocale();
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>(mockRecommendations);
  const [selectedRec, setSelectedRec] = useState<ContentRecommendation | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const typeConfig = {
    content_based: { label: '基于内容', color: 'bg-blue-100 text-blue-800', icon: '📄' },
    collaborative: { label: '协同过滤', color: 'bg-green-100 text-green-800', icon: '👥' },
    hybrid: { label: '混合推荐', color: 'bg-purple-100 text-purple-800', icon: '🔄' },
    manual: { label: '人工推荐', color: 'bg-orange-100 text-orange-800', icon: '✋' }
  };

  const reasonConfig = {
    similar_content: { label: '相似内容', icon: '🔗' },
    same_category: { label: '同类产品', icon: '📂' },
    user_history: { label: '历史偏好', icon: '👤' },
    popular: { label: '热门推荐', icon: '🔥' },
    recently_viewed: { label: '最近浏览', icon: '👀' },
    complementary: { label: '互补产品', icon: '🧩' },
    cross_selling: { label: '交叉销售', icon: '↗️' },
    up_selling: { label: '升级推荐', icon: '⬆️' }
  };

  const getPerformanceColor = (value: number, type: 'ctr' | 'conversion' | 'rating') => {
    if (type === 'ctr') {
      return value >= 0.1 ? 'text-green-600' : value >= 0.05 ? 'text-yellow-600' : 'text-red-600';
    } else if (type === 'conversion') {
      return value >= 0.2 ? 'text-green-600' : value >= 0.1 ? 'text-yellow-600' : 'text-red-600';
    } else if (type === 'rating') {
      return value >= 4.0 ? 'text-green-600' : value >= 3.0 ? 'text-yellow-600' : 'text-red-600';
    }
    return 'text-gray-600';
  };

  const trainModel = async (recId: string) => {
    setIsTraining(true);

    // Simulate model training
    await new Promise(resolve => setTimeout(resolve, 3000));

    setRecommendations(recs => recs.map(rec => {
      if (rec.id === recId) {
        return {
          ...rec,
          performance: {
            ...rec.performance,
            relevance_score: Math.min(5.0, rec.performance.relevance_score + Math.random() * 0.5),
            ctr: Math.min(0.2, rec.performance.ctr + Math.random() * 0.02)
          },
          lastUpdated: new Date().toISOString()
        };
      }
      return rec;
    }));

    setIsTraining(false);
  };

  const toggleRecommendation = (recId: string) => {
    setRecommendations(recs => recs.map(rec =>
      rec.id === recId
        ? { ...rec, settings: { ...rec.settings, enabled: !rec.settings.enabled } }
        : rec
    ));
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesType = filterType === 'all' || rec.recommendationType === filterType;
    const matchesSearch = !searchQuery ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.sourceContent.contentTitle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">内容推荐算法</h1>
        <p className="text-gray-600">智能推荐引擎管理和优化</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索推荐配置..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="content_based">基于内容</SelectItem>
            <SelectItem value="collaborative">协同过滤</SelectItem>
            <SelectItem value="hybrid">混合推荐</SelectItem>
            <SelectItem value="manual">人工推荐</SelectItem>
          </SelectContent>
        </Select>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              创建推荐配置
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>创建新的推荐配置</DialogTitle>
            </DialogHeader>
            {/* New recommendation config form would go here */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {filteredRecommendations.map((rec) => {
          const config = typeConfig[rec.recommendationType];

          return (
            <Card key={rec.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {rec.title}
                          {rec.settings.enabled ? (
                            <Badge className="bg-green-500 text-xs">运行中</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">已暂停</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span>{config.icon}</span>
                          <Badge className={config.color}>{config.label}</Badge>
                          <span>•</span>
                          <span>来源: {rec.sourceContent.contentTitle}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getPerformanceColor(rec.performance.relevance_score, 'rating')}`}>
                        {rec.performance.relevance_score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">相关性评分</div>
                    </div>

                    <Switch
                      checked={rec.settings.enabled}
                      onCheckedChange={() => toggleRecommendation(rec.id)}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{rec.performance.impressions.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">展示次数</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getPerformanceColor(rec.performance.ctr, 'ctr')}`}>
                        {(rec.performance.ctr * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">点击率</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getPerformanceColor(rec.performance.conversion_rate, 'conversion')}`}>
                        {(rec.performance.conversion_rate * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">转化率</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{rec.recommendations.length}</div>
                      <div className="text-sm text-gray-600">推荐项目</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">用户反馈</span>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{rec.performance.user_feedback.helpful_votes}</span>
                        <ThumbsDown className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{rec.performance.user_feedback.not_helpful_votes}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= rec.performance.user_feedback.average_rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {rec.performance.user_feedback.average_rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {rec.settings.personalization} 个性化
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4" />
                      <span className="text-sm font-medium">算法配置</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">内容相似度权重:</span>
                        <div className="font-medium">{(rec.algorithm.parameters.weight_factors.content_similarity * 100)}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">用户行为权重:</span>
                        <div className="font-medium">{(rec.algorithm.parameters.weight_factors.user_behavior * 100)}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">热度权重:</span>
                        <div className="font-medium">{(rec.algorithm.parameters.weight_factors.popularity * 100)}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">时效性权重:</span>
                        <div className="font-medium">{(rec.algorithm.parameters.weight_factors.recency * 100)}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRec(rec)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        详细分析
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => trainModel(rec.id)}
                        disabled={isTraining}
                      >
                        <RefreshCw className={`h-4 w-4 mr-1 ${isTraining ? 'animate-spin' : ''}`} />
                        重新训练
                      </Button>

                      {rec.settings.a_b_testing.enabled && (
                        <Button variant="outline" size="sm">
                          <TestTube className="h-4 w-4 mr-1" />
                          A/B测试
                        </Button>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      最后更新: {new Date(rec.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredRecommendations.length === 0 && (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无推荐配置</h3>
            <p className="text-gray-600">没有找到符合条件的推荐配置</p>
          </div>
        )}
      </div>

      {/* Detailed Recommendation Analysis Dialog */}
      {selectedRec && (
        <Dialog open={!!selectedRec} onOpenChange={() => setSelectedRec(null)}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Brain className="h-5 w-5" />
                推荐详细分析 - {selectedRec.title}
                <Badge className={typeConfig[selectedRec.recommendationType].color}>
                  {typeConfig[selectedRec.recommendationType].label}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="performance" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="performance">性能分析</TabsTrigger>
                <TabsTrigger value="recommendations">推荐结果</TabsTrigger>
                <TabsTrigger value="algorithm">算法配置</TabsTrigger>
                <TabsTrigger value="settings">系统设置</TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">核心指标</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>展示次数</span>
                        <span className="font-semibold">{selectedRec.performance.impressions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>点击次数</span>
                        <span className="font-semibold">{selectedRec.performance.clicks.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>转化次数</span>
                        <span className="font-semibold">{selectedRec.performance.conversions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>点击率</span>
                        <span className={`font-semibold ${getPerformanceColor(selectedRec.performance.ctr, 'ctr')}`}>
                          {(selectedRec.performance.ctr * 100).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>转化率</span>
                        <span className={`font-semibold ${getPerformanceColor(selectedRec.performance.conversion_rate, 'conversion')}`}>
                          {(selectedRec.performance.conversion_rate * 100).toFixed(2)}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">用户反馈</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-5 w-5 text-green-500" />
                          <span className="text-lg font-semibold">{selectedRec.performance.user_feedback.helpful_votes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="h-5 w-5 text-red-500" />
                          <span className="text-lg font-semibold">{selectedRec.performance.user_feedback.not_helpful_votes}</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">用户评分:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= selectedRec.performance.user_feedback.average_rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-center">
                          {selectedRec.performance.user_feedback.average_rating.toFixed(1)} / 5.0
                        </div>
                      </div>

                      <div className="text-center">
                        <div className={`text-lg font-semibold ${getPerformanceColor(selectedRec.performance.relevance_score, 'rating')}`}>
                          {selectedRec.performance.relevance_score.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">相关性评分</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">系统状态</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>运行状态</span>
                        {selectedRec.settings.enabled ? (
                          <Badge className="bg-green-500">运行中</Badge>
                        ) : (
                          <Badge variant="secondary">已暂停</Badge>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <span>刷新频率</span>
                        <span className="font-semibold">{selectedRec.settings.refresh_frequency}小时</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>缓存时长</span>
                        <span className="font-semibold">{selectedRec.settings.cache_duration}分钟</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>个性化级别</span>
                        <Badge variant="outline">{selectedRec.settings.personalization}</Badge>
                      </div>

                      {selectedRec.settings.a_b_testing.enabled && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TestTube className="h-4 w-4" />
                            <span className="font-medium">A/B测试运行中</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            变体分割: {selectedRec.settings.a_b_testing.variant_split}%
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>性能趋势</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600">性能趋势图将在此显示</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-6">
                <div className="space-y-4">
                  {selectedRec.recommendations.map((item, index) => {
                    const reasonInfo = reasonConfig[item.reason as keyof typeof reasonConfig] || { label: item.reason, icon: '💡' };

                    return (
                      <Card key={item.contentId}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-2xl font-bold text-gray-400">
                                #{item.position}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{item.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline">{item.contentType}</Badge>
                                  <span className="text-sm text-gray-500">
                                    {reasonInfo.icon} {reasonInfo.label}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right space-y-1">
                              <div className="text-lg font-semibold">
                                {Math.round(item.score * 100)}%
                              </div>
                              <div className="text-sm text-gray-500">
                                置信度: {Math.round(item.confidence * 100)}%
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">目标用户:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.metadata.user_segments.slice(0, 2).map((segment) => (
                                    <Badge key={segment} variant="secondary" className="text-xs">
                                      {segment}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">交互次数:</span>
                                <div className="font-medium">{item.metadata.interaction_count.toLocaleString()}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">转化率:</span>
                                <div className="font-medium">{(item.metadata.conversion_rate * 100).toFixed(1)}%</div>
                              </div>
                              <div>
                                <span className="text-gray-600">相似特征:</span>
                                <div className="text-xs text-gray-500">
                                  {item.metadata.similarity_features.slice(0, 2).join(', ')}
                                  {item.metadata.similarity_features.length > 2 && '...'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="algorithm" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">算法参数</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>相似度阈值</Label>
                        <div className="mt-2">
                          <Slider
                            value={[selectedRec.algorithm.parameters.similarity_threshold]}
                            max={1}
                            min={0}
                            step={0.1}
                            className="w-full"
                          />
                          <div className="text-sm text-gray-500 mt-1">
                            当前值: {selectedRec.algorithm.parameters.similarity_threshold}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>最大推荐数量</Label>
                        <Input
                          type="number"
                          value={selectedRec.algorithm.parameters.max_recommendations}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>最小评分</Label>
                        <div className="mt-2">
                          <Slider
                            value={[selectedRec.algorithm.parameters.min_score]}
                            max={1}
                            min={0}
                            step={0.1}
                            className="w-full"
                          />
                          <div className="text-sm text-gray-500 mt-1">
                            当前值: {selectedRec.algorithm.parameters.min_score}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">权重配置</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>内容相似度权重 ({(selectedRec.algorithm.parameters.weight_factors.content_similarity * 100).toFixed(0)}%)</Label>
                        <Slider
                          value={[selectedRec.algorithm.parameters.weight_factors.content_similarity]}
                          max={1}
                          min={0}
                          step={0.1}
                          className="w-full mt-2"
                        />
                      </div>

                      <div>
                        <Label>用户行为权重 ({(selectedRec.algorithm.parameters.weight_factors.user_behavior * 100).toFixed(0)}%)</Label>
                        <Slider
                          value={[selectedRec.algorithm.parameters.weight_factors.user_behavior]}
                          max={1}
                          min={0}
                          step={0.1}
                          className="w-full mt-2"
                        />
                      </div>

                      <div>
                        <Label>热度权重 ({(selectedRec.algorithm.parameters.weight_factors.popularity * 100).toFixed(0)}%)</Label>
                        <Slider
                          value={[selectedRec.algorithm.parameters.weight_factors.popularity]}
                          max={1}
                          min={0}
                          step={0.1}
                          className="w-full mt-2"
                        />
                      </div>

                      <div>
                        <Label>时效性权重 ({(selectedRec.algorithm.parameters.weight_factors.recency * 100).toFixed(0)}%)</Label>
                        <Slider
                          value={[selectedRec.algorithm.parameters.weight_factors.recency]}
                          max={1}
                          min={0}
                          step={0.1}
                          className="w-full mt-2"
                        />
                      </div>

                      <div className="pt-2 text-sm text-gray-500">
                        权重总和: {(
                          selectedRec.algorithm.parameters.weight_factors.content_similarity +
                          selectedRec.algorithm.parameters.weight_factors.user_behavior +
                          selectedRec.algorithm.parameters.weight_factors.popularity +
                          selectedRec.algorithm.parameters.weight_factors.recency
                        ).toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>算法类型</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedRec.algorithm.type}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cosine_similarity">余弦相似度</SelectItem>
                        <SelectItem value="tfidf">TF-IDF</SelectItem>
                        <SelectItem value="user_item_cf">用户-物品协同过滤</SelectItem>
                        <SelectItem value="item_item_cf">物品-物品协同过滤</SelectItem>
                        <SelectItem value="matrix_factorization">矩阵分解</SelectItem>
                        <SelectItem value="deep_learning">深度学习</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">基础设置</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>启用推荐</Label>
                        <Switch checked={selectedRec.settings.enabled} />
                      </div>

                      <div>
                        <Label>刷新频率 (小时)</Label>
                        <Input
                          type="number"
                          value={selectedRec.settings.refresh_frequency}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>缓存时长 (分钟)</Label>
                        <Input
                          type="number"
                          value={selectedRec.settings.cache_duration}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>个性化级别</Label>
                        <Select value={selectedRec.settings.personalization}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">无</SelectItem>
                            <SelectItem value="low">低</SelectItem>
                            <SelectItem value="medium">中</SelectItem>
                            <SelectItem value="high">高</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">A/B测试设置</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>启用A/B测试</Label>
                        <Switch checked={selectedRec.settings.a_b_testing.enabled} />
                      </div>

                      {selectedRec.settings.a_b_testing.enabled && (
                        <>
                          <div>
                            <Label>变体分割比例 (%)</Label>
                            <Input
                              type="number"
                              value={selectedRec.settings.a_b_testing.variant_split}
                              min={0}
                              max={100}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label>测试持续时间 (天)</Label>
                            <Input
                              type="number"
                              value={selectedRec.settings.a_b_testing.test_duration_days}
                              className="mt-1"
                            />
                          </div>

                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <TestTube className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">A/B测试状态</span>
                            </div>
                            <div className="text-sm text-blue-700">
                              当前正在运行A/B测试，流量按 {selectedRec.settings.a_b_testing.variant_split}% 分割
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>操作记录</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div className="flex-1">
                          <div className="font-medium">模型训练完成</div>
                          <div className="text-sm text-gray-600">相关性评分提升至 {selectedRec.performance.relevance_score.toFixed(1)}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(selectedRec.lastUpdated).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        <div className="flex-1">
                          <div className="font-medium">算法参数调整</div>
                          <div className="text-sm text-gray-600">相似度阈值从 0.6 调整为 0.7</div>
                        </div>
                        <div className="text-sm text-gray-500">2小时前</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
