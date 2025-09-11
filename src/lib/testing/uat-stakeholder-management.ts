/**
 * UAT Stakeholder Management System
 * Manages stakeholder participation, sign-offs, and communication during UAT
 *
 * Features:
 * - Stakeholder registration and role management
 * - Sign-off workflow management
 * - Communication and notification system
 * - Feedback aggregation and analysis
 * - Decision tracking and approval workflows
 */

export interface Stakeholder {
  id: string
  name: string
  email: string
  role: StakeholderRole
  department: string
  authority: AuthorityLevel
  responsibilities: string[]
  contactPreferences: ContactPreference[]
  availability: AvailabilityWindow[]
}

export interface StakeholderRole {
  name: string
  type: 'business_owner' | 'end_user' | 'approver' | 'observer' | 'technical_reviewer'
  permissions: Permission[]
  mandatorySignOff: boolean
  escalationContact?: string
}

export interface Permission {
  action: string
  scope: string
  conditions?: string[]
}

export type AuthorityLevel = 'final_approver' | 'primary_reviewer' | 'secondary_reviewer' | 'contributor' | 'observer'

export interface ContactPreference {
  method: 'email' | 'phone' | 'slack' | 'teams' | 'in_person'
  priority: number
  timeRestrictions?: {
    days: string[]
    hours: { start: string; end: string }
    timezone: string
  }
}

export interface AvailabilityWindow {
  startDate: Date
  endDate: Date
  availability: 'available' | 'limited' | 'unavailable'
  notes?: string
}

export interface SignOffRequest {
  id: string
  title: string
  description: string
  category: 'functionality' | 'performance' | 'usability' | 'content' | 'security' | 'overall'
  requiredStakeholders: string[]
  optionalStakeholders: string[]
  dueDate: Date
  attachments: string[]
  criteria: SignOffCriteria[]
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'deferred'
  createdBy: string
  createdDate: Date
}

export interface SignOffCriteria {
  criterion: string
  description: string
  status: 'met' | 'not_met' | 'partially_met' | 'not_applicable'
  evidence?: string[]
  reviewerNotes?: string
}

export interface SignOffResponse {
  id: string
  requestId: string
  stakeholderId: string
  decision: 'approve' | 'reject' | 'conditional_approve' | 'delegate'
  comments: string
  conditions?: string[]
  delegatedTo?: string
  signOffDate: Date
  criteriaReviews: CriteriaReview[]
}

export interface CriteriaReview {
  criterionId: string
  assessment: 'met' | 'not_met' | 'partially_met' | 'requires_clarification'
  comments: string
  supportingEvidence?: string[]
}

export interface StakeholderFeedback {
  id: string
  stakeholderId: string
  category: 'functionality' | 'usability' | 'performance' | 'content' | 'design' | 'process'
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  affectedAreas: string[]
  suggestedSolution?: string
  businessImpact: string
  submittedDate: Date
  status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'rejected'
  assignedTo?: string
  resolution?: string
  resolutionDate?: Date
}

export interface CommunicationLog {
  id: string
  type: 'email' | 'meeting' | 'call' | 'message' | 'notification'
  subject: string
  participants: string[]
  content: string
  timestamp: Date
  relatedItems?: string[]
  followUpRequired: boolean
  followUpDate?: Date
}

export class StakeholderManager {
  private stakeholders: Map<string, Stakeholder> = new Map();
  private signOffRequests: Map<string, SignOffRequest> = new Map();
  private signOffResponses: Map<string, SignOffResponse[]> = new Map();
  private feedback: Map<string, StakeholderFeedback> = new Map();
  private communications: CommunicationLog[] = [];

  // Stakeholder Registration and Management
  public registerStakeholder(stakeholder: Omit<Stakeholder, 'id'>): string {
    const stakeholderId = `STAKEHOLDER-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const fullStakeholder: Stakeholder = {
      id: stakeholderId,
      ...stakeholder
    };

    this.stakeholders.set(stakeholderId, fullStakeholder);

    this.logCommunication({
      type: 'notification',
      subject: 'Stakeholder registered for UAT',
      participants: [stakeholder.email],
      content: `Welcome to the UAT process. You have been registered as: ${stakeholder.role.name}`,
      timestamp: new Date(),
      followUpRequired: false
    });

    console.log(`Stakeholder registered: ${stakeholder.name} (${stakeholder.role.name})`);
    return stakeholderId;
  }

  public getStakeholdersByRole(roleType: string): Stakeholder[] {
    return Array.from(this.stakeholders.values())
      .filter(s => s.role.type === roleType);
  }

  public getStakeholdersByAuthority(authorityLevel: AuthorityLevel): Stakeholder[] {
    return Array.from(this.stakeholders.values())
      .filter(s => s.authority === authorityLevel);
  }

  // Initialize default stakeholders for electronics distributor UAT
  public initializeDefaultStakeholders(): void {
    const defaultStakeholders = [
      {
        name: 'Sales Manager',
        email: 'sales.manager@company.com',
        role: {
          name: 'Primary Business Owner',
          type: 'business_owner' as const,
          permissions: [
            { action: 'approve_functionality', scope: 'sales_features' },
            { action: 'review_business_flows', scope: 'all' }
          ],
          mandatorySignOff: true
        },
        department: 'Sales',
        authority: 'final_approver' as const,
        responsibilities: [
          'Validate sales-related functionality',
          'Approve inquiry and quote processes',
          'Review customer-facing features'
        ],
        contactPreferences: [
          {
            method: 'email' as const,
            priority: 1,
            timeRestrictions: {
              days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              hours: { start: '08:00', end: '17:00' },
              timezone: 'UTC'
            }
          }
        ],
        availability: [
          {
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            availability: 'available' as const
          }
        ]
      },
      {
        name: 'Marketing Director',
        email: 'marketing.director@company.com',
        role: {
          name: 'Marketing Stakeholder',
          type: 'business_owner' as const,
          permissions: [
            { action: 'approve_content', scope: 'marketing_materials' },
            { action: 'review_branding', scope: 'all' }
          ],
          mandatorySignOff: true
        },
        department: 'Marketing',
        authority: 'primary_reviewer' as const,
        responsibilities: [
          'Validate brand consistency',
          'Review marketing content and messaging',
          'Approve SEO and content strategy implementation'
        ],
        contactPreferences: [
          {
            method: 'slack' as const,
            priority: 1
          }
        ],
        availability: [
          {
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            availability: 'available' as const
          }
        ]
      },
      {
        name: 'Customer Service Representative',
        email: 'cs.rep@company.com',
        role: {
          name: 'End User Representative',
          type: 'end_user' as const,
          permissions: [
            { action: 'test_user_flows', scope: 'customer_service' },
            { action: 'provide_feedback', scope: 'all' }
          ],
          mandatorySignOff: false
        },
        department: 'Customer Service',
        authority: 'contributor' as const,
        responsibilities: [
          'Test customer service workflows',
          'Validate customer inquiry processes',
          'Provide feedback on user experience'
        ],
        contactPreferences: [
          {
            method: 'email' as const,
            priority: 1
          }
        ],
        availability: [
          {
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            availability: 'limited' as const,
            notes: 'Available for testing sessions 2 hours per day'
          }
        ]
      },
      {
        name: 'IT Manager',
        email: 'it.manager@company.com',
        role: {
          name: 'Technical Reviewer',
          type: 'technical_reviewer' as const,
          permissions: [
            { action: 'review_security', scope: 'all' },
            { action: 'approve_integrations', scope: 'technical' }
          ],
          mandatorySignOff: true
        },
        department: 'IT',
        authority: 'primary_reviewer' as const,
        responsibilities: [
          'Review security implementations',
          'Validate system integrations',
          'Approve technical architecture decisions'
        ],
        contactPreferences: [
          {
            method: 'teams' as const,
            priority: 1
          }
        ],
        availability: [
          {
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            availability: 'available' as const
          }
        ]
      }
    ];

    defaultStakeholders.forEach(stakeholder => {
      this.registerStakeholder(stakeholder);
    });
  }

  // Sign-off Request Management
  public createSignOffRequest(request: Omit<SignOffRequest, 'id' | 'status' | 'createdDate'>): string {
    const requestId = `SIGNOFF-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const signOffRequest: SignOffRequest = {
      id: requestId,
      status: 'pending',
      createdDate: new Date(),
      ...request
    };

    this.signOffRequests.set(requestId, signOffRequest);
    this.signOffResponses.set(requestId, []);

    // Notify required stakeholders
    this.notifyStakeholders(request.requiredStakeholders, {
      subject: `Sign-off Required: ${request.title}`,
      content: `A new sign-off request requires your approval.\n\nTitle: ${request.title}\nDescription: ${request.description}\nDue Date: ${request.dueDate.toISOString()}`
    });

    console.log(`Sign-off request created: ${request.title}`);
    return requestId;
  }

  public createWeek17SignOffRequests(): string[] {
    const signOffRequests = [
      {
        title: 'Core Business Functionality Approval',
        description: 'Sign-off for core business functions including product search, inquiry process, and user management',
        category: 'functionality' as const,
        requiredStakeholders: this.getStakeholdersByRole('business_owner').map(s => s.id),
        optionalStakeholders: this.getStakeholdersByRole('end_user').map(s => s.id),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        attachments: ['business-functionality-test-results.pdf', 'user-workflow-validation.pdf'],
        criteria: [
          {
            criterion: 'Product search functionality',
            description: 'Search returns accurate results with proper filtering',
            status: 'met' as const,
            evidence: ['search-test-results.pdf']
          },
          {
            criterion: 'Inquiry submission process',
            description: 'Users can successfully submit inquiries and receive confirmations',
            status: 'met' as const,
            evidence: ['inquiry-process-validation.pdf']
          },
          {
            criterion: 'User registration and login',
            description: 'Registration and authentication work correctly',
            status: 'met' as const,
            evidence: ['auth-test-results.pdf']
          }
        ],
        createdBy: 'UAT Coordinator'
      },
      {
        title: 'User Experience and Accessibility Approval',
        description: 'Sign-off for user interface, accessibility compliance, and overall user experience',
        category: 'usability' as const,
        requiredStakeholders: [
          ...this.getStakeholdersByRole('business_owner').map(s => s.id),
          ...this.getStakeholdersByRole('end_user').map(s => s.id)
        ],
        optionalStakeholders: this.getStakeholdersByRole('observer').map(s => s.id),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        attachments: ['accessibility-audit-report.pdf', 'ux-testing-summary.pdf'],
        criteria: [
          {
            criterion: 'WCAG 2.1 AA Compliance',
            description: 'Website meets accessibility standards',
            status: 'met' as const,
            evidence: ['accessibility-compliance-report.pdf']
          },
          {
            criterion: 'Mobile responsiveness',
            description: 'Website works properly on mobile devices',
            status: 'met' as const,
            evidence: ['mobile-testing-results.pdf']
          },
          {
            criterion: 'User interface consistency',
            description: 'UI elements are consistent and intuitive',
            status: 'partially_met' as const,
            evidence: ['ui-review-feedback.pdf']
          }
        ],
        createdBy: 'UX Lead'
      },
      {
        title: 'Performance and Security Approval',
        description: 'Technical sign-off for system performance, security, and infrastructure',
        category: 'performance' as const,
        requiredStakeholders: this.getStakeholdersByRole('technical_reviewer').map(s => s.id),
        optionalStakeholders: this.getStakeholdersByRole('business_owner').map(s => s.id),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        attachments: ['performance-test-report.pdf', 'security-audit-results.pdf'],
        criteria: [
          {
            criterion: 'Page load performance',
            description: 'Pages load within acceptable time limits',
            status: 'met' as const,
            evidence: ['performance-metrics.pdf']
          },
          {
            criterion: 'Security implementation',
            description: 'Security measures are properly implemented',
            status: 'met' as const,
            evidence: ['security-testing-report.pdf']
          },
          {
            criterion: 'System stability under load',
            description: 'System remains stable under expected load',
            status: 'met' as const,
            evidence: ['load-testing-results.pdf']
          }
        ],
        createdBy: 'Technical Lead'
      }
    ];

    return signOffRequests.map(request => this.createSignOffRequest(request));
  }

  // Sign-off Response Management
  public submitSignOffResponse(response: Omit<SignOffResponse, 'id' | 'signOffDate'>): string {
    const responseId = `RESPONSE-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const signOffResponse: SignOffResponse = {
      id: responseId,
      signOffDate: new Date(),
      ...response
    };

    const existingResponses = this.signOffResponses.get(response.requestId) || [];
    existingResponses.push(signOffResponse);
    this.signOffResponses.set(response.requestId, existingResponses);

    // Update request status if all required stakeholders have responded
    this.updateSignOffRequestStatus(response.requestId);

    const stakeholder = this.stakeholders.get(response.stakeholderId);
    this.logCommunication({
      type: 'notification',
      subject: 'Sign-off response received',
      participants: [stakeholder?.email || 'unknown'],
      content: `Sign-off response received: ${response.decision}`,
      timestamp: new Date(),
      followUpRequired: response.decision === 'conditional_approve' || response.decision === 'reject'
    });

    console.log(`Sign-off response submitted: ${response.decision} by ${stakeholder?.name}`);
    return responseId;
  }

  private updateSignOffRequestStatus(requestId: string): void {
    const request = this.signOffRequests.get(requestId);
    const responses = this.signOffResponses.get(requestId) || [];

    if (!request) return;

    const requiredStakeholders = new Set(request.requiredStakeholders);
    const respondedStakeholders = new Set(responses.map(r => r.stakeholderId));

    // Check if all required stakeholders have responded
    const allRequiredResponded = Array.from(requiredStakeholders)
      .every(stakeholderId => respondedStakeholders.has(stakeholderId));

    if (allRequiredResponded) {
      const hasRejection = responses.some(r => r.decision === 'reject');
      const hasConditional = responses.some(r => r.decision === 'conditional_approve');

      if (hasRejection) {
        request.status = 'rejected';
      } else if (hasConditional) {
        request.status = 'in_review';
      } else {
        request.status = 'approved';
      }

      this.signOffRequests.set(requestId, request);
    }
  }

  // Feedback Management
  public collectStakeholderFeedback(feedback: Omit<StakeholderFeedback, 'id' | 'submittedDate' | 'status'>): string {
    const feedbackId = `FEEDBACK-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const stakeholderFeedback: StakeholderFeedback = {
      id: feedbackId,
      submittedDate: new Date(),
      status: 'open',
      ...feedback
    };

    this.feedback.set(feedbackId, stakeholderFeedback);

    const stakeholder = this.stakeholders.get(feedback.stakeholderId);
    console.log(`Feedback collected from ${stakeholder?.name}: ${feedback.title}`);

    return feedbackId;
  }

  public getFeedbackByCategory(): Record<string, StakeholderFeedback[]> {
    const feedbackArray = Array.from(this.feedback.values());
    const categorized: Record<string, StakeholderFeedback[]> = {};

    for (const feedback of feedbackArray) {
      if (!categorized[feedback.category]) {
        categorized[feedback.category] = [];
      }
      categorized[feedback.category].push(feedback);
    }

    return categorized;
  }

  public getFeedbackByPriority(): Record<string, StakeholderFeedback[]> {
    const feedbackArray = Array.from(this.feedback.values());
    const prioritized: Record<string, StakeholderFeedback[]> = {};

    for (const feedback of feedbackArray) {
      if (!prioritized[feedback.priority]) {
        prioritized[feedback.priority] = [];
      }
      prioritized[feedback.priority].push(feedback);
    }

    return prioritized;
  }

  // Communication Management
  private logCommunication(communication: Omit<CommunicationLog, 'id'>): void {
    const communicationId = `COMM-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const fullCommunication: CommunicationLog = {
      id: communicationId,
      ...communication
    };

    this.communications.push(fullCommunication);
  }

  public notifyStakeholders(stakeholderIds: string[], message: {
    subject: string
    content: string
    priority?: 'high' | 'medium' | 'low'
    attachments?: string[]
  }): void {
    const stakeholders = stakeholderIds
      .map(id => this.stakeholders.get(id))
      .filter(Boolean) as Stakeholder[];

    for (const stakeholder of stakeholders) {
      const preferredMethod = stakeholder.contactPreferences[0]?.method || 'email';

      console.log(`Sending notification to ${stakeholder.name} via ${preferredMethod}`);
      console.log(`Subject: ${message.subject}`);
      console.log(`Content: ${message.content}`);

      this.logCommunication({
        type: preferredMethod as any,
        subject: message.subject,
        participants: [stakeholder.email],
        content: message.content,
        timestamp: new Date(),
        followUpRequired: false
      });
    }
  }

  // Reporting and Analytics
  public generateStakeholderReport(): any {
    const stakeholderArray = Array.from(this.stakeholders.values());
    const signOffRequestArray = Array.from(this.signOffRequests.values());
    const feedbackArray = Array.from(this.feedback.values());

    return {
      stakeholderSummary: {
        total: stakeholderArray.length,
        byRole: this.countByField(stakeholderArray, 'role.type'),
        byAuthority: this.countByField(stakeholderArray, 'authority'),
        byDepartment: this.countByField(stakeholderArray, 'department')
      },
      signOffStatus: {
        totalRequests: signOffRequestArray.length,
        byStatus: this.countByField(signOffRequestArray, 'status'),
        responseRate: this.calculateResponseRate(),
        averageResponseTime: this.calculateAverageResponseTime()
      },
      feedbackSummary: {
        totalFeedback: feedbackArray.length,
        byCategory: this.countByField(feedbackArray, 'category'),
        byPriority: this.countByField(feedbackArray, 'priority'),
        byStatus: this.countByField(feedbackArray, 'status')
      },
      communicationStats: {
        totalCommunications: this.communications.length,
        byType: this.countByField(this.communications, 'type'),
        followUpRequired: this.communications.filter(c => c.followUpRequired).length
      }
    };
  }

  private countByField(array: any[], field: string): Record<string, number> {
    return array.reduce((acc, item) => {
      const value = this.getNestedField(item, field);
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  private getNestedField(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private calculateResponseRate(): number {
    const totalRequests = this.signOffRequests.size;
    const requestsWithResponses = Array.from(this.signOffResponses.values())
      .filter(responses => responses.length > 0).length;

    return totalRequests > 0 ? requestsWithResponses / totalRequests : 0;
  }

  private calculateAverageResponseTime(): number {
    let totalTime = 0;
    let responseCount = 0;

    for (const [requestId, responses] of this.signOffResponses.entries()) {
      const request = this.signOffRequests.get(requestId);
      if (!request) continue;

      for (const response of responses) {
        const responseTime = response.signOffDate.getTime() - request.createdDate.getTime();
        totalTime += responseTime;
        responseCount++;
      }
    }

    return responseCount > 0 ? totalTime / responseCount / (24 * 60 * 60 * 1000) : 0; // Return in days
  }

  // Utility Methods
  public getSignOffRequestStatus(requestId: string): SignOffRequest | null {
    return this.signOffRequests.get(requestId) || null;
  }

  public getStakeholderById(stakeholderId: string): Stakeholder | null {
    return this.stakeholders.get(stakeholderId) || null;
  }

  public getPendingSignOffs(stakeholderId: string): SignOffRequest[] {
    return Array.from(this.signOffRequests.values())
      .filter(request =>
        request.requiredStakeholders.includes(stakeholderId) &&
        request.status === 'pending' &&
        !this.hasStakeholderResponded(request.id, stakeholderId)
      );
  }

  private hasStakeholderResponded(requestId: string, stakeholderId: string): boolean {
    const responses = this.signOffResponses.get(requestId) || [];
    return responses.some(response => response.stakeholderId === stakeholderId);
  }
}

// Export utility functions
export function createSampleStakeholderManager(): StakeholderManager {
  const manager = new StakeholderManager();
  manager.initializeDefaultStakeholders();
  return manager;
}
