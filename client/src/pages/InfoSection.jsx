import React from 'react';
import { useSelector } from 'react-redux';

const InfoSection = () => {
  // Role configuration with styles, icons, and colors
  const roleConfig = {
    citizen: {
      name: 'Citizen',
      icon: '👤',
      gradient: 'from-blue-600 to-blue-800',
      accent: 'blue',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-white'
    },
    police: {
      name: 'Police Officer',
      icon: '👮‍♂️',
      gradient: 'from-blue-700 to-indigo-900',
      accent: 'indigo',
      bgPattern: 'bg-gradient-to-br from-indigo-50 to-blue-50'
    },
    admin: {
      name: 'System Administrator',
      icon: '⚙️',
      gradient: 'from-blue-800 to-slate-900',
      accent: 'slate',
      bgPattern: 'bg-gradient-to-br from-slate-50 to-blue-50'
    }
  };

  // Get user role from Redux state
  const userRole = useSelector(state => state.user.user.role);
  
  // Get the current role configuration, default to citizen if role not found
  const currentRole = roleConfig[userRole] || roleConfig.citizen;

  // Role-specific content
  const contentByRole = {
    citizen: [
      {
        title: 'System Statistics',
        icon: '📊',
        description: 'Real-time insights into our crime reporting system',
        content: [
          'Over 15,000+ reports processed monthly with 98% accuracy',
          '24/7 response system with average 2-hour acknowledgment',
          '750+ verified police officers across all districts',
          'Multi-language support available in 8 regional languages',
          'Advanced AI-powered threat assessment for faster processing',
          'Mobile app with offline reporting capabilities'
        ]
      },
      {
        title: 'Filing Your Report',
        icon: '📝',
        description: 'Step-by-step guide to submit your complaint effectively',
        content: [
          'Access via web portal or mobile app with secure login',
          'Select appropriate category: Crime, Missing Person, or Tip',
          'Provide detailed incident description with precise timing',
          'Upload multiple evidence files (photos, videos, documents)',
          'Add location using GPS coordinates or manual address',
          'Choose reporting preference: identified or anonymous',
          'Receive instant tracking ID and case reference number'
        ]
      },
      {
        title: 'Anonymous Protection',
        icon: '🔒',
        description: 'Your identity is completely protected with our advanced security',
        content: [
          'Zero-knowledge architecture ensures complete anonymity',
          'Advanced encryption protects all communications',
          'No IP logging or digital fingerprinting',
          'Secure communication channels with end-to-end encryption',
          'Option to reveal identity later through secure verification',
          'Legal protection under whistleblower and informant policies'
        ]
      },
      {
        title: 'Data Security & Privacy',
        icon: '🛡️',
        description: 'Military-grade security protecting your sensitive information',
        content: [
          'AES-256 encryption for all data storage and transmission',
          'Regular third-party security audits and penetration testing',
          'Compliance with national data protection regulations',
          'Geographically distributed secure cloud infrastructure',
          'Multi-factor authentication and biometric access controls',
          'Automatic data purging based on legal retention policies'
        ]
      }
    ],
    police: [
      {
        title: 'Lead Verification Protocol',
        icon: '🔍',
        description: 'Comprehensive guidelines for authenticating and processing reports',
        content: [
          'Verify evidence authenticity using digital forensics tools',
          'Cross-reference with national and regional crime databases',
          'Conduct preliminary investigation within 24-48 hours',
          'Document all verification steps with timestamps',
          'Escalate high-priority cases to specialized units immediately',
          'Maintain strict chain of custody for all digital evidence',
          'Coordinate with cybercrime unit for technical analysis'
        ]
      },
      {
        title: 'Legal Compliance',
        icon: '⚖️',
        description: 'Essential legal requirements and professional responsibilities',
        content: [
          'Adhere to constitutional rights and procedural laws',
          'Maintain absolute confidentiality of sensitive information',
          'Follow evidence collection and preservation protocols',
          'Respect privacy rights and data protection regulations',
          'Document all decisions with proper legal justification',
          'Coordinate with public prosecutor for legal guidance',
          'Ensure compliance with human rights standards'
        ]
      },
      {
        title: 'Standard Operating Procedures',
        icon: '📋',
        description: 'Systematic approach to complaint handling and investigation',
        content: [
          'Acknowledge receipt within 2 hours of submission',
          'Assign priority classification based on severity matrix',
          'Conduct initial assessment and preliminary documentation',
          'Coordinate with relevant departments and specialized units',
          'Provide regular status updates to complainant',
          'Maintain detailed investigation logs and evidence records',
          'Submit comprehensive final report upon case resolution'
        ]
      },
      {
        title: 'Missing Person Protocols',
        icon: '🔍',
        description: 'Specialized procedures for missing person investigations',
        content: [
          'Activate immediate alert system across all stations',
          'Coordinate with multiple jurisdictions and agencies',
          'Utilize social media and public broadcasting channels',
          'Implement 24/7 monitoring and tip line management',
          'Maintain regular communication with family members',
          'Coordinate inter-state and international searches when required',
          'Deploy specialized search and rescue teams as needed'
        ]
      }
    ],
    admin: [
      {
        title: 'System Infrastructure',
        icon: '🖥️',
        description: 'Critical system maintenance and performance optimization',
        content: [
          'Real-time system health monitoring with AI-powered alerts',
          'Advanced database optimization and automated cleanup',
          'Security patches and system updates with zero downtime',
          'Comprehensive backup and disaster recovery protocols',
          'Performance monitoring with predictive scaling capabilities',
          'User access management with role-based permissions',
          'API management and third-party integration oversight'
        ]
      },
      {
        title: 'User Administration',
        icon: '👥',
        description: 'Comprehensive user lifecycle and access management',
        content: [
          'Multi-step user registration with identity verification',
          'Granular role-based access control implementation',
          'Account suspension and reinstatement procedures',
          'Detailed user activity monitoring and audit trails',
          'Privacy settings management and data governance',
          'Advanced support ticket system with priority queues',
          'User training and onboarding program management'
        ]
      },
      {
        title: 'Police Officer Management',
        icon: '👮‍♂️',
        description: 'Specialized procedures for law enforcement user management',
        content: [
          'Multi-level identity verification through official channels',
          'Badge number validation and department authentication',
          'Comprehensive background check coordination',
          'Training module completion tracking and certification',
          'Rank-based access level assignment and management',
          'Regular re-verification and credential renewal procedures',
          'Performance metrics tracking and evaluation systems'
        ]
      },
      {
        title: 'System Analytics & Reporting',
        icon: '📈',
        description: 'Advanced analytics and comprehensive system oversight',
        content: [
          'Generate detailed system performance and usage reports',
          'Monitor key performance indicators with predictive analytics',
          'Analyze user engagement patterns and satisfaction metrics',
          'Coordinate with law enforcement leadership on policy updates',
          'Implement system-wide policy changes and feature updates',
          'Ensure regulatory compliance and audit trail maintenance',
          'Manage data retention policies and privacy compliance'
        ]
      }
    ]
  };

  // InfoCard component for rendering each information card
  const InfoCard = ({ title, icon, description, content, index }) => (
    <div className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 ${
      index % 2 === 0 ? 'lg:translate-y-4' : ''
    }`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${currentRole.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      <div className="relative p-8">
        <div className="flex items-center mb-4">
          <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${currentRole.gradient} shadow-lg mr-4`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {content.map((item, itemIndex) => (
            <div key={itemIndex} className="flex items-start group/item">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentRole.gradient} mt-2 mr-3 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300`}></div>
              <p className="text-gray-700 text-sm leading-relaxed group-hover/item:text-gray-900 transition-colors duration-300">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${currentRole.bgPattern} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${currentRole.gradient} shadow-2xl mb-6`}>
            <span className="text-3xl">{currentRole.icon}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            <span className={`bg-gradient-to-r ${currentRole.gradient} bg-clip-text text-transparent`}>
              {currentRole.name}
            </span>
            <br />
            <span className="text-gray-800">Information Center</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive guidance and system information tailored specifically for your role
          </p>
        </div>

        {/* Role Badge */}
        <div className="flex justify-center mb-12">
          <div className={`inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r ${currentRole.gradient} text-white font-semibold shadow-2xl transform hover:scale-105 transition-transform duration-300`}>
            <span className="mr-3 text-2xl">{currentRole.icon}</span>
            <span className="text-lg">Active Role: {currentRole.name}</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {contentByRole[userRole]?.map((section, index) => (
            <InfoCard
              key={index}
              title={section.title}
              icon={section.icon}
              description={section.description}
              content={section.content}
              index={index}
            />
          ))}
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${currentRole.gradient} shadow-lg mb-6`}>
            <span className="text-2xl">🆘</span>
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Need Additional Assistance?
          </h3>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
            Our dedicated support team is available 24/7 to help you with any questions or technical issues.
          </p>
          
         <div className="flex flex-col sm:flex-row justify-center gap-4">
  <button
    onClick={() => window.location.href = 'tel:100'}
    className={`flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r ${currentRole.gradient} text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
  >
    <span className="mr-2">📞</span>
    Call Police: 100
  </button>

  <button
    onClick={() => window.location.href = 'mailto:nyaysetu.foru@gmail.com'}
    className="flex items-center justify-center px-6 py-3 rounded-xl bg-white border-2 border-blue-200 text-blue-700 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-blue-50"
  >
    <span className="mr-2">📧</span>
    Email: nyaysetu.foru@gmail.com
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default InfoSection;