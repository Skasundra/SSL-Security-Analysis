import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { ServerIcon, ShieldCheckIcon, DocumentTextIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

/**
 * SSL details panel with tabbed interface
 * @param {Object} props - Component props
 * @param {Object} props.sslData - SSL analysis data
 * @param {string} props.domain - Domain name
 * @returns {JSX.Element} SSL details panel
 */
function SSLDetailsPanel({ sslData, domain }) {
  if (!sslData || sslData.error) {
    return (
      <div className="card card-gradient">
        <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-secondary rounded-full"></div>
          SSL Details
        </h3>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ServerIcon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-primary-600 dark:text-primary-400 text-lg">
            {sslData?.error || 'SSL analysis data not available'}
          </p>
        </div>
      </div>
    )
  }

  const tabs = [
    { name: 'Endpoints', icon: ServerIcon },
    { name: 'Certificates', icon: ShieldCheckIcon },
    { name: 'Security', icon: DocumentTextIcon }
  ]

  return (
    <div className="card card-gradient p-6 m-4">
      <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-8 flex items-center gap-3 px-4">
        <div className="w-3 h-3 bg-gradient-secondary rounded-full"></div>
        SSL Details Analysis
      </h3>
      
      <div className="px-4">
        <Tab.Group>
          <Tab.List className="flex space-x-2 rounded-xl bg-primary-100 dark:bg-primary-800 p-3 mb-8">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `w-full rounded-lg py-3 px-4 text-sm font-semibold leading-5 transition-all duration-200
                ${selected
                  ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-white shadow-lg'
                  : 'text-primary-600 dark:text-primary-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-primary-700 dark:hover:text-white'
                }`
              }
            >
              <div className="flex items-center justify-center">
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </div>
            </Tab>
          ))}
        </Tab.List>

          <Tab.Panels className="py-6">
            {/* Endpoints Tab */}
            <Tab.Panel>
              <EndpointsTab endpoints={sslData.endpoints} />
            </Tab.Panel>

            {/* Certificates Tab */}
            <Tab.Panel>
              <CertificatesTab certificates={sslData.certs} />
            </Tab.Panel>

            {/* Security Tab */}
            <Tab.Panel>
              <SecurityTab endpoints={sslData.endpoints} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

/**
 * Endpoints tab component
 */
function EndpointsTab({ endpoints = [] }) {
  if (endpoints.length === 0) {
    return (
      <div className="text-center py-16 px-8">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <ServerIcon className="h-10 w-10 text-gray-400" />
        </div>
        <p className="text-primary-600 dark:text-primary-400 text-lg">No endpoints found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 py-6">
      {endpoints.map((endpoint, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-lg text-primary-900 dark:text-white font-mono">
              {endpoint.ipAddress}
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${
              endpoint.grade === 'A+' || endpoint.grade === 'A' 
                ? 'bg-green-50 text-green-700 border-green-200'
                : endpoint.grade === 'B' || endpoint.grade === 'C'
                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              Grade: {endpoint.grade || 'N/A'}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary-50 dark:bg-primary-900/50 rounded-lg p-3">
                <div className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-1">Server Name</div>
                <div className="text-sm text-primary-900 dark:text-white font-medium">
                  {endpoint.serverName || 'N/A'}
                </div>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/50 rounded-lg p-3">
                <div className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-1">Status</div>
                <div className="text-sm text-primary-900 dark:text-white font-medium">
                  {endpoint.statusMessage || 'Ready'}
                </div>
              </div>
            </div>

            {endpoint.details?.protocols && (
              <div>
                <div className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                  Supported Protocols
                </div>
                <div className="flex flex-wrap gap-2">
                  {endpoint.details.protocols.slice(0, 6).map((protocol, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-lg font-medium">
                      {protocol.name} {protocol.version}
                    </span>
                  ))}
                  {endpoint.details.protocols.length > 6 && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-lg">
                      +{endpoint.details.protocols.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {endpoint.details && (
              <div className="grid grid-cols-2 gap-3">
                {endpoint.details.forwardSecrecy !== undefined && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Forward Secrecy</div>
                    <div className={`text-sm font-medium ${endpoint.details.forwardSecrecy > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {endpoint.details.forwardSecrecy > 0 ? 'Supported' : 'Not Supported'}
                    </div>
                  </div>
                )}
                {endpoint.details.ocspStapling !== undefined && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">OCSP Stapling</div>
                    <div className={`text-sm font-medium ${endpoint.details.ocspStapling ? 'text-green-600' : 'text-red-600'}`}>
                      {endpoint.details.ocspStapling ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Certificates tab component
 */
function CertificatesTab({ certificates = [] }) {
  if (certificates.length === 0) {
    return (
      <div className="text-center py-16 px-8">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheckIcon className="h-10 w-10 text-gray-400" />
        </div>
        <p className="text-primary-600 dark:text-primary-400 text-lg">No certificates found</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 px-4 py-6">
      {certificates.map((cert, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-primary-900 dark:text-white">
              Certificate #{index + 1}
            </h4>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-lg font-medium">
                {cert.keyAlg} {cert.keySize} bits
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-primary-50 dark:bg-primary-900/50 rounded-lg p-4">
                <div className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">Subject</div>
                <div className="text-sm text-primary-900 dark:text-white font-mono break-all">
                  {cert.subject}
                </div>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/50 rounded-lg p-4">
                <div className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">Issuer</div>
                <div className="text-sm text-primary-900 dark:text-white">
                  {cert.issuerLabel || cert.issuerSubject}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 dark:bg-green-900/50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">Valid From</div>
                  <div className="text-sm text-green-900 dark:text-green-100">
                    {new Date(cert.notBefore).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/50 rounded-lg p-3">
                  <div className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">Valid Until</div>
                  <div className="text-sm text-red-900 dark:text-red-100">
                    {new Date(cert.notAfter).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Certificate Details</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Algorithm:</span>
                    <div className="font-medium text-gray-900 dark:text-white">{cert.keyAlg}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Key Size:</span>
                    <div className="font-medium text-gray-900 dark:text-white">{cert.keySize} bits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {cert.altNames && cert.altNames.length > 0 && (
            <div className="mt-6 pt-6 border-t border-primary-200 dark:border-primary-700">
              <div className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-3">
                Subject Alternative Names ({cert.altNames.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {cert.altNames.slice(0, 8).map((name, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-sm rounded-lg font-mono">
                    {name}
                  </span>
                ))}
                {cert.altNames.length > 8 && (
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-lg">
                    +{cert.altNames.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Security tab component
 */
function SecurityTab({ endpoints = [] }) {
  if (endpoints.length === 0) {
    return (
      <div className="text-center py-16 px-8">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <DocumentTextIcon className="h-10 w-10 text-gray-400" />
        </div>
        <p className="text-primary-600 dark:text-primary-400 text-lg">No security data available</p>
      </div>
    )
  }

  const endpoint = endpoints[0] // Show first endpoint details
  const details = endpoint.details

  if (!details) {
    return (
      <div className="text-center py-16 px-8">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <DocumentTextIcon className="h-10 w-10 text-gray-400" />
        </div>
        <p className="text-primary-600 dark:text-primary-400 text-lg">Security details not available</p>
      </div>
    )
  }

  const securityFeatures = [
    { label: 'Forward Secrecy', value: details.forwardSecrecy, good: details.forwardSecrecy > 0 },
    { label: 'OCSP Stapling', value: details.ocspStapling, good: details.ocspStapling },
    { label: 'Session Resumption', value: details.sessionResumption, good: details.sessionResumption > 0 },
    { label: 'ALPN Support', value: details.supportsAlpn, good: details.supportsAlpn },
    { label: 'SNI Required', value: details.sniRequired, good: details.sniRequired }
  ]

  const vulnerabilities = [
    { label: 'Heartbleed', vulnerable: details.heartbleed },
    { label: 'POODLE', vulnerable: details.poodle },
    { label: 'FREAK', vulnerable: details.freak },
    { label: 'Logjam', vulnerable: details.logjam },
    { label: 'DROWN', vulnerable: details.drownVulnerable },
    { label: 'RC4 Support', vulnerable: details.supportsRc4 }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 py-6">
      {/* Security Features */}
      <div className="space-y-8">
        <div>
          <h4 className="text-lg font-bold text-primary-900 dark:text-white mb-4">Security Features</h4>
          <div className="space-y-3">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary-900 dark:text-white">{feature.label}</span>
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${
                    feature.good 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {feature.good ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cipher Suites Preview */}
        {details.suites?.list && (
          <div>
            <h4 className="text-lg font-bold text-primary-900 dark:text-white mb-4">
              Cipher Suites (Top {Math.min(details.suites.list.length, 5)})
            </h4>
            <div className="space-y-3">
              {details.suites.list.slice(0, 5).map((suite, index) => (
                <div key={index} className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2 font-mono">
                    {suite.name}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Strength:</span>
                      <span className="ml-1 font-medium text-blue-900 dark:text-blue-100">
                        {suite.cipherStrength} bits
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 dark:text-blue-400">Key Exchange:</span>
                      <span className="ml-1 font-medium text-blue-900 dark:text-blue-100">
                        {suite.kxType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vulnerability Assessment */}
      <div>
        <h4 className="text-lg font-bold text-primary-900 dark:text-white mb-4">Vulnerability Assessment</h4>
        <div className="space-y-3">
          {vulnerabilities.map((vuln, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary-900 dark:text-white">{vuln.label}</span>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${
                  vuln.vulnerable 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-green-50 text-green-700 border-green-200'
                }`}>
                  {vuln.vulnerable ? 'Vulnerable' : 'Safe'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 bg-primary-50 dark:bg-primary-900/50 rounded-xl p-4">
          <h5 className="font-semibold text-primary-900 dark:text-white mb-2">Assessment Summary</h5>
          <div className="text-sm text-primary-700 dark:text-primary-300">
            {vulnerabilities.filter(v => v.vulnerable).length === 0 ? (
              <div className="flex items-center text-green-700 dark:text-green-300">
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                No known vulnerabilities detected
              </div>
            ) : (
              <div className="flex items-center text-red-700 dark:text-red-300">
                <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                {vulnerabilities.filter(v => v.vulnerable).length} vulnerabilities found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SSLDetailsPanel