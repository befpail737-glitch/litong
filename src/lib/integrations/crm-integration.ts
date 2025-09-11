import { BaseIntegration, IntegrationConfig, IntegrationResponse, WebhookPayload } from './base-integration';

export interface CRMContact {
  id?: string
  email: string
  firstName?: string
  lastName?: string
  company?: string
  phone?: string
  jobTitle?: string
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
  }
  customFields?: Record<string, any>
  tags?: string[]
  source?: string
  createdAt?: string
  updatedAt?: string
}

export interface CRMDeal {
  id?: string
  title: string
  contactId?: string
  value?: number
  currency?: string
  stage?: string
  probability?: number
  expectedCloseDate?: string
  description?: string
  customFields?: Record<string, any>
  products?: Array<{
    productId: string
    name: string
    quantity: number
    unitPrice: number
  }>
  createdAt?: string
  updatedAt?: string
}

export interface CRMActivity {
  id?: string
  type: 'call' | 'email' | 'meeting' | 'task' | 'note'
  subject: string
  description?: string
  contactId?: string
  dealId?: string
  dueDate?: string
  completedAt?: string
  assignedTo?: string
  createdAt?: string
}

export interface CRMIntegrationConfig extends IntegrationConfig {
  crmType: 'salesforce' | 'hubspot' | 'pipedrive' | 'zoho' | 'custom'
  syncEnabled?: boolean
  syncInterval?: number // in minutes
  autoCreateContacts?: boolean
  autoCreateDeals?: boolean
  defaultOwner?: string
  fieldMappings?: Record<string, string>
}

export class CRMIntegration extends BaseIntegration {
  private crmConfig: CRMIntegrationConfig;
  private syncTimer: NodeJS.Timeout | null = null;

  constructor(config: CRMIntegrationConfig) {
    super('crm-integration', '1.0.0', config);
    this.crmConfig = config;
  }

  async connect(): Promise<IntegrationResponse<void>> {
    try {
      // Test connection with a simple API call
      const healthResult = await this.healthCheck();
      if (!healthResult.success) {
        return {
          success: false,
          error: {
            code: 'CONNECTION_FAILED',
            message: 'Failed to connect to CRM service',
            details: healthResult.error
          }
        };
      }

      this.isConnected = true;
      this.lastError = null;

      // Start sync if enabled
      if (this.crmConfig.syncEnabled) {
        this.startSync();
      }

      this.emit('connected', {
        timestamp: new Date().toISOString(),
        crmType: this.crmConfig.crmType
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.lastError = error instanceof Error ? error : new Error(errorMessage);

      return {
        success: false,
        error: {
          code: 'CONNECTION_ERROR',
          message: errorMessage
        }
      };
    }
  }

  async disconnect(): Promise<IntegrationResponse<void>> {
    try {
      this.isConnected = false;
      this.stopSync();

      this.emit('disconnected', {
        timestamp: new Date().toISOString(),
        crmType: this.crmConfig.crmType
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'DISCONNECTION_ERROR',
          message: errorMessage
        }
      };
    }
  }

  async healthCheck(): Promise<IntegrationResponse<{ status: string; details?: any }>> {
    try {
      const response = await this.makeRequest('GET', `${this.config.baseUrl}/health`);

      return {
        success: true,
        data: {
          status: 'healthy',
          details: {
            crmType: this.crmConfig.crmType,
            apiVersion: response.data?.version,
            rateLimitRemaining: response.metadata?.rateLimitRemaining
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'HEALTH_CHECK_FAILED',
          message: error instanceof Error ? error.message : 'Health check failed'
        }
      };
    }
  }

  async validateConfig(): Promise<IntegrationResponse<void>> {
    const requiredFields = ['baseUrl', 'apiKey', 'crmType'];
    const missingFields = requiredFields.filter(field => !this.config[field as keyof IntegrationConfig]);

    if (missingFields.length > 0) {
      return {
        success: false,
        error: {
          code: 'INVALID_CONFIG',
          message: `Missing required configuration fields: ${missingFields.join(', ')}`
        }
      };
    }

    if (!['salesforce', 'hubspot', 'pipedrive', 'zoho', 'custom'].includes(this.crmConfig.crmType)) {
      return {
        success: false,
        error: {
          code: 'INVALID_CRM_TYPE',
          message: `Unsupported CRM type: ${this.crmConfig.crmType}`
        }
      };
    }

    return { success: true };
  }

  // Contact Management
  async createContact(contact: CRMContact): Promise<IntegrationResponse<CRMContact>> {
    try {
      const mappedContact = this.mapContactFields(contact, 'create');
      const response = await this.makeRequest<CRMContact>(
        'POST',
        `${this.config.baseUrl}/contacts`,
        mappedContact
      );

      if (response.success && response.data) {
        this.emit('contact:created', {
          contactId: response.data.id,
          email: response.data.email,
          timestamp: new Date().toISOString()
        });
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CONTACT_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create contact'
        }
      };
    }
  }

  async updateContact(contactId: string, updates: Partial<CRMContact>): Promise<IntegrationResponse<CRMContact>> {
    try {
      const mappedUpdates = this.mapContactFields(updates, 'update');
      const response = await this.makeRequest<CRMContact>(
        'PUT',
        `${this.config.baseUrl}/contacts/${contactId}`,
        mappedUpdates
      );

      if (response.success && response.data) {
        this.emit('contact:updated', {
          contactId: response.data.id,
          timestamp: new Date().toISOString()
        });
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CONTACT_UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update contact'
        }
      };
    }
  }

  async getContact(contactId: string): Promise<IntegrationResponse<CRMContact>> {
    try {
      const response = await this.makeRequest<CRMContact>(
        'GET',
        `${this.config.baseUrl}/contacts/${contactId}`
      );

      if (response.success && response.data) {
        response.data = this.mapContactFields(response.data, 'read');
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CONTACT_GET_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get contact'
        }
      };
    }
  }

  async findContactByEmail(email: string): Promise<IntegrationResponse<CRMContact | null>> {
    try {
      const response = await this.makeRequest<{ contacts: CRMContact[] }>(
        'GET',
        `${this.config.baseUrl}/contacts/search?email=${encodeURIComponent(email)}`
      );

      if (response.success && response.data?.contacts?.length > 0) {
        const contact = this.mapContactFields(response.data.contacts[0], 'read');
        return {
          success: true,
          data: contact,
          metadata: response.metadata
        };
      }

      return {
        success: true,
        data: null,
        metadata: response.metadata
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CONTACT_SEARCH_ERROR',
          message: error instanceof Error ? error.message : 'Failed to search contact'
        }
      };
    }
  }

  // Deal Management
  async createDeal(deal: CRMDeal): Promise<IntegrationResponse<CRMDeal>> {
    try {
      const mappedDeal = this.mapDealFields(deal, 'create');
      const response = await this.makeRequest<CRMDeal>(
        'POST',
        `${this.config.baseUrl}/deals`,
        mappedDeal
      );

      if (response.success && response.data) {
        this.emit('deal:created', {
          dealId: response.data.id,
          title: response.data.title,
          value: response.data.value,
          timestamp: new Date().toISOString()
        });
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DEAL_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create deal'
        }
      };
    }
  }

  async updateDeal(dealId: string, updates: Partial<CRMDeal>): Promise<IntegrationResponse<CRMDeal>> {
    try {
      const mappedUpdates = this.mapDealFields(updates, 'update');
      const response = await this.makeRequest<CRMDeal>(
        'PUT',
        `${this.config.baseUrl}/deals/${dealId}`,
        mappedUpdates
      );

      if (response.success && response.data) {
        this.emit('deal:updated', {
          dealId: response.data.id,
          stage: response.data.stage,
          timestamp: new Date().toISOString()
        });
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DEAL_UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update deal'
        }
      };
    }
  }

  // Activity Management
  async createActivity(activity: CRMActivity): Promise<IntegrationResponse<CRMActivity>> {
    try {
      const mappedActivity = this.mapActivityFields(activity, 'create');
      const response = await this.makeRequest<CRMActivity>(
        'POST',
        `${this.config.baseUrl}/activities`,
        mappedActivity
      );

      if (response.success && response.data) {
        this.emit('activity:created', {
          activityId: response.data.id,
          type: response.data.type,
          timestamp: new Date().toISOString()
        });
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ACTIVITY_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create activity'
        }
      };
    }
  }

  // Sync functionality
  private startSync(): void {
    if (this.syncTimer) {
      this.stopSync();
    }

    const interval = (this.crmConfig.syncInterval || 30) * 60 * 1000; // Convert minutes to milliseconds
    this.syncTimer = setInterval(() => {
      this.performSync().catch(error => {
        this.emit('sync:error', {
          error: error.message,
          timestamp: new Date().toISOString()
        });
      });
    }, interval);

    this.emit('sync:started', {
      interval: this.crmConfig.syncInterval,
      timestamp: new Date().toISOString()
    });
  }

  private stopSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;

      this.emit('sync:stopped', {
        timestamp: new Date().toISOString()
      });
    }
  }

  private async performSync(): Promise<void> {
    try {
      this.emit('sync:started', {
        timestamp: new Date().toISOString()
      });

      // Sync logic would be implemented here
      // This could include:
      // - Pulling new/updated contacts from CRM
      // - Pushing new inquiries as leads/deals
      // - Updating contact information
      // - Syncing activities

      this.emit('sync:completed', {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.emit('sync:error', {
        error: error instanceof Error ? error.message : 'Unknown sync error',
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  // Field mapping utilities
  private mapContactFields(contact: Partial<CRMContact>, operation: 'create' | 'update' | 'read'): Partial<CRMContact> {
    if (!this.crmConfig.fieldMappings) {
      return contact;
    }

    const mapped: any = { ...contact };

    // Apply field mappings based on CRM type
    switch (this.crmConfig.crmType) {
      case 'salesforce':
        return this.mapSalesforceContactFields(mapped, operation);
      case 'hubspot':
        return this.mapHubSpotContactFields(mapped, operation);
      case 'pipedrive':
        return this.mapPipedriveContactFields(mapped, operation);
      default:
        return mapped;
    }
  }

  private mapDealFields(deal: Partial<CRMDeal>, operation: 'create' | 'update' | 'read'): Partial<CRMDeal> {
    if (!this.crmConfig.fieldMappings) {
      return deal;
    }

    const mapped: any = { ...deal };

    // Apply field mappings based on CRM type
    switch (this.crmConfig.crmType) {
      case 'salesforce':
        return this.mapSalesforceDealFields(mapped, operation);
      case 'hubspot':
        return this.mapHubSpotDealFields(mapped, operation);
      case 'pipedrive':
        return this.mapPipedriveDealFields(mapped, operation);
      default:
        return mapped;
    }
  }

  private mapActivityFields(activity: Partial<CRMActivity>, operation: 'create' | 'update' | 'read'): Partial<CRMActivity> {
    // Similar mapping logic for activities
    return activity;
  }

  // CRM-specific field mapping methods
  private mapSalesforceContactFields(contact: any, operation: string): any {
    const mappings: Record<string, string> = {
      firstName: 'FirstName',
      lastName: 'LastName',
      email: 'Email',
      phone: 'Phone',
      company: 'Account.Name',
      jobTitle: 'Title'
    };

    return this.applyFieldMappings(contact, mappings, operation);
  }

  private mapHubSpotContactFields(contact: any, operation: string): any {
    const mappings: Record<string, string> = {
      firstName: 'firstname',
      lastName: 'lastname',
      email: 'email',
      phone: 'phone',
      company: 'company',
      jobTitle: 'jobtitle'
    };

    return this.applyFieldMappings(contact, mappings, operation);
  }

  private mapPipedriveContactFields(contact: any, operation: string): any {
    const mappings: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      email: 'email',
      phone: 'phone',
      company: 'org_name',
      jobTitle: 'job_title'
    };

    return this.applyFieldMappings(contact, mappings, operation);
  }

  private mapSalesforceDealFields(deal: any, operation: string): any {
    const mappings: Record<string, string> = {
      title: 'Name',
      value: 'Amount',
      stage: 'StageName',
      probability: 'Probability',
      expectedCloseDate: 'CloseDate'
    };

    return this.applyFieldMappings(deal, mappings, operation);
  }

  private mapHubSpotDealFields(deal: any, operation: string): any {
    const mappings: Record<string, string> = {
      title: 'dealname',
      value: 'amount',
      stage: 'dealstage',
      probability: 'probability',
      expectedCloseDate: 'closedate'
    };

    return this.applyFieldMappings(deal, mappings, operation);
  }

  private mapPipedriveDealFields(deal: any, operation: string): any {
    const mappings: Record<string, string> = {
      title: 'title',
      value: 'value',
      stage: 'stage_id',
      probability: 'probability',
      expectedCloseDate: 'expected_close_date'
    };

    return this.applyFieldMappings(deal, mappings, operation);
  }

  private applyFieldMappings(data: any, mappings: Record<string, string>, operation: string): any {
    const result: any = {};

    for (const [localField, crmField] of Object.entries(mappings)) {
      if (data[localField] !== undefined) {
        result[crmField] = data[localField];
      }
    }

    // Include unmapped fields
    for (const [key, value] of Object.entries(data)) {
      if (!mappings[key] && value !== undefined) {
        result[key] = value;
      }
    }

    return result;
  }

  protected async handleWebhookEvent(payload: WebhookPayload): Promise<void> {
    switch (payload.event) {
      case 'contact.created':
      case 'contact.updated':
        this.emit('contact:webhook', payload);
        break;

      case 'deal.created':
      case 'deal.updated':
      case 'deal.stage_changed':
        this.emit('deal:webhook', payload);
        break;

      case 'activity.created':
      case 'activity.completed':
        this.emit('activity:webhook', payload);
        break;

      default:
        this.emit('webhook:unhandled', payload);
    }
  }
}
