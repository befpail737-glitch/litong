# 18. API设计与集成规范

## 文档概述

本文档详细规定了力通电子网站的API架构设计、接口规范、第三方集成策略和数据交换协议。确保系统具备良好的可扩展性和集成能力。

## API架构设计

### GraphQL API设计

```typescript
// GraphQL Schema定义
export const typeDefs = gql`
  # 基础类型定义
  scalar Date
  scalar JSON
  scalar Upload
  
  # 产品类型
  type Product {
    id: ID!
    partNumber: String!
    slug: String!
    brand: Brand!
    category: ProductCategory!
    subcategory: ProductSubcategory
    
    # 基础信息
    title: String!
    description: String!
    shortDescription: String
    image: SanityImage
    gallery: [SanityImage!]
    
    # 技术规格
    specifications: [ProductSpecification!]!
    datasheet: Document
    applicationNotes: [Document!]
    
    # 商业信息
    pricing: ProductPricing
    inventory: ProductInventory
    moq: Int # 最小订购量
    leadTime: String
    
    # 状态
    status: ProductStatus!
    isActive: Boolean!
    isFeatured: Boolean!
    isNew: Boolean!
    
    # SEO
    seoTitle: String
    seoDescription: String
    seoKeywords: [String!]
    
    # 关联数据
    relatedProducts: [Product!]
    alternatives: [Product!]
    accessories: [Product!]
    
    # 元数据
    createdAt: Date!
    updatedAt: Date!
    publishedAt: Date
  }
  
  # 品牌类型
  type Brand {
    id: ID!
    name: String!
    slug: String!
    logo: SanityImage
    description: String
    website: String
    
    # 品牌信息
    country: String
    established: Int
    headquarters: String
    
    # 产品线
    categories: [ProductCategory!]!
    productCount: Int!
    featuredProducts: [Product!]!
    
    # SEO
    seoTitle: String
    seoDescription: String
    
    # 状态
    isActive: Boolean!
    isFeatured: Boolean!
    
    # 元数据
    createdAt: Date!
    updatedAt: Date!
  }
  
  # 产品分类
  type ProductCategory {
    id: ID!
    name: String!
    slug: String!
    description: String
    icon: String
    image: SanityImage
    
    # 层级结构
    parent: ProductCategory
    children: [ProductCategory!]!
    level: Int!
    path: String!
    
    # 产品统计
    productCount: Int!
    brandCount: Int!
    
    # SEO
    seoTitle: String
    seoDescription: String
    
    # 排序和显示
    sortOrder: Int
    isVisible: Boolean!
    
    # 元数据
    createdAt: Date!
    updatedAt: Date!
  }
  
  # 查询根类型
  type Query {
    # 产品查询
    products(
      filter: ProductFilter
      sort: ProductSort
      pagination: PaginationInput
    ): ProductConnection!
    
    product(id: ID, slug: String, partNumber: String): Product
    
    # 品牌查询
    brands(
      filter: BrandFilter
      sort: BrandSort
      pagination: PaginationInput
    ): BrandConnection!
    
    brand(id: ID, slug: String): Brand
    
    # 分类查询
    categories(
      filter: CategoryFilter
      sort: CategorySort
      level: Int
    ): [ProductCategory!]!
    
    category(id: ID, slug: String): ProductCategory
    
    # 搜索功能
    search(
      query: String!
      filters: SearchFilters
      pagination: PaginationInput
    ): SearchResult!
    
    # 推荐功能
    recommendations(
      productId: ID
      userId: String
      type: RecommendationType
      limit: Int = 10
    ): [Product!]!
    
    # 聚合数据
    aggregations(filters: ProductFilter): ProductAggregations!
  }
  
  # 变更根类型
  type Mutation {
    # 询价相关
    createInquiry(input: CreateInquiryInput!): Inquiry!
    updateInquiry(id: ID!, input: UpdateInquiryInput!): Inquiry!
    
    # 用户收藏
    addToFavorites(productId: ID!): User!
    removeFromFavorites(productId: ID!): User!
    
    # 产品比较
    addToComparison(productId: ID!): ComparisonList!
    removeFromComparison(productId: ID!): ComparisonList!
    clearComparison: ComparisonList!
    
    # 用户反馈
    submitFeedback(input: FeedbackInput!): Feedback!
    
    # 文档下载记录
    trackDocumentDownload(documentId: ID!, documentType: String!): DownloadRecord!
  }
  
  # 订阅类型
  type Subscription {
    # 实时价格更新
    priceUpdates(productIds: [ID!]!): PriceUpdate!
    
    # 库存状态变化
    inventoryUpdates(productIds: [ID!]!): InventoryUpdate!
    
    # 询价状态更新
    inquiryUpdates(userId: String!): InquiryUpdate!
  }
`;

// 输入类型定义
export const inputTypes = gql`
  # 分页输入
  input PaginationInput {
    offset: Int = 0
    limit: Int = 20
    cursor: String
  }
  
  # 产品过滤器
  input ProductFilter {
    brandIds: [ID!]
    categoryIds: [ID!]
    subcategoryIds: [ID!]
    priceRange: PriceRangeInput
    specifications: [SpecificationFilter!]
    status: [ProductStatus!]
    isActive: Boolean
    isFeatured: Boolean
    isNew: Boolean
    inStock: Boolean
    hasDatasheet: Boolean
    search: String
  }
  
  # 价格范围输入
  input PriceRangeInput {
    min: Float
    max: Float
    currency: String = "CNY"
  }
  
  # 规格过滤器
  input SpecificationFilter {
    name: String!
    value: String!
    operator: FilterOperator = EQUALS
  }
  
  # 询价输入
  input CreateInquiryInput {
    type: InquiryType!
    products: [InquiryProductInput!]!
    customer: CustomerInfoInput!
    message: String
    urgency: UrgencyLevel = NORMAL
  }
  
  input InquiryProductInput {
    productId: ID!
    quantity: Int!
    targetPrice: Float
    specifications: JSON
  }
  
  input CustomerInfoInput {
    name: String!
    email: String!
    phone: String
    company: String!
    position: String
    country: String!
    industry: String
  }
  
  # 枚举类型
  enum ProductStatus {
    ACTIVE
    DISCONTINUED
    EOL
    PREVIEW
  }
  
  enum InquiryType {
    SINGLE_PRODUCT
    BULK_ORDER
    BOM_QUOTE
    SAMPLE_REQUEST
  }
  
  enum UrgencyLevel {
    LOW
    NORMAL
    HIGH
    URGENT
  }
  
  enum FilterOperator {
    EQUALS
    NOT_EQUALS
    GREATER_THAN
    LESS_THAN
    CONTAINS
    IN
    NOT_IN
  }
  
  enum RecommendationType {
    SIMILAR
    COMPLEMENTARY
    ALTERNATIVE
    FREQUENTLY_BOUGHT
    TRENDING
  }
`;
```

### REST API 补充接口

```typescript
// REST API 路由定义
export interface RESTAPIRoutes {
  // 产品相关API
  products: {
    // GET /api/products - 获取产品列表
    list: {
      method: 'GET';
      path: '/api/products';
      queryParams: {
        page?: number;
        limit?: number;
        brand?: string[];
        category?: string[];
        search?: string;
        sort?: 'name' | 'price' | 'created' | 'popularity';
        order?: 'asc' | 'desc';
        filters?: Record<string, any>;
      };
      response: ProductListResponse;
    };
    
    // GET /api/products/:id - 获取单个产品
    detail: {
      method: 'GET';
      path: '/api/products/:id';
      params: { id: string };
      response: ProductDetailResponse;
    };
    
    // POST /api/products/:id/view - 记录产品浏览
    trackView: {
      method: 'POST';
      path: '/api/products/:id/view';
      params: { id: string };
      body: { userId?: string; sessionId: string };
      response: { success: boolean };
    };
    
    // GET /api/products/:id/related - 获取相关产品
    related: {
      method: 'GET';
      path: '/api/products/:id/related';
      params: { id: string };
      queryParams: { type: 'similar' | 'alternative' | 'complementary' };
      response: Product[];
    };
  };
  
  // 搜索API
  search: {
    // GET /api/search - 全文搜索
    fulltext: {
      method: 'GET';
      path: '/api/search';
      queryParams: {
        q: string;
        type?: 'products' | 'brands' | 'articles' | 'all';
        filters?: Record<string, any>;
        page?: number;
        limit?: number;
      };
      response: SearchResponse;
    };
    
    // GET /api/search/suggestions - 搜索建议
    suggestions: {
      method: 'GET';
      path: '/api/search/suggestions';
      queryParams: { q: string; limit?: number };
      response: SearchSuggestion[];
    };
    
    // GET /api/search/autocomplete - 自动完成
    autocomplete: {
      method: 'GET';
      path: '/api/search/autocomplete';
      queryParams: { q: string; type?: string };
      response: AutocompleteResponse;
    };
  };
  
  // 询价API
  inquiries: {
    // POST /api/inquiries - 创建询价
    create: {
      method: 'POST';
      path: '/api/inquiries';
      body: CreateInquiryRequest;
      response: InquiryResponse;
    };
    
    // GET /api/inquiries/:id - 获取询价详情
    detail: {
      method: 'GET';
      path: '/api/inquiries/:id';
      params: { id: string };
      headers: { 'Authorization'?: string };
      response: InquiryDetailResponse;
    };
    
    // PUT /api/inquiries/:id - 更新询价状态
    update: {
      method: 'PUT';
      path: '/api/inquiries/:id';
      params: { id: string };
      body: UpdateInquiryRequest;
      headers: { 'Authorization': string };
      response: InquiryResponse;
    };
  };
  
  // 文档下载API
  documents: {
    // GET /api/documents/:id/download - 下载文档
    download: {
      method: 'GET';
      path: '/api/documents/:id/download';
      params: { id: string };
      queryParams: { token?: string };
      response: FileDownloadResponse;
    };
    
    // POST /api/documents/bulk-download - 批量下载
    bulkDownload: {
      method: 'POST';
      path: '/api/documents/bulk-download';
      body: { documentIds: string[]; format: 'zip' | 'pdf' };
      response: BulkDownloadResponse;
    };
  };
  
  // 用户相关API
  users: {
    // GET /api/users/me - 获取当前用户信息
    profile: {
      method: 'GET';
      path: '/api/users/me';
      headers: { 'Authorization': string };
      response: UserProfileResponse;
    };
    
    // POST /api/users/favorites - 添加收藏
    addFavorite: {
      method: 'POST';
      path: '/api/users/favorites';
      body: { productId: string };
      headers: { 'Authorization': string };
      response: { success: boolean };
    };
    
    // GET /api/users/activity - 获取用户活动
    activity: {
      method: 'GET';
      path: '/api/users/activity';
      headers: { 'Authorization': string };
      queryParams: { type?: string; page?: number };
      response: UserActivityResponse;
    };
  };
}

// API响应类型定义
export interface ProductListResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    applied: Record<string, any>;
    available: FilterOption[];
  };
  aggregations: {
    brands: { name: string; count: number }[];
    categories: { name: string; count: number }[];
    priceRanges: { min: number; max: number; count: number }[];
  };
}

export interface SearchResponse {
  results: {
    products: SearchResultItem[];
    brands: SearchResultItem[];
    articles: SearchResultItem[];
    solutions: SearchResultItem[];
  };
  facets: {
    categories: FacetItem[];
    brands: FacetItem[];
    specifications: FacetItem[];
  };
  suggestions: string[];
  total: number;
  query: string;
  executionTime: number; // ms
}
```

## 第三方集成

### CRM系统集成

```typescript
// CRM集成配置
export interface CRMIntegrationConfig {
  // Salesforce集成
  salesforce: {
    apiVersion: string;         // "v52.0"
    endpoint: string;           // Salesforce实例URL
    authentication: {
      type: 'OAuth2' | 'JWT';
      clientId: string;
      clientSecret: string;
      refreshToken?: string;
    };
    
    // 数据同步配置
    syncConfig: {
      leads: {
        enabled: boolean;
        direction: 'bidirectional' | 'to_crm' | 'from_crm';
        frequency: 'real-time' | 'hourly' | 'daily';
        mapping: {
          websiteField: string;
          crmField: string;
          transformation?: string;
        }[];
      };
      
      accounts: {
        enabled: boolean;
        syncCustomers: boolean;
        syncSuppliers: boolean;
        customFields: string[];
      };
      
      opportunities: {
        enabled: boolean;
        createFromInquiry: boolean;
        stageMapping: Record<string, string>;
      };
    };
  };
  
  // HubSpot集成
  hubspot: {
    apiKey: string;
    portalId: string;
    
    // 数据映射
    fieldMapping: {
      contact: {
        firstName: 'firstname';
        lastName: 'lastname';
        email: 'email';
        company: 'company';
        phone: 'phone';
        country: 'country';
        industry: 'industry';
        leadSource: 'hs_lead_source';
      };
      
      company: {
        name: 'name';
        domain: 'domain';
        industry: 'industry';
        country: 'country';
        employees: 'numberofemployees';
      };
    };
    
    // Workflow触发器
    workflows: {
      newInquiry: string;       // Workflow ID
      qualifiedLead: string;
      customerRegistration: string;
    };
  };
}

// CRM数据同步服务
export class CRMSyncService {
  // 同步询价数据到CRM
  async syncInquiryToCRM(inquiry: Inquiry): Promise<CRMSyncResult> {
    const crmData = this.transformInquiryData(inquiry);
    
    try {
      // 检查客户是否存在
      const existingContact = await this.findContactByEmail(inquiry.customer.email);
      
      let contactId: string;
      if (existingContact) {
        // 更新现有联系人
        contactId = await this.updateContact(existingContact.id, crmData.contact);
      } else {
        // 创建新联系人
        contactId = await this.createContact(crmData.contact);
      }
      
      // 创建商机
      const opportunityId = await this.createOpportunity({
        ...crmData.opportunity,
        contactId,
        source: 'website_inquiry'
      });
      
      // 记录产品详情
      await this.attachProductDetails(opportunityId, inquiry.products);
      
      return {
        success: true,
        contactId,
        opportunityId,
        syncedAt: new Date()
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        inquiry: inquiry.id
      };
    }
  }
  
  // 从CRM同步客户更新
  async syncCustomerUpdatesFromCRM(): Promise<void> {
    const recentUpdates = await this.getCRMUpdates();
    
    for (const update of recentUpdates) {
      await this.updateLocalCustomerData(update);
    }
  }
}
```

### ERP系统集成

```typescript
// ERP集成配置
export interface ERPIntegrationConfig {
  // SAP集成
  sap: {
    system: 'SAP ECC' | 'SAP S/4HANA';
    connection: {
      host: string;
      client: string;
      systemNumber: string;
      user: string;
      password: string;
    };
    
    // RFC函数映射
    rfcFunctions: {
      getProductData: 'Z_GET_PRODUCT_MASTER';
      getPricing: 'Z_GET_PRODUCT_PRICING';
      getInventory: 'Z_GET_STOCK_LEVELS';
      createSalesOrder: 'Z_CREATE_SALES_ORDER';
    };
    
    // 数据同步
    dataSync: {
      products: {
        enabled: boolean;
        schedule: string;        // Cron表达式
        batchSize: number;
        materialTypes: string[]; // 物料类型过滤
      };
      
      pricing: {
        enabled: boolean;
        schedule: string;
        priceConditionTypes: string[];
        currencies: string[];
      };
      
      inventory: {
        enabled: boolean;
        schedule: string;
        plants: string[];        // 工厂代码
        storageLocations: string[];
      };
    };
  };
  
  // Oracle ERP集成
  oracle: {
    connection: {
      host: string;
      port: number;
      serviceName: string;
      username: string;
      password: string;
    };
    
    // 数据库视图映射
    views: {
      products: 'XX_PRODUCT_MASTER_V';
      pricing: 'XX_PRODUCT_PRICING_V';
      inventory: 'XX_INVENTORY_LEVELS_V';
      customers: 'XX_CUSTOMER_MASTER_V';
    };
    
    // API端点
    restServices: {
      baseUrl: string;
      authentication: 'basic' | 'oauth';
      endpoints: {
        products: '/products';
        orders: '/orders';
        quotes: '/quotes';
      };
    };
  };
}

// ERP数据同步服务
export class ERPSyncService {
  // 同步产品主数据
  async syncProductMasterData(): Promise<SyncResult> {
    const batchSize = 1000;
    let offset = 0;
    let totalSynced = 0;
    
    try {
      while (true) {
        // 从ERP获取产品数据
        const erpProducts = await this.getERPProducts(offset, batchSize);
        
        if (erpProducts.length === 0) break;
        
        // 转换和同步数据
        for (const erpProduct of erpProducts) {
          const websiteProduct = this.transformERPProduct(erpProduct);
          await this.upsertProduct(websiteProduct);
          totalSynced++;
        }
        
        offset += batchSize;
      }
      
      return {
        success: true,
        recordsProcessed: totalSynced,
        syncType: 'product_master',
        completedAt: new Date()
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        recordsProcessed: totalSynced
      };
    }
  }
  
  // 实时库存同步
  async syncInventoryLevels(productIds: string[]): Promise<InventorySyncResult> {
    const inventoryData = await this.getERPInventory(productIds);
    
    const updates = inventoryData.map(item => ({
      productId: item.materialNumber,
      availableQuantity: item.availableStock,
      reservedQuantity: item.reservedStock,
      lastUpdated: new Date(),
      stockStatus: this.calculateStockStatus(item)
    }));
    
    await this.bulkUpdateInventory(updates);
    
    return {
      success: true,
      updatedProducts: updates.length,
      timestamp: new Date()
    };
  }
}
```

### 支付网关集成

```typescript
// 支付网关配置
export interface PaymentGatewayConfig {
  // 微信支付
  wechatPay: {
    appId: string;
    mchId: string;            // 商户号
    apiKey: string;           // API密钥
    certPath: string;         // 证书路径
    
    supportedCurrencies: ['CNY'];
    supportedMethods: ['JSAPI', 'NATIVE', 'APP', 'H5'];
    
    webhookConfig: {
      url: string;
      signType: 'MD5' | 'HMAC-SHA256';
    };
  };
  
  // 支付宝
  alipay: {
    appId: string;
    privateKey: string;
    publicKey: string;        // 支付宝公钥
    
    supportedMethods: ['page', 'wap', 'app'];
    returnUrl: string;
    notifyUrl: string;
  };
  
  // PayPal
  paypal: {
    clientId: string;
    clientSecret: string;
    environment: 'sandbox' | 'live';
    
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CNY'];
    webhookId: string;
  };
  
  // Stripe
  stripe: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    
    supportedMethods: ['card', 'alipay', 'wechat_pay'];
    currency: string;
  };
}

// 统一支付服务
export class PaymentService {
  // 创建支付订单
  async createPaymentOrder(orderData: PaymentOrderData): Promise<PaymentOrderResult> {
    const { gateway, amount, currency, customer, orderNumber } = orderData;
    
    switch (gateway) {
      case 'wechat':
        return await this.createWeChatPayOrder(orderData);
      case 'alipay':
        return await this.createAlipayOrder(orderData);
      case 'paypal':
        return await this.createPayPalOrder(orderData);
      case 'stripe':
        return await this.createStripePayment(orderData);
      default:
        throw new Error(`Unsupported payment gateway: ${gateway}`);
    }
  }
  
  // 处理支付回调
  async handlePaymentCallback(gateway: string, callbackData: any): Promise<CallbackResult> {
    // 验证回调签名
    const isValid = await this.verifyCallbackSignature(gateway, callbackData);
    
    if (!isValid) {
      throw new Error('Invalid callback signature');
    }
    
    // 更新订单状态
    const orderStatus = this.parsePaymentStatus(gateway, callbackData);
    await this.updateOrderStatus(callbackData.orderNumber, orderStatus);
    
    // 触发后续流程
    if (orderStatus === 'paid') {
      await this.triggerOrderFulfillment(callbackData.orderNumber);
    }
    
    return {
      success: true,
      orderNumber: callbackData.orderNumber,
      status: orderStatus
    };
  }
}
```

### 物流系统集成

```typescript
// 物流系统配置
export interface LogisticsIntegrationConfig {
  // 顺丰速运
  sf: {
    appId: string;
    appKey: string;
    baseUrl: string;
    
    services: {
      tracking: boolean;        // 运单跟踪
      timeEstimate: boolean;    // 时效预估
      priceCalculation: boolean; // 运费计算
    };
  };
  
  // 中通快递
  zto: {
    companyId: string;
    key: string;
    apiUrl: string;
    
    services: ['order', 'cancel', 'track', 'print'];
  };
  
  // DHL
  dhl: {
    apiKey: string;
    apiSecret: string;
    accountNumber: string;
    
    services: {
      express: boolean;
      ecommerce: boolean;
      tracking: boolean;
    };
  };
  
  // FedEx
  fedex: {
    key: string;
    password: string;
    accountNumber: string;
    meterNumber: string;
    
    environment: 'test' | 'production';
    services: ['ship', 'track', 'rate'];
  };
}

// 物流服务
export class LogisticsService {
  // 创建运单
  async createShipment(shipmentData: ShipmentData): Promise<ShipmentResult> {
    const { carrier, sender, recipient, packages } = shipmentData;
    
    // 根据承运商创建运单
    switch (carrier) {
      case 'sf':
        return await this.createSFShipment(shipmentData);
      case 'dhl':
        return await this.createDHLShipment(shipmentData);
      case 'fedex':
        return await this.createFedExShipment(shipmentData);
      default:
        throw new Error(`Unsupported carrier: ${carrier}`);
    }
  }
  
  // 跟踪运单
  async trackShipment(trackingNumber: string, carrier: string): Promise<TrackingInfo> {
    const trackingData = await this.getTrackingData(trackingNumber, carrier);
    
    return {
      trackingNumber,
      carrier,
      status: trackingData.status,
      events: trackingData.events.map(event => ({
        timestamp: event.timestamp,
        location: event.location,
        description: event.description,
        statusCode: event.statusCode
      })),
      estimatedDelivery: trackingData.estimatedDelivery,
      actualDelivery: trackingData.actualDelivery
    };
  }
  
  // 批量跟踪更新
  async batchTrackingUpdate(): Promise<BatchTrackingResult> {
    const activeShipments = await this.getActiveShipments();
    const results = [];
    
    for (const shipment of activeShipments) {
      try {
        const trackingInfo = await this.trackShipment(
          shipment.trackingNumber, 
          shipment.carrier
        );
        
        await this.updateShipmentStatus(shipment.id, trackingInfo);
        
        // 发送状态更新通知
        if (this.shouldNotifyCustomer(trackingInfo)) {
          await this.sendTrackingNotification(shipment.customerId, trackingInfo);
        }
        
        results.push({ success: true, shipmentId: shipment.id });
      } catch (error) {
        results.push({ 
          success: false, 
          shipmentId: shipment.id, 
          error: error.message 
        });
      }
    }
    
    return {
      total: activeShipments.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }
}
```

## API安全与认证

### 认证授权系统

```typescript
// JWT认证配置
export interface JWTAuthConfig {
  // JWT设置
  jwt: {
    secret: string;
    expiresIn: string;          // "24h"
    refreshExpiresIn: string;   // "7d"
    issuer: string;
    audience: string;
  };
  
  // OAuth2配置
  oauth2: {
    providers: {
      google: {
        clientId: string;
        clientSecret: string;
        redirectUri: string;
        scopes: string[];
      };
      
      microsoft: {
        clientId: string;
        clientSecret: string;
        tenantId: string;
        redirectUri: string;
      };
      
      github: {
        clientId: string;
        clientSecret: string;
        redirectUri: string;
      };
    };
  };
  
  // API Key配置
  apiKey: {
    enabled: boolean;
    headerName: string;         // "X-API-Key"
    queryParamName?: string;    // "api_key"
    encryption: 'none' | 'hmac' | 'aes';
  };
}

// 认证中间件
export class AuthenticationMiddleware {
  // JWT Token验证
  async verifyJWTToken(token: string): Promise<TokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.config.jwt.secret) as TokenPayload;
      
      // 检查Token是否在黑名单中
      const isBlacklisted = await this.isTokenBlacklisted(decoded.jti);
      if (isBlacklisted) {
        throw new Error('Token is blacklisted');
      }
      
      return decoded;
    } catch (error) {
      return null;
    }
  }
  
  // API Key验证
  async verifyApiKey(apiKey: string): Promise<ApiKeyInfo | null> {
    const hashedKey = this.hashApiKey(apiKey);
    const keyInfo = await this.getApiKeyInfo(hashedKey);
    
    if (!keyInfo || !keyInfo.isActive) {
      return null;
    }
    
    // 检查使用限制
    const usage = await this.getApiKeyUsage(keyInfo.id);
    if (usage.requestsToday >= keyInfo.dailyLimit) {
      throw new Error('API key daily limit exceeded');
    }
    
    // 更新使用计数
    await this.incrementApiKeyUsage(keyInfo.id);
    
    return keyInfo;
  }
  
  // 权限检查
  async checkPermissions(userId: string, resource: string, action: string): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId);
    
    for (const role of userRoles) {
      const permissions = await this.getRolePermissions(role);
      
      const hasPermission = permissions.some(permission => 
        permission.resource === resource && 
        permission.actions.includes(action)
      );
      
      if (hasPermission) {
        return true;
      }
    }
    
    return false;
  }
}
```

### API安全措施

```typescript
// API安全配置
export interface APISecurityConfig {
  // 速率限制
  rateLimiting: {
    windowMs: number;           // 15 * 60 * 1000 (15分钟)
    maxRequests: number;        // 每个窗口期最大请求数
    skipSuccessfulRequests: boolean;
    skipFailedRequests: boolean;
    
    // 基于用户的限制
    userLimits: {
      anonymous: number;        // 100/15min
      authenticated: number;    // 1000/15min
      premium: number;          // 5000/15min
    };
    
    // 基于端点的限制
    endpointLimits: {
      '/api/search': number;    // 500/15min
      '/api/inquiries': number; // 50/15min
      '/api/downloads': number; // 20/15min
    };
  };
  
  // CORS配置
  cors: {
    origin: string[] | boolean;
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
    maxAge: number;             // preflight缓存时间
  };
  
  // 请求验证
  requestValidation: {
    maxPayloadSize: string;     // "10mb"
    parameterLimits: {
      maxQueryParams: number;   // 50
      maxDepth: number;         // 5
      maxKeys: number;          // 100
    };
    
    sanitization: {
      removeNullBytes: boolean;
      trimWhitespace: boolean;
      normalizeUnicode: boolean;
    };
  };
  
  // 安全头
  securityHeaders: {
    contentSecurityPolicy: string;
    xFrameOptions: 'DENY' | 'SAMEORIGIN';
    xContentTypeOptions: 'nosniff';
    referrerPolicy: 'strict-origin-when-cross-origin';
    strictTransportSecurity: {
      maxAge: number;
      includeSubdomains: boolean;
      preload: boolean;
    };
  };
}

// 安全中间件
export class SecurityMiddleware {
  // 输入验证和清理
  validateAndSanitizeInput(data: any, schema: ValidationSchema): SanitizedData {
    // 1. 类型验证
    const validatedData = this.validateDataTypes(data, schema);
    
    // 2. 格式验证
    this.validateFormats(validatedData, schema);
    
    // 3. 业务规则验证
    this.validateBusinessRules(validatedData, schema);
    
    // 4. 数据清理
    const sanitizedData = this.sanitizeData(validatedData, schema);
    
    return sanitizedData;
  }
  
  // SQL注入防护
  preventSQLInjection(query: string, params: any[]): boolean {
    const sqlKeywords = [
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE',
      'ALTER', 'TRUNCATE', 'UNION', 'EXEC', 'EXECUTE'
    ];
    
    // 检查参数中是否包含SQL关键字
    for (const param of params) {
      if (typeof param === 'string') {
        const upperParam = param.toUpperCase();
        for (const keyword of sqlKeywords) {
          if (upperParam.includes(keyword)) {
            return false;
          }
        }
      }
    }
    
    return true;
  }
  
  // XSS防护
  preventXSS(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  // IP白名单检查
  async checkIPWhitelist(ip: string, endpoint: string): Promise<boolean> {
    const whitelist = await this.getIPWhitelist(endpoint);
    
    if (!whitelist || whitelist.length === 0) {
      return true; // 没有白名单限制
    }
    
    return whitelist.some(allowedIP => {
      if (allowedIP.includes('/')) {
        // CIDR格式检查
        return this.isIPInCIDR(ip, allowedIP);
      } else {
        // 精确匹配
        return ip === allowedIP;
      }
    });
  }
}
```

## API文档与测试

### 自动化API文档

```typescript
// OpenAPI规范配置
export const openApiSpec: OpenAPISpec = {
  openapi: '3.0.3',
  info: {
    title: '力通电子 API',
    description: '力通电子元件代理网站 API 文档',
    version: '1.0.0',
    contact: {
      name: 'API支持团队',
      email: 'api-support@elec-distributor.com',
      url: 'https://docs.elec-distributor.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  
  servers: [
    {
      url: 'https://api.elec-distributor.com/v1',
      description: '生产环境'
    },
    {
      url: 'https://staging-api.elec-distributor.com/v1',
      description: '测试环境'
    },
    {
      url: 'http://localhost:3000/api/v1',
      description: '开发环境'
    }
  ],
  
  paths: {
    '/products': {
      get: {
        summary: '获取产品列表',
        description: '根据指定条件获取产品列表，支持分页、筛选和排序',
        tags: ['Products'],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: '页码，从1开始',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 1 }
          },
          {
            name: 'limit',
            in: 'query', 
            description: '每页数量，最大100',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
          },
          {
            name: 'category',
            in: 'query',
            description: '产品分类ID',
            required: false,
            schema: { type: 'string' }
          },
          {
            name: 'brand',
            in: 'query',
            description: '品牌ID',
            required: false,
            schema: { type: 'string' }
          },
          {
            name: 'search',
            in: 'query',
            description: '搜索关键词',
            required: false,
            schema: { type: 'string', maxLength: 255 }
          }
        ],
        responses: {
          '200': {
            description: '成功返回产品列表',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProductListResponse'
                }
              }
            }
          },
          '400': {
            description: '请求参数错误',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            description: '服务器内部错误',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    }
  },
  
  components: {
    schemas: {
      Product: {
        type: 'object',
        required: ['id', 'partNumber', 'title', 'brand'],
        properties: {
          id: {
            type: 'string',
            description: '产品唯一标识符',
            example: 'prod_123456'
          },
          partNumber: {
            type: 'string',
            description: '产品型号',
            example: 'STM32F103C8T6'
          },
          title: {
            type: 'string',
            description: '产品标题',
            example: 'STM32F103C8T6 ARM Cortex-M3 微控制器'
          },
          brand: {
            $ref: '#/components/schemas/Brand'
          },
          category: {
            $ref: '#/components/schemas/ProductCategory'
          },
          specifications: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ProductSpecification'
            }
          },
          pricing: {
            $ref: '#/components/schemas/ProductPricing'
          }
        }
      },
      
      Brand: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          logo: { type: 'string', format: 'uri' },
          description: { type: 'string' }
        }
      }
    },
    
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key'
      }
    }
  },
  
  security: [
    { bearerAuth: [] },
    { apiKeyAuth: [] }
  ]
};
```

### API测试套件

```typescript
// API测试配置
export interface APITestSuite {
  // 单元测试
  unitTests: {
    framework: 'Jest';
    coverage: {
      threshold: 90;              // 覆盖率阈值
      statements: 90;
      branches: 85;
      functions: 90;
      lines: 90;
    };
    
    testTypes: {
      validators: boolean;        // 验证器测试
      transformers: boolean;      // 数据转换器测试
      services: boolean;          // 服务层测试
      utilities: boolean;         // 工具函数测试
    };
  };
  
  // 集成测试
  integrationTests: {
    framework: 'Jest' | 'Mocha';
    database: {
      setup: 'docker' | 'inmemory';
      seeding: boolean;          // 测试数据填充
      cleanup: boolean;          // 测试后清理
    };
    
    externalServices: {
      mocking: 'nock' | 'msw';   // HTTP请求模拟
      mockData: boolean;         // 模拟数据
    };
  };
  
  // 端到端测试
  e2eTests: {
    framework: 'Playwright' | 'Cypress';
    browsers: ['chromium', 'firefox', 'webkit'];
    
    scenarios: {
      userRegistration: boolean;
      productSearch: boolean;
      inquirySubmission: boolean;
      documentDownload: boolean;
      paymentFlow: boolean;
    };
    
    dataManagement: {
      testDataGeneration: boolean;
      parallelExecution: boolean;
      screenshotOnFailure: boolean;
    };
  };
  
  // 性能测试
  performanceTests: {
    loadTesting: {
      tool: 'k6' | 'Artillery';
      scenarios: {
        baseline: {
          vus: 10;               // 虚拟用户数
          duration: '5m';
        };
        stress: {
          vus: 100;
          duration: '10m';
        };
        spike: {
          vus: 500;
          duration: '1m';
        };
      };
    };
    
    metrics: {
      responseTime: {
        p95: number;             // 95百分位响应时间
        p99: number;             // 99百分位响应时间
      };
      throughput: number;        // 每秒请求数
      errorRate: number;         // 错误率阈值 <1%
    };
  };
  
  // 安全测试
  securityTests: {
    authenticationTests: boolean;  // 认证测试
    authorizationTests: boolean;   // 授权测试
    inputValidationTests: boolean; // 输入验证测试
    sqlInjectionTests: boolean;    // SQL注入测试
    xssTests: boolean;            // XSS测试
    csrfTests: boolean;           // CSRF测试
    rateLimitTests: boolean;      // 速率限制测试
  };
}
```

## 实施计划

### API开发时间线

```yaml
第一阶段 - 核心API开发 (6周):
  Week 1-2: 基础架构搭建
    - GraphQL服务器配置
    - 数据库连接和ORM设置
    - 基础认证系统
    - 核心数据模型
  
  Week 3-4: 产品和品牌API
    - 产品查询和详情API
    - 品牌查询API
    - 分类查询API
    - 搜索功能API
  
  Week 5-6: 业务功能API
    - 询价API
    - 用户管理API
    - 文档下载API
    - 基础测试套件

第二阶段 - 第三方集成 (4周):
  Week 7-8: CRM和ERP集成
    - Salesforce/HubSpot集成
    - 数据同步服务
    - 错误处理和重试机制
  
  Week 9-10: 支付和物流集成
    - 支付网关集成
    - 物流跟踪集成
    - Webhook处理

第三阶段 - 安全和优化 (3周):
  Week 11: 安全加固
    - 安全中间件实现
    - 输入验证和清理
    - 速率限制
  
  Week 12: 性能优化
    - 查询优化
    - 缓存策略实施
    - 负载测试
  
  Week 13: 文档和测试
    - API文档完善
    - 测试覆盖率提升
    - 部署脚本

第四阶段 - 部署和监控 (2周):
  Week 14: 生产部署
    - CI/CD流程
    - 环境配置
    - 数据迁移
  
  Week 15: 监控和调优
    - 监控系统部署
    - 性能调优
    - 用户培训

总预算: $45,000
总工期: 15周
```

---

**文档版本**: v1.0  
**创建日期**: 2025-09-06  
**适用范围**: 力通电子网站API开发团队