import { BaseIntegration, IntegrationConfig, IntegrationResponse, WebhookPayload } from './base-integration'

export interface PaymentMethod {
  id?: string
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'digital_wallet' | 'cryptocurrency'
  provider: string
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  holderName?: string
  billingAddress?: Address
  isDefault?: boolean
  metadata?: Record<string, any>
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode: string
  country: string
}

export interface PaymentIntent {
  id?: string
  amount: number
  currency: string
  description?: string
  customerId?: string
  paymentMethodId?: string
  status?: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded'
  clientSecret?: string
  metadata?: Record<string, any>
  receiptEmail?: string
  setupFutureUsage?: 'on_session' | 'off_session'
  captureMethod?: 'automatic' | 'manual'
  confirmationMethod?: 'automatic' | 'manual'
  createdAt?: string
  updatedAt?: string
}

export interface PaymentCharge {
  id: string
  amount: number
  amountCaptured?: number
  amountRefunded?: number
  currency: string
  description?: string
  status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'disputed' | 'refunded'
  paymentMethod: PaymentMethod
  customer?: PaymentCustomer
  receiptUrl?: string
  failureCode?: string
  failureMessage?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt?: string
}

export interface PaymentCustomer {
  id?: string
  email: string
  name?: string
  phone?: string
  description?: string
  defaultPaymentMethod?: string
  invoiceSettings?: {
    defaultPaymentMethod?: string
    customFields?: Array<{
      name: string
      value: string
    }>
  }
  shipping?: {
    address: Address
    name: string
    phone?: string
  }
  taxIds?: Array<{
    type: string
    value: string
  }>
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

export interface PaymentRefund {
  id?: string
  chargeId: string
  amount?: number // If not provided, refunds full amount
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge'
  metadata?: Record<string, any>
  status?: 'pending' | 'succeeded' | 'failed' | 'canceled'
  receiptNumber?: string
  createdAt?: string
}

export interface PaymentSubscription {
  id?: string
  customerId: string
  priceId: string
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused'
  currentPeriodStart: string
  currentPeriodEnd: string
  trialEnd?: string
  cancelAt?: string
  canceledAt?: string
  endedAt?: string
  defaultPaymentMethod?: string
  items: Array<{
    priceId: string
    quantity: number
  }>
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

export interface PaymentIntegrationConfig extends IntegrationConfig {
  provider: 'stripe' | 'paypal' | 'square' | 'braintree' | 'razorpay' | 'custom'
  publishableKey?: string
  merchantId?: string
  currency: string
  webhookEndpoint?: string
  autoCapture?: boolean
  savePaymentMethods?: boolean
  enableSubscriptions?: boolean
  fraudDetection?: {
    enabled: boolean
    riskThreshold?: number
  }
  compliance?: {
    pci?: boolean
    gdpr?: boolean
    strongCustomerAuthentication?: boolean
  }
}

export class PaymentIntegration extends BaseIntegration {
  private paymentConfig: PaymentIntegrationConfig

  constructor(config: PaymentIntegrationConfig) {
    super('payment-integration', '1.0.0', config)
    this.paymentConfig = config
  }

  async connect(): Promise<IntegrationResponse<void>> {
    try {
      const healthResult = await this.healthCheck()
      if (!healthResult.success) {
        return {
          success: false,
          error: {
            code: 'CONNECTION_FAILED',
            message: 'Failed to connect to payment service',
            details: healthResult.error
          }
        }
      }

      this.isConnected = true
      this.lastError = null

      this.emit('connected', {
        timestamp: new Date().toISOString(),
        provider: this.paymentConfig.provider
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.lastError = error instanceof Error ? error : new Error(errorMessage)
      
      return {
        success: false,
        error: {
          code: 'CONNECTION_ERROR',
          message: errorMessage
        }
      }
    }
  }

  async disconnect(): Promise<IntegrationResponse<void>> {
    try {
      this.isConnected = false

      this.emit('disconnected', {
        timestamp: new Date().toISOString(),
        provider: this.paymentConfig.provider
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        error: {
          code: 'DISCONNECTION_ERROR',
          message: errorMessage
        }
      }
    }
  }

  async healthCheck(): Promise<IntegrationResponse<{ status: string; details?: any }>> {
    try {
      const response = await this.makeRequest('GET', `${this.config.baseUrl}/health`)
      
      return {
        success: true,
        data: {
          status: 'healthy',
          details: {
            provider: this.paymentConfig.provider,
            currency: this.paymentConfig.currency,
            apiVersion: response.data?.version,
            fraudDetection: this.paymentConfig.fraudDetection?.enabled
          }
        }
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'HEALTH_CHECK_FAILED',
          message: error instanceof Error ? error.message : 'Health check failed'
        }
      }
    }
  }

  async validateConfig(): Promise<IntegrationResponse<void>> {
    const requiredFields = ['baseUrl', 'apiKey', 'provider', 'currency']
    const missingFields = requiredFields.filter(field => !this.config[field as keyof IntegrationConfig] && !this.paymentConfig[field as keyof PaymentIntegrationConfig])

    if (missingFields.length > 0) {
      return {
        success: false,
        error: {
          code: 'INVALID_CONFIG',
          message: `Missing required configuration fields: ${missingFields.join(', ')}`
        }
      }
    }

    if (!['stripe', 'paypal', 'square', 'braintree', 'razorpay', 'custom'].includes(this.paymentConfig.provider)) {
      return {
        success: false,
        error: {
          code: 'INVALID_PROVIDER',
          message: `Unsupported payment provider: ${this.paymentConfig.provider}`
        }
      }
    }

    return { success: true }
  }

  // Payment Intent Management
  async createPaymentIntent(intent: PaymentIntent): Promise<IntegrationResponse<PaymentIntent>> {
    try {
      const response = await this.makeRequest<PaymentIntent>(
        'POST',
        `${this.config.baseUrl}/payment_intents`,
        {
          ...intent,
          currency: intent.currency || this.paymentConfig.currency,
          capture_method: this.paymentConfig.autoCapture ? 'automatic' : 'manual'
        }
      )

      if (response.success && response.data) {
        this.emit('payment_intent:created', {
          intentId: response.data.id,
          amount: response.data.amount,
          currency: response.data.currency,
          timestamp: new Date().toISOString()
        })
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_INTENT_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create payment intent'
        }
      }
    }
  }

  async confirmPaymentIntent(intentId: string, paymentMethodId?: string): Promise<IntegrationResponse<PaymentIntent>> {
    try {
      const requestData: any = {}
      if (paymentMethodId) {
        requestData.payment_method = paymentMethodId
      }

      const response = await this.makeRequest<PaymentIntent>(
        'POST',
        `${this.config.baseUrl}/payment_intents/${intentId}/confirm`,
        requestData
      )

      if (response.success && response.data) {
        this.emit('payment_intent:confirmed', {
          intentId: response.data.id,
          status: response.data.status,
          timestamp: new Date().toISOString()
        })
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_INTENT_CONFIRM_ERROR',
          message: error instanceof Error ? error.message : 'Failed to confirm payment intent'
        }
      }
    }
  }

  async capturePaymentIntent(intentId: string, amount?: number): Promise<IntegrationResponse<PaymentIntent>> {
    try {
      const requestData: any = {}
      if (amount) {
        requestData.amount_to_capture = amount
      }

      const response = await this.makeRequest<PaymentIntent>(
        'POST',
        `${this.config.baseUrl}/payment_intents/${intentId}/capture`,
        requestData
      )

      if (response.success && response.data) {
        this.emit('payment_intent:captured', {
          intentId: response.data.id,
          amountCaptured: amount || response.data.amount,
          timestamp: new Date().toISOString()
        })
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_INTENT_CAPTURE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to capture payment intent'
        }
      }
    }
  }

  async cancelPaymentIntent(intentId: string, reason?: string): Promise<IntegrationResponse<PaymentIntent>> {
    try {
      const requestData: any = {}
      if (reason) {
        requestData.cancellation_reason = reason
      }

      const response = await this.makeRequest<PaymentIntent>(
        'POST',
        `${this.config.baseUrl}/payment_intents/${intentId}/cancel`,
        requestData
      )

      if (response.success && response.data) {
        this.emit('payment_intent:canceled', {
          intentId: response.data.id,
          reason,
          timestamp: new Date().toISOString()
        })
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_INTENT_CANCEL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to cancel payment intent'
        }
      }
    }
  }

  // Customer Management
  async createCustomer(customer: PaymentCustomer): Promise<IntegrationResponse<PaymentCustomer>> {
    try {
      const response = await this.makeRequest<PaymentCustomer>(
        'POST',
        `${this.config.baseUrl}/customers`,
        customer
      )

      if (response.success && response.data) {
        this.emit('customer:created', {
          customerId: response.data.id,
          email: response.data.email,
          timestamp: new Date().toISOString()
        })
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CUSTOMER_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create customer'
        }
      }
    }
  }

  async updateCustomer(customerId: string, updates: Partial<PaymentCustomer>): Promise<IntegrationResponse<PaymentCustomer>> {
    try {
      const response = await this.makeRequest<PaymentCustomer>(
        'PUT',
        `${this.config.baseUrl}/customers/${customerId}`,
        updates
      )

      if (response.success && response.data) {
        this.emit('customer:updated', {
          customerId: response.data.id,
          timestamp: new Date().toISOString()
        })
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CUSTOMER_UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update customer'
        }
      }
    }
  }

  async getCustomer(customerId: string): Promise<IntegrationResponse<PaymentCustomer>> {
    try {
      return await this.makeRequest<PaymentCustomer>(
        'GET',
        `${this.config.baseUrl}/customers/${customerId}`
      )
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CUSTOMER_GET_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get customer'
        }
      }
    }
  }

  // Payment Method Management
  async createPaymentMethod(paymentMethod: PaymentMethod): Promise<IntegrationResponse<PaymentMethod>> {
    try {
      const response = await this.makeRequest<PaymentMethod>(
        'POST',
        `${this.config.baseUrl}/payment_methods`,
        paymentMethod
      )

      if (response.success && response.data) {
        this.emit('payment_method:created', {
          paymentMethodId: response.data.id,
          type: response.data.type,
          timestamp: new Date().toISOString()
        })
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_METHOD_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create payment method'
        }
      }
    }
  }

  async attachPaymentMethodToCustomer(paymentMethodId: string, customerId: string): Promise<IntegrationResponse<PaymentMethod>> {
    try {
      const response = await this.makeRequest<PaymentMethod>(
        'POST',
        `${this.config.baseUrl}/payment_methods/${paymentMethodId}/attach`,
        { customer: customerId }
      )

      if (response.success && response.data) {
        this.emit('payment_method:attached', {
          paymentMethodId: response.data.id,
          customerId,
          timestamp: new Date().toISOString()
        })
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_METHOD_ATTACH_ERROR',
          message: error instanceof Error ? error.message : 'Failed to attach payment method'
        }
      }
    }
  }

  // Refund Management
  async createRefund(refund: PaymentRefund): Promise<IntegrationResponse<PaymentRefund>> {
    try {
      const response = await this.makeRequest<PaymentRefund>(
        'POST',
        `${this.config.baseUrl}/refunds`,
        refund
      )

      if (response.success && response.data) {
        this.emit('refund:created', {
          refundId: response.data.id,
          chargeId: response.data.chargeId,
          amount: response.data.amount,
          timestamp: new Date().toISOString()
        })
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'REFUND_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create refund'
        }
      }
    }
  }

  // Subscription Management (if enabled)
  async createSubscription(subscription: PaymentSubscription): Promise<IntegrationResponse<PaymentSubscription>> {
    if (!this.paymentConfig.enableSubscriptions) {
      return {
        success: false,
        error: {
          code: 'SUBSCRIPTIONS_DISABLED',
          message: 'Subscriptions are not enabled for this integration'
        }
      }
    }

    try {
      const response = await this.makeRequest<PaymentSubscription>(
        'POST',
        `${this.config.baseUrl}/subscriptions`,
        subscription
      )

      if (response.success && response.data) {
        this.emit('subscription:created', {
          subscriptionId: response.data.id,
          customerId: response.data.customerId,
          status: response.data.status,
          timestamp: new Date().toISOString()
        })
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SUBSCRIPTION_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create subscription'
        }
      }
    }
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = false): Promise<IntegrationResponse<PaymentSubscription>> {
    try {
      const response = await this.makeRequest<PaymentSubscription>(
        'DELETE',
        `${this.config.baseUrl}/subscriptions/${subscriptionId}`,
        { cancel_at_period_end: cancelAtPeriodEnd }
      )

      if (response.success && response.data) {
        this.emit('subscription:canceled', {
          subscriptionId: response.data.id,
          cancelAtPeriodEnd,
          timestamp: new Date().toISOString()
        })
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SUBSCRIPTION_CANCEL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to cancel subscription'
        }
      }
    }
  }

  // Fraud Detection
  async analyzeTransaction(transactionData: any): Promise<IntegrationResponse<{ riskScore: number; recommendation: string; details: any }>> {
    if (!this.paymentConfig.fraudDetection?.enabled) {
      return {
        success: true,
        data: {
          riskScore: 0,
          recommendation: 'proceed',
          details: { message: 'Fraud detection disabled' }
        }
      }
    }

    try {
      const response = await this.makeRequest<{ riskScore: number; recommendation: string; details: any }>(
        'POST',
        `${this.config.baseUrl}/fraud/analyze`,
        transactionData
      )

      if (response.success && response.data) {
        this.emit('fraud:analyzed', {
          riskScore: response.data.riskScore,
          recommendation: response.data.recommendation,
          timestamp: new Date().toISOString()
        })
      }

      return response
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FRAUD_ANALYSIS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to analyze transaction for fraud'
        }
      }
    }
  }

  // Webhook handling
  protected async handleWebhookEvent(payload: WebhookPayload): Promise<void> {
    switch (payload.event) {
      case 'payment_intent.succeeded':
        this.emit('payment:succeeded', payload)
        break
      
      case 'payment_intent.payment_failed':
        this.emit('payment:failed', payload)
        break
      
      case 'charge.dispute.created':
        this.emit('payment:disputed', payload)
        break
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        this.emit('subscription:webhook', payload)
        break
      
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
        this.emit('invoice:webhook', payload)
        break
      
      default:
        this.emit('webhook:unhandled', payload)
    }
  }

  // Utility methods
  public formatCurrency(amount: number, currency?: string): string {
    const curr = currency || this.paymentConfig.currency
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr
    }).format(amount / 100) // Assuming amounts are in cents
  }

  public getProviderSpecificConfig(): any {
    switch (this.paymentConfig.provider) {
      case 'stripe':
        return {
          publishableKey: this.paymentConfig.publishableKey,
          apiVersion: '2023-10-16'
        }
      case 'paypal':
        return {
          clientId: this.paymentConfig.publishableKey,
          environment: this.config.environment === 'production' ? 'live' : 'sandbox'
        }
      case 'square':
        return {
          applicationId: this.paymentConfig.publishableKey,
          locationId: this.paymentConfig.merchantId,
          environment: this.config.environment === 'production' ? 'production' : 'sandbox'
        }
      default:
        return {}
    }
  }
}