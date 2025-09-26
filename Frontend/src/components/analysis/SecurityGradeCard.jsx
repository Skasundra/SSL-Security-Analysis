import { ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

/**
 * Security grade card component
 * @param {Object} props - Component props
 * @param {string} props.grade - Security grade (A+, A, B, C, D, F)
 * @param {Array} props.endpoints - SSL endpoints
 * @param {boolean} props.hasWarnings - Has security warnings
 * @returns {JSX.Element} Security grade card
 */
function SecurityGradeCard({ grade, endpoints, hasWarnings }) {
  const getGradeColor = (grade) => {
    if (!grade || grade === 'Unknown') return 'text-gray-500 bg-gray-50'
    
    switch (grade.toUpperCase()) {
      case 'A+':
      case 'A':
        return 'text-green-700 bg-green-50 border-green-200'
      case 'B':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200'
      case 'C':
        return 'text-orange-700 bg-orange-50 border-orange-200'
      case 'D':
      case 'F':
        return 'text-red-700 bg-red-50 border-red-200'
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const getGradeDescription = (grade) => {
    switch (grade?.toUpperCase()) {
      case 'A+':
        return 'Exceptional security configuration'
      case 'A':
        return 'Strong security configuration'
      case 'B':
        return 'Good security with minor issues'
      case 'C':
        return 'Adequate security with some concerns'
      case 'D':
        return 'Poor security configuration'
      case 'F':
        return 'Serious security vulnerabilities'
      default:
        return 'Security grade unavailable'
    }
  }

  const gradeColorClass = getGradeColor(grade)

  return (
    <div className="card card-hover card-gradient p-6 m-4">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-primary-900 dark:text-white flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-secondary rounded-full"></div>
          Security Grade Analysis
        </h3>
        {hasWarnings && (
          <div className="p-3 bg-warning-100 dark:bg-warning-900 rounded-full">
            <ExclamationTriangleIcon className="h-6 w-6 text-warning-600 dark:text-warning-400" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center px-4 py-6">
        {/* Grade Display */}
        <div className="text-center lg:text-left px-4 py-6">
          <div className="relative inline-block mb-6">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-3xl border-4 ${gradeColorClass} shadow-xl relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
              <span className="text-6xl font-bold relative z-10">
                {grade || '?'}
              </span>
            </div>
            {grade && grade.toUpperCase() === 'A+' && (
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm text-white font-bold">+</span>
              </div>
            )}
          </div>
          <p className="text-lg text-primary-600 dark:text-primary-300 font-semibold px-2">
            {getGradeDescription(grade)}
          </p>
        </div>

        {/* Endpoints Summary */}
        <div className="space-y-6 px-4 py-6">
          <div className="bg-primary-50 dark:bg-primary-900/50 rounded-xl p-6">
            <div className="flex items-center text-primary-700 dark:text-primary-300 mb-3">
              <ShieldCheckIcon className="h-6 w-6 mr-3" />
              <span className="font-semibold text-lg">Endpoints Analyzed</span>
            </div>
            <div className="text-3xl font-bold text-primary-900 dark:text-white mb-2">
              {endpoints?.length || 0}
            </div>
            <div className="text-sm text-primary-600 dark:text-primary-400">
              {endpoints?.length === 1 ? 'Single endpoint' : 'Multiple endpoints'}
            </div>
          </div>

          {endpoints && endpoints.length > 1 && (
            <div className="text-sm text-primary-500 dark:text-primary-400 bg-primary-100 dark:bg-primary-800 rounded-lg p-4">
              Grade shown represents the best performing endpoint
            </div>
          )}
        </div>

        {/* Detailed Endpoint Breakdown */}
        <div className="space-y-4 px-4 py-6">
          <h4 className="font-semibold text-primary-900 dark:text-white text-lg mb-4">Endpoint Details</h4>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {endpoints?.map((endpoint, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-primary-200 dark:border-primary-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-primary-700 dark:text-primary-300 font-medium">
                    {endpoint.ipAddress}
                  </span>
                  <span className={`px-3 py-1 rounded-md text-xs font-bold ${getGradeColor(endpoint.grade)}`}>
                    {endpoint.grade || 'N/A'}
                  </span>
                </div>
                <div className="text-xs text-primary-500 dark:text-primary-400 mb-2">
                  {endpoint.serverName || 'Unknown server'}
                </div>
                {endpoint.hasWarnings && (
                  <div className="flex items-center mt-2 text-xs text-warning-600 dark:text-warning-400">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                    Has warnings
                  </div>
                )}
              </div>
            )) || (
              <div className="text-center py-8 text-primary-500 dark:text-primary-400">
                No endpoint data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecurityGradeCard