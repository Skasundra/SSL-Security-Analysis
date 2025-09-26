import { CalendarIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

/**
 * Certificate status card component
 * @param {Object} props - Component props
 * @param {Array} props.certificates - Certificate data
 * @param {Array} props.endpoints - SSL endpoints
 * @param {string} props.status - Certificate status
 * @returns {JSX.Element} Certificate status card
 */
function CertificateStatusCard({ certificates, endpoints, status }) {
  const getCertificateInfo = () => {
    if (!certificates || certificates.length === 0) {
      return { status: 'Unknown', daysUntilExpiry: null, issuer: null }
    }

    const cert = certificates[0] // Primary certificate
    const notAfter = new Date(cert.notAfter)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((notAfter - now) / (1000 * 60 * 60 * 24))

    return {
      status: daysUntilExpiry > 0 ? 'Valid' : 'Expired',
      daysUntilExpiry,
      issuer: cert.issuerLabel || cert.issuerSubject,
      notAfter: cert.notAfter,
      notBefore: cert.notBefore,
      subject: cert.subject,
      keyAlg: cert.keyAlg,
      keySize: cert.keySize,
      altNames: cert.altNames
    }
  }

  const certInfo = getCertificateInfo()

  const getStatusColor = () => {
    if (certInfo.status === 'Expired') return 'text-red-700 bg-red-50 border-red-200'
    if (certInfo.daysUntilExpiry <= 30) return 'text-yellow-700 bg-yellow-50 border-yellow-200'
    return 'text-green-700 bg-green-50 border-green-200'
  }

  const getStatusIcon = () => {
    if (certInfo.status === 'Expired' || certInfo.daysUntilExpiry <= 30) {
      return <ExclamationTriangleIcon className="h-6 w-6" />
    }
    return <CheckCircleIcon className="h-6 w-6" />
  }

  return (
    <div className="card card-hover card-gradient p-6 m-4">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-primary-900 dark:text-white flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-secondary rounded-full"></div>
          Certificate Status
        </h3>
        <div className={`p-3 rounded-full border-2 ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-6">
        {/* Status and Expiry */}
        <div className="space-y-6 px-4 py-4">
          <div className="text-center md:text-left">
            <span className={`inline-flex items-center px-6 py-3 rounded-xl text-lg font-bold border-2 ${getStatusColor()}`}>
              {certInfo.status}
            </span>
          </div>

          {certInfo.daysUntilExpiry !== null && (
            <div className="bg-primary-50 dark:bg-primary-900/50 rounded-xl p-6">
              <div className="flex items-center text-primary-700 dark:text-primary-300 mb-3">
                <CalendarIcon className="h-6 w-6 mr-3" />
                <span className="font-semibold text-lg">Expires in</span>
              </div>
              <div className="text-4xl font-bold text-primary-900 dark:text-white mb-2">
                {certInfo.daysUntilExpiry > 0 ? certInfo.daysUntilExpiry : 0}
              </div>
              <div className="text-sm text-primary-600 dark:text-primary-400 mb-3">
                {certInfo.daysUntilExpiry === 1 ? 'day' : 'days'}
              </div>
              {certInfo.notAfter && (
                <div className="text-sm text-primary-500 dark:text-primary-400 mt-3">
                  {new Date(certInfo.notAfter).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>
          )}

          {/* Certificate Chain Info */}
          {certificates && certificates.length > 1 && (
            <div className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4">
              <div className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                Certificate Chain
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                {certificates.length} certificates in chain
              </div>
            </div>
          )}
        </div>

        {/* Certificate Details */}
        <div className="space-y-4 px-4 py-4">
          {certInfo.subject && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-primary-200 dark:border-primary-700">
              <div className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">Subject</div>
              <div className="text-sm text-primary-900 dark:text-white font-mono break-all">
                {certInfo.subject}
              </div>
            </div>
          )}

          {certInfo.issuer && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-primary-200 dark:border-primary-700">
              <div className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">Issued by</div>
              <div className="text-sm text-primary-900 dark:text-white">
                {certInfo.issuer}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {certInfo.keyAlg && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-primary-200 dark:border-primary-700">
                <div className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-2">Algorithm</div>
                <div className="text-sm text-primary-900 dark:text-white">{certInfo.keyAlg}</div>
              </div>
            )}
            {certInfo.keySize && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-primary-200 dark:border-primary-700">
                <div className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-2">Key Size</div>
                <div className="text-sm text-primary-900 dark:text-white">{certInfo.keySize} bits</div>
              </div>
            )}
          </div>

          {certInfo.notBefore && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-primary-200 dark:border-primary-700">
              <div className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-2">Valid From</div>
              <div className="text-sm text-primary-900 dark:text-white">
                {new Date(certInfo.notBefore).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alternative Names */}
      {certInfo.altNames && certInfo.altNames.length > 0 && (
        <div className="mt-8 pt-8 border-t border-primary-200 dark:border-primary-700 px-4">
          <h4 className="font-semibold text-primary-900 dark:text-white mb-4 text-lg">Alternative Names</h4>
          <div className="flex flex-wrap gap-3">
            {certInfo.altNames.slice(0, 6).map((name, idx) => (
              <span key={idx} className="px-4 py-2 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-sm rounded-lg font-mono">
                {name}
              </span>
            ))}
            {certInfo.altNames.length > 6 && (
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-lg">
                +{certInfo.altNames.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Warning Messages */}
      {certInfo.daysUntilExpiry <= 30 && certInfo.daysUntilExpiry > 0 && (
        <div className="mt-8 mx-4 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-700 rounded-xl p-5">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold">
              Certificate expires soon. Consider renewing to avoid service interruption.
            </div>
          </div>
        </div>
      )}

      {certInfo.status === 'Expired' && (
        <div className="mt-8 mx-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-xl p-5">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
            <div className="text-sm text-red-800 dark:text-red-200 font-semibold">
              Certificate has expired. Immediate renewal required.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CertificateStatusCard