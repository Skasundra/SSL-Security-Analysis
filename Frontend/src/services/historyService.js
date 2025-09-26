/**
 * History service for managing search history and analysis results
 */

const STORAGE_KEYS = {
  SEARCH_HISTORY: 'ssl-search-history',
  ANALYSIS_HISTORY: 'ssl-analysis-history',
  FAVORITES: 'ssl-favorites'
}

const MAX_HISTORY_ITEMS = 50
const MAX_SEARCH_ITEMS = 20

/**
 * Search history item structure
 * @typedef {Object} SearchHistoryItem
 * @property {string} domain - Domain name
 * @property {Date} timestamp - When the search was performed
 * @property {number} searchCount - Number of times searched
 */

/**
 * Analysis history item structure
 * @typedef {Object} AnalysisHistoryItem
 * @property {string} domain - Domain name
 * @property {Date} timestamp - When the analysis was performed
 * @property {Object} result - Analysis result data
 * @property {string} grade - SSL Labs grade
 * @property {boolean} isFavorite - Whether marked as favorite
 */

class HistoryService {
  /**
   * Get search history
   * @returns {SearchHistoryItem[]} Array of search history items
   */
  getSearchHistory() {
    try {
      const history = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY)
      return history ? JSON.parse(history).map(item => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })) : []
    } catch (error) {
      console.error('Error loading search history:', error)
      return []
    }
  }

  /**
   * Add domain to search history
   * @param {string} domain - Domain to add
   */
  addToSearchHistory(domain) {
    try {
      const history = this.getSearchHistory()
      const existingIndex = history.findIndex(item => item.domain === domain)
      
      if (existingIndex >= 0) {
        // Update existing entry
        history[existingIndex] = {
          ...history[existingIndex],
          timestamp: new Date(),
          searchCount: history[existingIndex].searchCount + 1
        }
      } else {
        // Add new entry
        history.unshift({
          domain,
          timestamp: new Date(),
          searchCount: 1
        })
      }

      // Keep only the most recent items
      const trimmedHistory = history.slice(0, MAX_SEARCH_ITEMS)
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(trimmedHistory))
    } catch (error) {
      console.error('Error saving search history:', error)
    }
  }

  /**
   * Get analysis history
   * @returns {AnalysisHistoryItem[]} Array of analysis history items
   */
  getAnalysisHistory() {
    try {
      const history = localStorage.getItem(STORAGE_KEYS.ANALYSIS_HISTORY)
      return history ? JSON.parse(history).map(item => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })) : []
    } catch (error) {
      console.error('Error loading analysis history:', error)
      return []
    }
  }

  /**
   * Add analysis result to history
   * @param {string} domain - Domain name
   * @param {Object} result - Analysis result
   */
  addToAnalysisHistory(domain, result) {
    try {
      const history = this.getAnalysisHistory()
      const existingIndex = history.findIndex(item => item.domain === domain)
      
      const historyItem = {
        domain,
        timestamp: new Date(),
        result,
        grade: result?.sslLabs?.grade || 'Unknown',
        isFavorite: existingIndex >= 0 ? history[existingIndex].isFavorite : false
      }

      if (existingIndex >= 0) {
        // Update existing entry
        history[existingIndex] = historyItem
      } else {
        // Add new entry
        history.unshift(historyItem)
      }

      // Keep only the most recent items
      const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS)
      localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(trimmedHistory))
    } catch (error) {
      console.error('Error saving analysis history:', error)
    }
  }

  /**
   * Remove item from analysis history
   * @param {string} domain - Domain to remove
   */
  removeFromAnalysisHistory(domain) {
    try {
      const history = this.getAnalysisHistory()
      const filteredHistory = history.filter(item => item.domain !== domain)
      localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(filteredHistory))
    } catch (error) {
      console.error('Error removing from analysis history:', error)
    }
  }

  /**
   * Toggle favorite status
   * @param {string} domain - Domain to toggle
   */
  toggleFavorite(domain) {
    try {
      const history = this.getAnalysisHistory()
      const itemIndex = history.findIndex(item => item.domain === domain)
      
      if (itemIndex >= 0) {
        history[itemIndex].isFavorite = !history[itemIndex].isFavorite
        localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(history))
        return history[itemIndex].isFavorite
      }
      return false
    } catch (error) {
      console.error('Error toggling favorite:', error)
      return false
    }
  }

  /**
   * Get favorite domains
   * @returns {AnalysisHistoryItem[]} Array of favorite items
   */
  getFavorites() {
    return this.getAnalysisHistory().filter(item => item.isFavorite)
  }

  /**
   * Clear all history
   */
  clearAllHistory() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY)
      localStorage.removeItem(STORAGE_KEYS.ANALYSIS_HISTORY)
    } catch (error) {
      console.error('Error clearing history:', error)
    }
  }

  /**
   * Clear search history only
   */
  clearSearchHistory() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY)
    } catch (error) {
      console.error('Error clearing search history:', error)
    }
  }

  /**
   * Export history data
   * @returns {Object} Exported history data
   */
  exportHistory() {
    return {
      searchHistory: this.getSearchHistory(),
      analysisHistory: this.getAnalysisHistory(),
      exportDate: new Date().toISOString()
    }
  }

  /**
   * Import history data
   * @param {Object} data - History data to import
   */
  importHistory(data) {
    try {
      if (data.searchHistory) {
        localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(data.searchHistory))
      }
      if (data.analysisHistory) {
        localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(data.analysisHistory))
      }
    } catch (error) {
      console.error('Error importing history:', error)
    }
  }
}

export default new HistoryService()