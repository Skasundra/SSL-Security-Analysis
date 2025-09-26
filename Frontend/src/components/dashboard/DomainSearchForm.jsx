import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Shield, Zap, Clock, Star, TrendingUp } from 'lucide-react'

/**
 * Domain search form component
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string[]} props.recentSearches - Recent search history
 * @returns {JSX.Element} Search form component
 */
function DomainSearchForm({ onSubmit, isLoading, recentSearches = [] }) {
  const [domain, setDomain] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState('')

  /**
   * Validate domain format
   * @param {string} domain - Domain to validate
   * @returns {boolean} Is valid domain
   */
  const validateDomain = (domain) => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.([a-zA-Z]{2,}\.?)+$/
    return domainRegex.test(domain)
  }

  /**
   * Handle form submission
   * @param {Event} e - Form event
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!domain.trim()) {
      setError('Please enter a domain name')
      return
    }

    if (!validateDomain(domain.trim())) {
      setError('Please enter a valid domain name (e.g., example.com)')
      return
    }

    onSubmit(domain.trim().toLowerCase())
    setShowSuggestions(false)
  }

  /**
   * Handle input change
   * @param {Event} e - Input event
   */
  const handleInputChange = (e) => {
    setDomain(e.target.value)
    setError('')
    setShowSuggestions(e.target.value.length > 0 && recentSearches.length > 0)
  }

  /**
   * Handle suggestion click
   * @param {string} suggestion - Selected suggestion
   */
  const handleSuggestionClick = (suggestion) => {
    setDomain(suggestion)
    setShowSuggestions(false)
    onSubmit(suggestion)
  }

  const filteredSuggestions = recentSearches.filter(search =>
    search && typeof search === 'string' && search.toLowerCase().includes(domain.toLowerCase())
  )

  return (
    <div className="relative">
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="h-6 w-6 text-primary-400" />
              </motion.div>
            ) : (
              <Search className="h-6 w-6 text-gray-400" />
            )}
          </div>
          
          <input
            type="text"
            value={domain}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(domain.length > 0 && recentSearches.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Enter domain name (e.g., google.com)"
            className="block w-full pl-14 pr-36 py-6 text-lg border-2 border-white/30 rounded-2xl focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 bg-white/20 backdrop-blur-md shadow-soft placeholder-white/70 text-white transition-all duration-300 hover:bg-white/30"
            disabled={isLoading}
          />
          
          <motion.button
            type="submit"
            disabled={isLoading || !domain.trim()}
            className="absolute inset-y-0 right-3 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="bg-gradient-secondary hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-medium flex items-center gap-2 transform hover:scale-105">
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Analyze
                </>
              )}
            </span>
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-error-500/20 border border-error-400/30 text-white px-4 py-3 rounded-xl flex items-center gap-2 backdrop-blur-sm"
            >
              <div className="w-2 h-2 bg-error-400 rounded-full animate-pulse"></div>
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Recent Searches Suggestions */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 w-full mt-2 bg-white/95 dark:bg-primary-800/95 backdrop-blur-md border border-white/30 dark:border-primary-600/50 rounded-xl shadow-medium overflow-hidden"
          >
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-primary-600 dark:text-primary-300 uppercase tracking-wide bg-primary-50 dark:bg-primary-900/50 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Recent Searches
              </div>
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 text-primary-900 dark:text-primary-100 transition-all duration-200 flex items-center gap-3 group"
                  whileHover={{ x: 6, scale: 1.01 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Search className="w-4 h-4 text-primary-400 group-hover:text-secondary-500 transition-colors" />
                  <span className="font-medium">{suggestion}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Example Domains */}
      {!domain && !isLoading && (
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-blue-100 mb-4 flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Try these popular examples:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { domain: 'google.com', icon: Star },
              { domain: 'github.com', icon: Shield },
              { domain: 'stackoverflow.com', icon: TrendingUp }
            ].map((example, index) => {
              const Icon = example.icon
              return (
                <motion.button
                  key={example.domain}
                  onClick={() => handleSuggestionClick(example.domain)}
                  className="px-4 py-2 text-sm bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Icon className="w-3 h-3" />
                  {example.domain}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DomainSearchForm