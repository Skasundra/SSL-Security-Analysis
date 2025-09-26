import SecurityGradeCard from './SecurityGradeCard'
import CertificateStatusCard from './CertificateStatusCard'
import VulnerabilitiesCard from './VulnerabilitiesCard'

/**
 * Security overview cards component
 * @param {Object} props - Component props
 * @param {Object} props.sslData - SSL analysis data
 * @param {Object} props.summary - Security summary
 * @returns {JSX.Element} Overview cards component
 */
function SecurityOverviewCards({ sslData, summary }) {
  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Security Grade Card - Full Width */}
      <div className="w-full">
        <SecurityGradeCard 
          grade={summary?.overallGrade}
          endpoints={sslData?.endpoints}
          hasWarnings={sslData?.endpoints?.some(ep => ep.hasWarnings)}
        />
      </div>
      
      {/* Certificate Status and Vulnerabilities - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="w-full">
          <CertificateStatusCard 
            certificates={sslData?.certs}
            endpoints={sslData?.endpoints}
            status={summary?.certificateStatus}
          />
        </div>
        
        <div className="w-full">
          <VulnerabilitiesCard 
            securityIssues={summary?.securityIssues}
            recommendations={summary?.recommendations}
            endpoints={sslData?.endpoints}
          />
        </div>
      </div>
    </div>
  )
}

export default SecurityOverviewCards