import { useState } from 'react'
import { ShieldExclamationIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

/**
 * Vulnerabilities card component
 * @param {Object} props - Component props
 * @param {Array} props.securityIssues - List of security issues
 * @param {Array} props.recommendations - Security recommendations
 * @param {Array} props.endpoints - SSL endpoints
 * @returns {JSX.Element} Vulnerabilities card
 */
function VulnerabilitiesCard({ securityIssues = [], recommendations = [], endpoints = [] }) {
  const [showAllIssues, setShowAllIssues] = useState(false)
  const [showAllRecommendations, setShowAllRecommendations] = useState(false)

  const getVulnerabilityCount = () => {
    let count = { critical: 0, high: 0, medium: 0, low: 0 }
    
    securityIssues.forEach(issue => {
      const issueLower = issue.toLowerCase()
      if (issueLower.includes('heartbleed') || issueLower.includes('poodle') || issueLower.includes('freak')) {
        count.critical++
      } else if (issueLower.includes('drown') || issueLower.includes('logjam')) {
        count.high++
      } else if (issueLower.includes('rc4')) {
        count.medium++
      } else {
        count.low++
      }
    })

    return count
  }

  const vulnerabilityCount = getVulnerabilityCount()
  const totalIssues = securityIssues.length
  const hasIssues = totalIssues > 0

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-100 border-red-200'
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="card card-hover card-gradient p-6 m-4">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-primary-900 dark:text-white flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-secondary rounded-full"></div>
          Security Issues
        </h3>
        <div className={`p-3 rounded-full ${hasIssues ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'}`}>
          <ShieldExclamationIcon className={`h-6 w-6 ${hasIssues ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
        </div>
      </div>

      <div className="px-4 py-6">
        {!hasIssues ? (
          // No Issues Found
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6">
              <ShieldExclamationIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xl font-semibold text-green-700 dark:text-green-300 mb-3">No Critical Issues Found</p>
            <p className="text-sm text-primary-600 dark:text-primary-400 px-4">SSL configuration appears secure and well-configured</p>
          </div>
        ) : (
          // Issues Found
          <div className="space-y-8">
            {/* Issue Count Summary */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center bg-red-50 dark:bg-red-900/50 rounded-xl p-6">
                <div className="text-5xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {totalIssues}
                </div>
                <div className="text-sm text-red-700 dark:text-red-300 font-semibold">
                  Security {totalIssues === 1 ? 'Issue' : 'Issues'}
                </div>
              </div>
              <div className="text-center bg-blue-50 dark:bg-blue-900/50 rounded-xl p-6">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {recommendations.length}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                  Recommendations
                </div>
              </div>
            </div>

            {/* Severity Breakdown */}
            <div>
              <h4 className="font-semibold text-primary-900 dark:text-white mb-4 text-lg">Issue Severity Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(vulnerabilityCount).map(([severity, count]) => (
                  count > 0 && (
                    <div key={severity} className={`px-4 py-3 rounded-lg text-center border-2 ${getSeverityColor(severity)}`}>
                      <div className="text-xl font-bold mb-1">{count}</div>
                      <div className="text-xs font-semibold capitalize">{severity}</div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Detailed Issues */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-primary-900 dark:text-white text-lg">
                  Security Issues Details
                </h4>
                {securityIssues.length > 5 && (
                  <button
                    onClick={() => setShowAllIssues(!showAllIssues)}
                    className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-3 py-2 rounded-lg"
                  >
                    {showAllIssues ? (
                      <>
                        <ChevronUpIcon className="h-4 w-4 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDownIcon className="h-4 w-4 mr-1" />
                        View All ({securityIssues.length})
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {(showAllIssues ? securityIssues : securityIssues.slice(0, 5)).map((issue, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                      <div className="text-sm text-primary-900 dark:text-white leading-relaxed">{issue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-8 pt-8 border-t border-primary-200 dark:border-primary-700 px-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-primary-900 dark:text-white text-lg">Security Recommendations</h4>
            {recommendations.length > 3 && (
              <button
                onClick={() => setShowAllRecommendations(!showAllRecommendations)}
                className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-3 py-2 rounded-lg"
              >
                {showAllRecommendations ? (
                  <>
                    <ChevronUpIcon className="h-4 w-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDownIcon className="h-4 w-4 mr-1" />
                    View All ({recommendations.length})
                  </>
                )}
              </button>
            )}
          </div>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
            {(showAllRecommendations ? recommendations : recommendations.slice(0, 3)).map((rec, index) => (
              <div key={index} className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{rec}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default VulnerabilitiesCard