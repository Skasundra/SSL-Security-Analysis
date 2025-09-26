import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  Star, 
  Trash2, 
  Download, 
  Upload, 
  Search,
  Filter,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import historyService from '../../services/historyService'

/**
 * History page component for managing search and analysis history
 */
function HistoryPage({ onDomainSelect }) {
  const [activeTab, setActiveTab] = useState('analysis')
  const [analysisHistory, setAnalysisHistory] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const [filteredHistory, setFilteredHistory] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState('timestamp')

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    filterAndSortHistory()
  }, [analysisHistory, searchQuery, gradeFilter, showFavoritesOnly, sortBy])

  const loadHistory = () => {
    setAnalysisHistory(historyService.getAnalysisHistory())
    setSearchHistory(historyService.getSearchHistory())
  }

  const filterAndSortHistory = () => {
    let filtered = [...analysisHistory]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.domain.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply grade filter
    if (gradeFilter !== 'all') {
      filtered = filtered.filter(item => item.grade === gradeFilter)
    }

    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(item => item.isFavorite)
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'domain':
          return a.domain.localeCompare(b.domain)
        case 'grade':
          return a.grade.localeCompare(b.grade)
        case 'timestamp':
        default:
          return new Date(b.timestamp) - new Date(a.timestamp)
      }
    })

    setFilteredHistory(filtered)
  }

  const handleToggleFavorite = (domain) => {
    historyService.toggleFavorite(domain)
    loadHistory()
  }

  const handleRemoveItem = (domain) => {
    historyService.removeFromAnalysisHistory(domain)
    loadHistory()
  }

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      historyService.clearAllHistory()
      loadHistory()
    }
  }

  const handleExportHistory = () => {
    const data = historyService.exportHistory()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ssl-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportHistory = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          historyService.importHistory(data)
          loadHistory()
          alert('History imported successfully!')
        } catch (error) {
          alert('Error importing history. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const getGradeIcon = (grade) => {
    switch (grade?.toUpperCase()) {
      case 'A':
      case 'A+':
        return <CheckCircle className="w-5 h-5 text-success-600" />
      case 'B':
        return <Shield className="w-5 h-5 text-success-500" />
      case 'C':
        return <AlertTriangle className="w-5 h-5 text-warning-600" />
      case 'D':
      case 'F':
        return <XCircle className="w-5 h-5 text-error-600" />
      default:
        return <Shield className="w-5 h-5 text-gray-400" />
    }
  }

  const getGradeBadgeClass = (grade) => {
    switch (grade?.toUpperCase()) {
      case 'A':
      case 'A+':
        return 'badge-success'
      case 'B':
        return 'badge-success'
      case 'C':
        return 'badge-warning'
      case 'D':
      case 'F':
        return 'badge-error'
      default:
        return 'badge bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-surface py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 dark:from-white dark:to-primary-200 bg-clip-text text-transparent mb-2">
            Analysis History
          </h1>
          <p className="text-primary-600 dark:text-primary-400">Manage your SSL analysis history and favorites</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="glass rounded-2xl p-2 inline-flex space-x-2">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'analysis'
                    ? 'bg-gradient-secondary text-white shadow-md'
                    : 'text-primary-700 dark:text-primary-300 hover:bg-white/20 dark:hover:bg-primary-800/50'
                }`}
              >
                <Clock className="w-4 h-4" />
                Analysis History ({analysisHistory.length})
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'search'
                    ? 'bg-gradient-secondary text-white shadow-md'
                    : 'text-primary-700 dark:text-primary-300 hover:bg-white/20 dark:hover:bg-primary-800/50'
                }`}
              >
                <Search className="w-4 h-4" />
                Search History ({searchHistory.length})
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Filters and Actions */}
            <div className="card card-gradient">
              <div className="card-body">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search domains..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input pl-12 bg-white/50 dark:bg-primary-900/50 border-primary-200 dark:border-primary-600 focus:border-secondary-400 dark:focus:border-secondary-500"
                      />
                    </div>

                    {/* Grade Filter */}
                    <select
                      value={gradeFilter}
                      onChange={(e) => setGradeFilter(e.target.value)}
                      className="input bg-white/50 dark:bg-primary-900/50 border-primary-200 dark:border-primary-600 focus:border-secondary-400 dark:focus:border-secondary-500"
                    >
                      <option value="all">All Grades</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                    </select>

                    {/* Sort */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input bg-white/50 dark:bg-primary-900/50 border-primary-200 dark:border-primary-600 focus:border-secondary-400 dark:focus:border-secondary-500"
                    >
                      <option value="timestamp">Latest First</option>
                      <option value="domain">Domain A-Z</option>
                      <option value="grade">Grade</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Favorites Toggle */}
                    <motion.button
                      onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                      className={`btn ${showFavoritesOnly ? 'btn-secondary' : 'btn-ghost'} flex items-center gap-2`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                      Favorites Only
                    </motion.button>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={handleExportHistory}
                        className="btn btn-ghost"
                        title="Export History"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.label 
                        className="btn btn-ghost cursor-pointer" 
                        title="Import History"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Upload className="w-4 h-4" />
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportHistory}
                          className="hidden"
                        />
                      </motion.label>

                      <motion.button
                        onClick={handleClearHistory}
                        className="btn btn-danger"
                        title="Clear All History"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* History List */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredHistory.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card text-center py-12"
                  >
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No history found</h3>
                    <p className="text-gray-500">
                      {searchQuery || gradeFilter !== 'all' || showFavoritesOnly
                        ? 'Try adjusting your filters'
                        : 'Start analyzing domains to build your history'}
                    </p>
                  </motion.div>
                ) : (
                  filteredHistory.map((item, index) => (
                    <motion.div
                      key={item.domain}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="card-hover"
                    >
                      <div className="card-body">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            {getGradeIcon(item.grade)}
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <button
                                  onClick={() => onDomainSelect(item.domain)}
                                  className="text-lg font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                                >
                                  {item.domain}
                                </button>
                                <span className={`badge ${getGradeBadgeClass(item.grade)}`}>
                                  {item.grade}
                                </span>
                                {item.isFavorite && (
                                  <Star className="w-4 h-4 text-warning-500 fill-current" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                Analyzed {new Date(item.timestamp).toLocaleDateString()} at{' '}
                                {new Date(item.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleFavorite(item.domain)}
                              className={`btn btn-ghost ${
                                item.isFavorite ? 'text-warning-600' : 'text-gray-400'
                              }`}
                              title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                            </button>
                            
                            <button
                              onClick={() => onDomainSelect(item.domain)}
                              className="btn btn-secondary btn-sm"
                            >
                              Analyze Again
                            </button>
                            
                            <button
                              onClick={() => handleRemoveItem(item.domain)}
                              className="btn btn-ghost text-error-600 hover:text-error-700"
                              title="Remove from history"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="card">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Recent Searches</h3>
                  <button
                    onClick={() => {
                      historyService.clearSearchHistory()
                      loadHistory()
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Search History
                  </button>
                </div>

                {searchHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No search history yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchHistory.map((item, index) => (
                      <motion.div
                        key={item.domain}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Search className="w-4 h-4 text-gray-400" />
                          <div>
                            <button
                              onClick={() => onDomainSelect(item.domain)}
                              className="font-medium text-primary-600 hover:text-primary-700"
                            >
                              {item.domain}
                            </button>
                            <p className="text-xs text-gray-500">
                              {item.searchCount} search{item.searchCount !== 1 ? 'es' : ''} • Last: {new Date(item.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onDomainSelect(item.domain)}
                          className="btn btn-secondary btn-sm"
                        >
                          Search Again
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage