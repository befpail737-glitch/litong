import { client, withRetry, SanityError } from './client';

export interface CompanyInfo {
  _id: string;
  name: string;
  description?: string;
  mission?: string;
  vision?: string;
  values?: Array<{
    title: string;
    description: string;
  }>;
  founded?: string;
  headquarters?: string;
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
    workingHours?: string;
  };
  stats?: {
    yearsExperience?: number;
    employeeCount?: number;
    clientCount?: number;
    projectCount?: number;
  };
  team?: Array<{
    name: string;
    position: string;
    bio?: string;
    image?: any;
    social?: {
      linkedin?: string;
      twitter?: string;
    };
  }>;
  achievements?: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    image?: any;
  }>;
  isActive: boolean;
}

// 获取公司信息
export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  try {
    const query = `*[_type == "company" && isActive == true && !(_id in path("drafts.**"))][0] {
      _id,
      name,
      description,
      mission,
      vision,
      values,
      founded,
      headquarters,
      contact,
      stats,
      team[] {
        name,
        position,
        bio,
        image,
        social
      },
      achievements[] {
        year,
        title,
        description
      },
      certifications[] {
        name,
        issuer,
        image
      },
      isActive
    }`;

    const company = await withRetry(() => client.fetch(query));
    return company || null;
  } catch (error) {
    console.error('Error fetching company info:', error);
    throw new SanityError('Failed to fetch company info', 'FETCH_COMPANY_ERROR');
  }
}

// 获取公司统计数据（简化版，用于快速显示）
export async function getCompanyStats() {
  try {
    const company = await getCompanyInfo();
    
    if (company?.stats) {
      return company.stats;
    }
    
    // 如果没有CMS数据，返回默认值
    return {
      yearsExperience: 15,
      employeeCount: 50,
      clientCount: 500,
      projectCount: 1000
    };
  } catch (error) {
    console.error('Error fetching company stats:', error);
    return {
      yearsExperience: 15,
      employeeCount: 50,
      clientCount: 500,
      projectCount: 1000
    };
  }
}

// 获取团队信息
export async function getTeamMembers() {
  try {
    const company = await getCompanyInfo();
    return company?.team || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}