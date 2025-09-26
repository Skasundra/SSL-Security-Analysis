import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { ChartBarIcon, GlobeAltIcon, ClockIcon } from '@heroicons/react/24/outline'

/**
 * Certificate Transparency panel with tabbed interface
 * @param {Object} props - Component props
 * @param {Object} props.ctData - Certificate transparency data
 * @param {string} props.domain - Domain name
 * @returns {JSX.Element} Certificate transparency panel
 */
function CertificateTransparencyPanel({ ctData, domain }) {
  if (!ctData || ctData.error) {
    return (
      <div className="card card-gradient">
        <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-secondary rounded-full"></div>
          Certificate Transparency
        </h3>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChartBarIcon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-primary-600 dark:text-primary-400 text-lg">
            {ctData?.error || 'Certificate transparency data not available'}
          </p>
        </div>
      </div>
    )
  }

  const tabs = [
    { name: 'Overview', icon: ChartBarIcon },
    { name: 'Subdomains', icon: GlobeAltIcon },
    { name: 'Timeline', icon: ClockIcon }
  ]

  return (
    <div className="card card-gradient p-6 m-4">
      <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-8 flex items-center gap-3 px-4">
        <div className="w-3 h-3 bg-gradient-secondary rounded-full"></div>
        Certificate Transparency Analysis
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
            {/* Overview Tab */}
            <Tab.Panel>
              <OverviewTab summary={ctData.summary} statistics={ctData.statistics} />
            </Tab.Panel>

            {/* Subdomains Tab */}
            <Tab.Panel>
              <SubdomainsTab 
                subdomains={ctData.statistics?.subdomains} 
                certificates={ctData.certificates}
                domain={domain}
              />
            </Tab.Panel>

            {/* Timeline Tab */}
            <Tab.Panel>
              <TimelineTab 
                monthlyData={ctData.statistics?.certificatesByMonth}
                certificates={ctData.certificates}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

/**
 * Overview tab component
 */
function OverviewTab({ summary, statistics }) {
  const stats = [
    { label: 'Total Certificates', value: summary?.totalCertificates || 0, color: 'blue', icon: '📜' },
    { label: 'Active Certificates', value: summary?.activeCertificates || 0, color: 'green', icon: '✅' },
    { label: 'Expired Certificates', value: summary?.expiredCertificates || 0, color: 'red', icon: '❌' },
    { label: 'Recent (30 days)', value: summary?.recentCertificates || 0, color: 'yellow', icon: '🆕' },
    { label: 'Unique Issuers', value: summary?.uniqueIssuers || 0, color: 'purple', icon: '🏢' },
    { label: 'Discovered Subdomains', value: summary?.discoveredSubdomains || 0, color: 'indigo', icon: '🌐' }
  ]

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
      green: 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
      red: 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
      purple: 'bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
      indigo: 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700'
    }
    return colors[color] || 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
  }

  return (
    <div className="space-y-10 px-4 py-6">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-xl border-2 ${getColorClass(stat.color)} shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <div className="text-right">
                <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
              </div>
            </div>
            <div className="text-sm font-semibold">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Top Issuers */}
      {statistics?.issuers && statistics.issuers.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-primary-900 dark:text-white mb-4">Top Certificate Issuers</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statistics.issuers.slice(0, 6).map((issuer, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-primary-700 dark:text-primary-300">#{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-primary-900 dark:text-white truncate">{issuer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Insights */}
      <div className="bg-primary-50 dark:bg-primary-900/50 rounded-xl p-6">
        <h4 className="text-lg font-bold text-primary-900 dark:text-white mb-3">Certificate Transparency Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-semibold text-primary-700 dark:text-primary-300 mb-1">Certificate Health</div>
            <div className="text-primary-600 dark:text-primary-400">
              {summary?.activeCertificates > 0 ? 
                `${summary.activeCertificates} active certificates found` : 
                'No active certificates detected'
              }
            </div>
          </div>
          <div>
            <div className="font-semibold text-primary-700 dark:text-primary-300 mb-1">Discovery Status</div>
            <div className="text-primary-600 dark:text-primary-400">
              {summary?.discoveredSubdomains > 0 ? 
                `${summary.discoveredSubdomains} subdomains discovered` : 
                'No subdomains found in CT logs'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Subdomains tab component
 */
function SubdomainsTab({ subdomains = [], certificates, domain }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSubdomains = subdomains.filter(subdomain =>
    subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSubdomainStatus = (subdomain) => {
    // Check if subdomain has active certificates
    const hasActiveCert = certificates?.active?.some(cert =>
      cert.subdomains?.includes(subdomain)
    )
    return hasActiveCert ? 'Active' : 'Historical'
  }

  return (
    <div className="space-y-8 px-4 py-6">
      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
            Search Subdomains
          </label>
          <input
            type="text"
            placeholder="Search subdomains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-primary-300 dark:border-primary-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="bg-primary-50 dark:bg-primary-900/50 rounded-xl p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-900 dark:text-white">
              {filteredSubdomains.length}
            </div>
            <div className="text-sm text-primary-600 dark:text-primary-400">
              {searchTerm ? 'Matching' : 'Total'} Subdomains
            </div>
          </div>
        </div>
      </div>

      {/* Subdomains List */}
      {filteredSubdomains.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <GlobeAltIcon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-primary-600 dark:text-primary-400 text-lg">
            {searchTerm ? 'No subdomains match your search' : 'No subdomains discovered'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredSubdomains.slice(0, 50).map((subdomain, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-mono text-primary-900 dark:text-white font-medium">
                    {subdomain}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  getSubdomainStatus(subdomain) === 'Active'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}>
                  {getSubdomainStatus(subdomain)}
                </span>
              </div>
            </div>
          ))}
          {filteredSubdomains.length > 50 && (
            <div className="text-center py-4 bg-primary-50 dark:bg-primary-900/50 rounded-lg">
              <div className="text-sm text-primary-600 dark:text-primary-400">
                Showing 50 of {filteredSubdomains.length} subdomains
              </div>
              <div className="text-xs text-primary-500 dark:text-primary-500 mt-1">
                Use search to filter results
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/50 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
              Discovery Summary
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{subdomains.length}</strong> unique subdomains discovered for <strong>{domain}</strong>
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
              Data Source
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              Certificate Transparency logs provide historical and current certificate data
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Timeline tab component
 */
function TimelineTab({ monthlyData = [], certificates }) {
  const recentCertificates = certificates?.recent || []

  return (
    <div className="space-y-10 px-4 py-6">
      {/* Monthly Certificate Counts */}
      {monthlyData.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-primary-900 dark:text-white mb-6">Certificate Issuance Timeline</h4>
          <div className="bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 rounded-xl p-6">
            <div className="space-y-4">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm font-medium text-primary-700 dark:text-primary-300">
                    {item.month}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-primary-100 dark:bg-primary-800 rounded-full h-3 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((item.count / Math.max(...monthlyData.map(d => d.count))) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm font-bold text-primary-900 dark:text-white text-right">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Certificates */}
      {recentCertificates.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-primary-900 dark:text-white mb-6">
            Recent Certificates (Last 30 Days)
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {recentCertificates.slice(0, 12).map((cert, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-primary-900 dark:text-white font-mono truncate">
                    {cert.commonName}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                    cert.isActive 
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : cert.isExpired
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                    {cert.isActive ? 'Active' : cert.isExpired ? 'Expired' : 'Future'}
                  </span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-primary-50 dark:bg-primary-900/50 rounded p-2">
                      <div className="text-primary-600 dark:text-primary-400">Logged</div>
                      <div className="font-medium text-primary-900 dark:text-white">
                        {new Date(cert.loggedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="bg-primary-50 dark:bg-primary-900/50 rounded p-2">
                      <div className="text-primary-600 dark:text-primary-400">Expires</div>
                      <div className="font-medium text-primary-900 dark:text-white">
                        {cert.daysUntilExpiry > 0 ? `${cert.daysUntilExpiry} days` : 'Expired'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                    <div className="text-gray-600 dark:text-gray-400 mb-1">Issuer</div>
                    <div className="font-medium text-gray-900 dark:text-white text-xs truncate">
                      {cert.issuerName}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                    <div className="text-gray-600 dark:text-gray-400 mb-1">Validity Period</div>
                    <div className="font-medium text-gray-900 dark:text-white text-xs">
                      {new Date(cert.notBefore).toLocaleDateString()} - {new Date(cert.notAfter).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {recentCertificates.length > 12 && (
            <div className="text-center mt-4 py-3 bg-primary-50 dark:bg-primary-900/50 rounded-lg">
              <div className="text-sm text-primary-600 dark:text-primary-400">
                Showing 12 of {recentCertificates.length} recent certificates
              </div>
            </div>
          )}
        </div>
      )}

      {monthlyData.length === 0 && recentCertificates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClockIcon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-primary-600 dark:text-primary-400 text-lg">
            No timeline data available
          </p>
        </div>
      )}
    </div>
  )
}

export default CertificateTransparencyPanel