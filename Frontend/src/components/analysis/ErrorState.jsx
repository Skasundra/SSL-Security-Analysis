import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

/**
 * Error state component for analysis failures
 * @param {Object} props - Component props
 * @param {string} props.domain - Domain that failed analysis
 * @param {Error} props.error - Error object
 * @param {Function} props.onRetry - Retry handler
 * @returns {JSX.Element} Error component
 */
function ErrorState({ domain, error, onRetry }) {
  const getErrorMessage = (error) => {
    if (error.message?.includes('timeout')) {
      return 'The analysis took too long to complete. This can happen with domains that have complex SSL configurations.'
    }
    if (error.message?.includes('not found') || error.message?.includes('404')) {
      return 'Domain not found or not accessible. Please check the domain name and try again.'
    }
    if (error.message?.includes('network') || error.message?.includes('ENOTFOUND')) {
      return 'Network error occurred. Please check your internet connection and try again.'
    }
    return error.message || 'An unexpected error occurred during analysis.'
  }

  const getSuggestions = (error) => {
    const suggestions = []
    
    if (error.message?.includes('timeout')) {
      suggestions.push('Try again in a few minutes')
      suggestions.push('Check if the domain is accessible from your network')
    } else if (error.message?.includes('not found')) {
      suggestions.push('Verify the domain name spelling')
      suggestions.push('Ensure the domain has SSL/TLS enabled')
      suggestions.push('Try with or without "www" prefix')
    } else {
      suggestions.push('Check your internet connection')
      suggestions.push('Try again in a few moments')
    }
    
    return suggestions
  }

  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Analysis Failed
      </h3>
      
      <p className="text-gray-600 mb-2">
        Unable to analyze SSL security for <span className="font-medium">{domain}</span>
      </p>

      <div className="max-w-md mx-auto mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
          <p className="text-sm text-red-800 mb-3">
            {getErrorMessage(error)}
          </p>
          
          <div className="text-sm text-red-700">
            <p className="font-medium mb-2">Suggestions:</p>
            <ul className="list-disc list-inside space-y-1">
              {getSuggestions(error).map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        <ArrowPathIcon className="w-4 h-4 mr-2" />
        Try Again
      </button>

      <div className="mt-6 text-xs text-gray-500">
        If the problem persists, the domain may not support SSL/TLS or may be temporarily unavailable
      </div>
    </div>
  )
}

export default ErrorState