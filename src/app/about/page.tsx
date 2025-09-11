import { getCompanyInfo, getCompanyStats, getTeamMembers } from '../lib/sanity/company';
import { urlFor } from '../lib/sanity/client';

interface CompanyInfo {
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

export default async function AboutPage() {
  // Fetch data from Sanity CMS
  const [companyInfo, companyStats, teamMembers] = await Promise.all([
    getCompanyInfo().catch(err => { console.error('Failed to fetch company info:', err); return null; }),
    getCompanyStats().catch(err => { console.error('Failed to fetch company stats:', err); return { yearsExperience: 15, employeeCount: 50, clientCount: 500, projectCount: 1000 }; }),
    getTeamMembers().catch(err => { console.error('Failed to fetch team members:', err); return []; })
  ]);

  // Calculate years since founding
  const currentYear = new Date().getFullYear();
  const foundedYear = companyInfo?.founded ? new Date(companyInfo.founded).getFullYear() : 2009;
  const yearsInBusiness = currentYear - foundedYear;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">关于{companyInfo?.name || '力通电子'}</h1>
            <p className="text-xl text-green-100">
              {companyInfo?.description || `${yearsInBusiness}年专业电子元器件分销经验，您值得信赖的供应链合作伙伴`}
            </p>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">公司简介</h2>
              <div className="w-20 h-1 bg-green-600 mx-auto"></div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {companyInfo?.description || `深圳市力通电子有限公司成立于${foundedYear}年，专注于电子元器件的分销与技术服务。经过${yearsInBusiness}年的发展，我们已成为华南地区领先的电子元器件供应商之一。`}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {companyInfo?.mission || '公司秉承"诚信经营、质量第一、服务至上"的经营理念，与全球多家知名半导体厂商建立了深度合作关系，为客户提供从产品选型、技术支持到供应链管理的一站式解决方案。'}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">{foundedYear}</div>
                    <div className="text-gray-600">成立年份</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{companyStats.yearsExperience}+</div>
                    <div className="text-gray-600">行业经验</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">企业使命</h3>
                  <p className="text-green-100 mb-6">
                    {companyInfo?.mission || '为客户提供高品质的电子元器件产品和专业的技术服务，成为客户值得信赖的长期合作伙伴。'}
                  </p>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">企业愿景</h4>
                    <p className="text-sm text-green-100">
                      {companyInfo?.vision || '成为全球领先的电子元器件分销服务商，推动电子行业的创新发展。'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">公司实力</h2>
            <p className="text-lg text-gray-600">数字见证我们的专业实力</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: `${companyStats.yearsExperience}+`,
                label: '行业经验',
                description: '年',
                color: 'text-green-600'
              },
              {
                number: `${companyStats.employeeCount}+`,
                label: '团队规模',
                description: '专业人员',
                color: 'text-blue-600'
              },
              {
                number: `${companyStats.clientCount}+`,
                label: '服务客户',
                description: '合作伙伴',
                color: 'text-purple-600'
              },
              {
                number: `${companyStats.projectCount}+`,
                label: '成功项目',
                description: '项目经验',
                color: 'text-orange-600'
              }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-lg shadow-sm">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">企业价值观</h2>
            <p className="text-lg text-gray-600">指导我们前进的核心理念</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(companyInfo?.values && companyInfo.values.length > 0) ? 
              companyInfo.values.map((value, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              )) :
              // Default values if no CMS data
              [
                {
                  title: '诚信经营',
                  description: '以诚信为本，建立长期稳定的合作关系'
                },
                {
                  title: '质量第一',
                  description: '严格把控产品质量，确保客户满意'
                },
                {
                  title: '服务至上',
                  description: '提供专业、及时、贴心的服务体验'
                },
                {
                  title: '创新发展',
                  description: '持续创新，引领行业发展趋势'
                },
                {
                  title: '团队协作',
                  description: '发挥团队力量，实现共同目标'
                },
                {
                  title: '社会责任',
                  description: '承担社会责任，推动可持续发展'
                }
              ].map((value, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))
            }
          </div>
        </div>
      </section>

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">团队介绍</h2>
              <p className="text-lg text-gray-600">专业的团队，优质的服务</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  {member.image && (
                    <div className="mb-4">
                      <img
                        src={urlFor(member.image).width(120).height(120).url()}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 mb-3">{member.position}</p>
                  {member.bio && (
                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  )}
                  {member.social && (
                    <div className="flex justify-center space-x-3">
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      {member.social.twitter && (
                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">联系我们</h2>
            <p className="text-xl text-green-100">
              欢迎联系我们，了解更多合作机会
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">公司地址</h3>
              <p className="text-green-100">
                {companyInfo?.contact?.address || companyInfo?.headquarters || '深圳市南山区科技园'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">联系电话</h3>
              <p className="text-green-100">
                {companyInfo?.contact?.phone || '+86-755-xxxxxxxx'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">邮箱地址</h3>
              <p className="text-green-100">
                {companyInfo?.contact?.email || 'info@litongtech.com'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">工作时间</h3>
              <p className="text-green-100">
                {companyInfo?.contact?.workingHours || '周一至周五 9:00-18:00'}
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors">
                立即咨询
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-medium transition-colors">
                获取报价
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}