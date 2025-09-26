import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import AppLayout from './components/common/AppLayout'
import DomainSearchForm from './components/dashboard/DomainSearchForm'
import AnalysisResults from './components/analysis/AnalysisResults'
import HistoryPage from './components/history/HistoryPage'
import { useSSLAnalysis } from './hooks/useSSLAnalysis'
import historyService from './services/historyService'

/**
 * Main application component
 * @returns {JSX.Element} The main app component
 */
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [searchHistory, setSearchHistory] = useState([])

  const { data: analysisData, isLoading, error, refetch } = useSSLAnalysis(selectedDomain)

  // Load search history on mount
  useEffect(() => {
    const history = historyService.getSearchHistory()
    setSearchHistory(history.map(item => item.domain))
  }, [])

  // Save analysis results to history when data is received
  useEffect(() => {
    if (selectedDomain && analysisData && !isLoading && !error) {
      historyService.addToAnalysisHistory(selectedDomain, analysisData)
    }
  }, [selectedDomain, analysisData, isLoading, error])

  /**
   * Handle domain search submission
   * @param {string} domain - Domain to analyze
   */
  const handleDomainSearch = (domain) => {
    setSelectedDomain(domain)
    setCurrentPage('dashboard')
    
    // Update search history
    historyService.addToSearchHistory(domain)
    const updatedHistory = historyService.getSearchHistory()
    setSearchHistory(updatedHistory.map(item => item.domain))
  }

  /**
   * Handle navigation between pages
   * @param {string} page - Page to navigate to
   */
  const handleNavigation = (page) => {
    setCurrentPage(page)
  }

  /**
   * Handle domain selection from history
   * @param {string} domain - Domain to analyze
   */
  const handleDomainFromHistory = (domain) => {
    handleDomainSearch(domain)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'history':
        return (
          <HistoryPage 
            onDomainSelect={handleDomainFromHistory}
          />
        )
      case 'docs':
        return (
          <div className="min-h-screen bg-gradient-surface py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="card card-gradient">
                <div className="card-body text-center py-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-4">Documentation</h1>
                    <p className="text-primary-600 dark:text-primary-300 mb-8">API documentation and usage guides coming soon.</p>
                    <button
                      onClick={() => handleNavigation('dashboard')}
                      className="btn btn-primary"
                    >
                      Back to Dashboard
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'dashboard':
      default:
        return (
          <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-primary text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f99f1e' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='60' cy='20' r='1'/%3E%3Ccircle cx='20' cy='60' r='1'/%3E%3Ccircle cx='60' cy='60' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat'
                }}></div>
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary-500/5 to-transparent"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.h1 
                    className="text-4xl font-bold sm:text-5xl lg:text-6xl mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    SSL Security Analysis
                  </motion.h1>
                  <motion.p 
                    className="text-xl text-white/90 max-w-3xl mx-auto mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Comprehensive SSL/TLS security analysis and certificate transparency monitoring
                  </motion.p>
                  <motion.p 
                    className="text-white/80 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    Get detailed security grades, vulnerability assessments, and certificate information for any domain
                  </motion.p>
                </motion.div>
                
                {/* Search Form */}
                <motion.div 
                  className="mt-16 max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <DomainSearchForm
                    onSubmit={handleDomainSearch}
                    isLoading={isLoading}
                    recentSearches={searchHistory}
                  />
                </motion.div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gradient-surface dark:bg-gradient-surface">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <AnimatePresence mode="wait">
                  {selectedDomain && (
                    <motion.div
                      key={selectedDomain}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <AnalysisResults
                        domain={selectedDomain}
                        data={analysisData}
                        isLoading={isLoading}
                        error={error}
                        onRetry={() => refetch()}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <ThemeProvider>
      <AppLayout 
        currentPage={currentPage}
        onNavigate={handleNavigation}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </AppLayout>
    </ThemeProvider>
  )
}

export default App