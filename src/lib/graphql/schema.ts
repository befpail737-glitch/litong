import { gql } from '@apollo/client';

export const typeDefs = gql`
  # Custom Scalars
  scalar DateTime
  scalar JSON
  scalar Upload
  scalar EmailAddress
  scalar URL

  # Enums
  enum ProductStatus {
    ACTIVE
    INACTIVE
    DISCONTINUED
    COMING_SOON
  }

  enum InquiryStatus {
    PENDING
    IN_PROGRESS
    QUOTED
    CLOSED
    CANCELLED
  }

  enum UserRole {
    ADMIN
    MANAGER
    SALES
    CUSTOMER
    GUEST
  }

  enum OrderStatus {
    DRAFT
    PENDING
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
  }

  enum ContentType {
    PRODUCT
    NEWS
    SOLUTION
    CASE_STUDY
    APPLICATION
    TECHNICAL_DOCUMENT
  }

  # Input Types
  input ProductFilter {
    category: String
    manufacturer: String
    minPrice: Float
    maxPrice: Float
    inStock: Boolean
    search: String
    tags: [String!]
  }

  input ProductSort {
    field: ProductSortField!
    direction: SortDirection!
  }

  enum ProductSortField {
    NAME
    PRICE
    CREATED_AT
    POPULARITY
    RATING
  }

  enum SortDirection {
    ASC
    DESC
  }

  input PaginationInput {
    page: Int = 1
    limit: Int = 20
  }

  input CreateProductInput {
    name: String!
    description: String
    manufacturer: String!
    category: String!
    model: String
    price: Float
    currency: String = "USD"
    specifications: JSON
    images: [String!]
    documents: [String!]
    tags: [String!]
    status: ProductStatus = ACTIVE
  }

  input UpdateProductInput {
    id: ID!
    name: String
    description: String
    manufacturer: String
    category: String
    model: String
    price: Float
    currency: String
    specifications: JSON
    images: [String!]
    documents: [String!]
    tags: [String!]
    status: ProductStatus
  }

  input CreateInquiryInput {
    customerInfo: CustomerInfoInput!
    items: [InquiryItemInput!]!
    message: String
    urgency: InquiryUrgency = NORMAL
  }

  input CustomerInfoInput {
    name: String!
    email: EmailAddress!
    phone: String
    company: String
    position: String
    country: String
    address: String
  }

  input InquiryItemInput {
    productId: ID!
    quantity: Int!
    specifications: JSON
    notes: String
  }

  enum InquiryUrgency {
    LOW
    NORMAL
    HIGH
    URGENT
  }

  input UserInput {
    name: String!
    email: EmailAddress!
    phone: String
    company: String
    role: UserRole = CUSTOMER
    preferences: JSON
  }

  # Core Types
  type Product {
    id: ID!
    name: String!
    description: String
    manufacturer: String!
    category: String!
    model: String
    price: Float
    currency: String
    specifications: JSON
    images: [Image!]!
    documents: [Document!]!
    tags: [String!]!
    status: ProductStatus!
    inventory: Inventory
    rating: Float
    reviewCount: Int
    views: Int
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Related data
    relatedProducts: [Product!]!
    alternatives: [Product!]!
    accessories: [Product!]!
    reviews: [Review!]!
    applications: [Application!]!
    caseStudies: [CaseStudy!]!
  }

  type Image {
    id: ID!
    url: URL!
    alt: String
    title: String
    width: Int
    height: Int
    size: Int
    format: String
    thumbnail: URL
  }

  type Document {
    id: ID!
    name: String!
    url: URL!
    type: DocumentType!
    size: Int
    downloadCount: Int
    createdAt: DateTime!
  }

  enum DocumentType {
    DATASHEET
    MANUAL
    APPLICATION_NOTE
    WHITE_PAPER
    SCHEMATIC
    LAYOUT
    SOFTWARE
    CERTIFICATE
  }

  type Inventory {
    id: ID!
    productId: ID!
    quantity: Int!
    reserved: Int
    available: Int
    reorderLevel: Int
    leadTime: Int
    supplier: String
    location: String
    lastUpdated: DateTime!
  }

  type Review {
    id: ID!
    productId: ID!
    user: User
    rating: Int!
    title: String
    content: String
    pros: [String!]
    cons: [String!]
    verified: Boolean!
    helpful: Int
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type User {
    id: ID!
    name: String!
    email: EmailAddress!
    phone: String
    company: String
    position: String
    role: UserRole!
    avatar: Image
    preferences: JSON
    isActive: Boolean!
    lastLogin: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    
    # Related data
    inquiries: [Inquiry!]!
    orders: [Order!]!
    reviews: [Review!]!
    favorites: [Product!]!
  }

  type Inquiry {
    id: ID!
    inquiryNumber: String!
    customer: User!
    items: [InquiryItem!]!
    message: String
    status: InquiryStatus!
    urgency: InquiryUrgency!
    assignedTo: User
    totalEstimatedValue: Float
    currency: String
    validUntil: DateTime
    responses: [InquiryResponse!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type InquiryItem {
    id: ID!
    product: Product!
    quantity: Int!
    unitPrice: Float
    totalPrice: Float
    specifications: JSON
    notes: String
    availability: String
    leadTime: Int
  }

  type InquiryResponse {
    id: ID!
    inquiryId: ID!
    respondedBy: User!
    message: String!
    quotedItems: [QuotedItem!]!
    validUntil: DateTime
    terms: String
    createdAt: DateTime!
  }

  type QuotedItem {
    id: ID!
    inquiryItemId: ID!
    unitPrice: Float!
    totalPrice: Float!
    availability: String
    leadTime: Int
    notes: String
  }

  type Order {
    id: ID!
    orderNumber: String!
    customer: User!
    items: [OrderItem!]!
    status: OrderStatus!
    subtotal: Float!
    tax: Float
    shipping: Float
    total: Float!
    currency: String!
    shippingAddress: Address!
    billingAddress: Address!
    paymentMethod: String
    notes: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type OrderItem {
    id: ID!
    product: Product!
    quantity: Int!
    unitPrice: Float!
    totalPrice: Float!
    specifications: JSON
  }

  type Address {
    street: String!
    city: String!
    state: String
    postalCode: String!
    country: String!
    phone: String
    contactName: String
  }

  type Application {
    id: ID!
    title: String!
    description: String
    industry: String!
    useCase: String
    products: [Product!]!
    images: [Image!]!
    documents: [Document!]!
    features: [String!]!
    benefits: [String!]!
    technicalSpecs: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type CaseStudy {
    id: ID!
    title: String!
    description: String
    customer: String!
    industry: String!
    challenge: String!
    solution: String!
    results: String!
    products: [Product!]!
    images: [Image!]!
    documents: [Document!]!
    metrics: JSON
    testimonial: Testimonial
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Testimonial {
    quote: String!
    author: String!
    position: String
    company: String
    avatar: Image
  }

  type News {
    id: ID!
    title: String!
    excerpt: String
    content: String!
    author: User!
    category: String!
    tags: [String!]!
    featuredImage: Image
    published: Boolean!
    publishedAt: DateTime
    views: Int
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Solution {
    id: ID!
    title: String!
    description: String
    summary: String
    industry: String!
    targetMarket: String
    complexity: SolutionComplexity!
    products: [Product!]!
    bomList: [BOMItem!]!
    caseStudies: [CaseStudy!]!
    features: [String!]!
    advantages: [String!]!
    images: [Image!]!
    documents: [Document!]!
    estimatedCost: Float
    developmentTime: Int
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum SolutionComplexity {
    SIMPLE
    MODERATE
    COMPLEX
    ADVANCED
  }

  type BOMItem {
    id: ID!
    product: Product!
    quantity: Int!
    unitPrice: Float
    totalPrice: Float
    category: String
    description: String
    supplier: String
    partNumber: String
    leadTime: Int
  }

  # Search and Analytics Types
  type SearchResult {
    products: ProductSearchResult!
    applications: ApplicationSearchResult!
    caseStudies: CaseStudySearchResult!
    news: NewsSearchResult!
    solutions: SolutionSearchResult!
    suggestions: [String!]!
  }

  type ProductSearchResult {
    items: [Product!]!
    total: Int!
    facets: SearchFacets!
  }

  type ApplicationSearchResult {
    items: [Application!]!
    total: Int!
  }

  type CaseStudySearchResult {
    items: [CaseStudy!]!
    total: Int!
  }

  type NewsSearchResult {
    items: [News!]!
    total: Int!
  }

  type SolutionSearchResult {
    items: [Solution!]!
    total: Int!
  }

  type SearchFacets {
    categories: [FacetItem!]!
    manufacturers: [FacetItem!]!
    priceRanges: [FacetItem!]!
    tags: [FacetItem!]!
  }

  type FacetItem {
    value: String!
    count: Int!
    label: String
  }

  type Analytics {
    productViews: [ProductView!]!
    searchQueries: [SearchQuery!]!
    inquiryTrends: [InquiryTrend!]!
    userActivity: [UserActivity!]!
  }

  type ProductView {
    productId: ID!
    product: Product!
    views: Int!
    period: String!
  }

  type SearchQuery {
    query: String!
    count: Int!
    results: Int!
    period: String!
  }

  type InquiryTrend {
    period: String!
    count: Int!
    value: Float!
  }

  type UserActivity {
    userId: ID!
    user: User!
    activities: Int!
    period: String!
  }

  # API Response Types
  type ProductConnection {
    nodes: [Product!]!
    edges: [ProductEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type ProductEdge {
    node: Product!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type MutationResponse {
    success: Boolean!
    message: String!
    errors: [Error!]
  }

  type Error {
    field: String
    message: String!
    code: String
  }

  # File Upload Types
  type FileUploadResponse {
    id: ID!
    filename: String!
    mimetype: String!
    encoding: String!
    url: URL!
    size: Int!
    success: Boolean!
    message: String
  }

  # Subscription Types
  type ProductUpdate {
    mutation: String!
    node: Product!
    previousValues: Product
  }

  type InquiryUpdate {
    mutation: String!
    node: Inquiry!
    previousValues: Inquiry
  }

  # Root Types
  type Query {
    # Product Queries
    product(id: ID!): Product
    products(
      filter: ProductFilter
      sort: ProductSort
      pagination: PaginationInput
    ): ProductConnection!
    
    popularProducts(limit: Int = 10): [Product!]!
    featuredProducts(limit: Int = 10): [Product!]!
    newProducts(limit: Int = 10): [Product!]!
    relatedProducts(productId: ID!, limit: Int = 10): [Product!]!
    
    # User Queries
    user(id: ID!): User
    users(filter: JSON, pagination: PaginationInput): [User!]!
    currentUser: User
    
    # Inquiry Queries
    inquiry(id: ID!): Inquiry
    inquiries(
      filter: JSON
      pagination: PaginationInput
    ): [Inquiry!]!
    myInquiries: [Inquiry!]!
    
    # Order Queries
    order(id: ID!): Order
    orders(filter: JSON, pagination: PaginationInput): [Order!]!
    myOrders: [Order!]!
    
    # Content Queries
    application(id: ID!): Application
    applications(filter: JSON, pagination: PaginationInput): [Application!]!
    
    caseStudy(id: ID!): CaseStudy
    caseStudies(filter: JSON, pagination: PaginationInput): [CaseStudy!]!
    
    news(id: ID!): News
    newsArticles(filter: JSON, pagination: PaginationInput): [News!]!
    
    solution(id: ID!): Solution
    solutions(filter: JSON, pagination: PaginationInput): [Solution!]!
    
    # Search Queries
    search(query: String!, filters: JSON, pagination: PaginationInput): SearchResult!
    searchSuggestions(query: String!, limit: Int = 10): [String!]!
    
    # Analytics Queries
    analytics(period: String, filters: JSON): Analytics!
    productAnalytics(productId: ID!, period: String): JSON!
    
    # System Queries
    categories: [String!]!
    manufacturers: [String!]!
    countries: [String!]!
    currencies: [String!]!
  }

  type Mutation {
    # Product Mutations
    createProduct(input: CreateProductInput!): Product!
    updateProduct(input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): MutationResponse!
    
    # User Mutations
    createUser(input: UserInput!): User!
    updateUser(id: ID!, input: UserInput!): User!
    deleteUser(id: ID!): MutationResponse!
    
    # Authentication Mutations
    login(email: EmailAddress!, password: String!): AuthPayload!
    logout: MutationResponse!
    resetPassword(email: EmailAddress!): MutationResponse!
    changePassword(currentPassword: String!, newPassword: String!): MutationResponse!
    
    # Inquiry Mutations
    createInquiry(input: CreateInquiryInput!): Inquiry!
    updateInquiry(id: ID!, input: JSON!): Inquiry!
    respondToInquiry(inquiryId: ID!, response: String!, quotedItems: [JSON!]): InquiryResponse!
    updateInquiryStatus(id: ID!, status: InquiryStatus!): Inquiry!
    
    # Order Mutations
    createOrder(input: JSON!): Order!
    updateOrder(id: ID!, input: JSON!): Order!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!
    
    # Review Mutations
    createReview(productId: ID!, rating: Int!, title: String, content: String): Review!
    updateReview(id: ID!, rating: Int, title: String, content: String): Review!
    deleteReview(id: ID!): MutationResponse!
    
    # File Upload Mutations
    uploadFile(file: Upload!): FileUploadResponse!
    uploadFiles(files: [Upload!]!): [FileUploadResponse!]!
    
    # Favorite Mutations
    addToFavorites(productId: ID!): MutationResponse!
    removeFromFavorites(productId: ID!): MutationResponse!
    
    # Cart Mutations
    addToCart(productId: ID!, quantity: Int!): MutationResponse!
    updateCartItem(productId: ID!, quantity: Int!): MutationResponse!
    removeFromCart(productId: ID!): MutationResponse!
    clearCart: MutationResponse!
  }

  type Subscription {
    # Product Subscriptions
    productUpdated(id: ID!): ProductUpdate!
    newProduct: Product!
    
    # Inquiry Subscriptions
    inquiryUpdated(id: ID!): InquiryUpdate!
    newInquiry: Inquiry!
    
    # Order Subscriptions
    orderUpdated(id: ID!): Order!
    newOrder: Order!
    
    # User Activity Subscriptions
    userActivity(userId: ID!): UserActivity!
    
    # System Notifications
    systemNotification: JSON!
  }

  # Authentication Types
  type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
    expiresIn: Int!
  }
`;
