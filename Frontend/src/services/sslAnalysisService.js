import axios from 'axios'

/**
 * SSL Analysis Service for API communication
 */


const BASE_URL = import.meta.env.VITE_NODE_ENV === "development" ? "http://localhost:9000" : "/api";

console.log("BASE_URL0----------------->",BASE_URL)

class SSLAnalysisService {
  constructor() {
    this.baseURL = BASE_URL
    this.timeout = parseInt(import.meta.env.VITE_API_TIMEOUT) || 120000
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log(`SSL Analysis Service initialized with baseURL: ${this.baseURL}`)

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making API request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        console.error('API Error:', error.response?.data || error.message)
        
        // Transform error for better user experience
        if (error.code === 'ECONNABORTED') {
          error.message = 'Request timeout - analysis took too long'
        } else if (error.response?.status === 404) {
          error.message = 'Domain not found or API endpoint unavailable'
        } else if (error.response?.status >= 500) {
          error.message = 'Server error - please try again later'
        } else if (!error.response) {
          error.message = 'Network error - please check your connection'
        }
        
        return Promise.reject(error)
      }
    )
  }

  /**
   * Analyze SSL for a domain
   * @param {string} domain - Domain to analyze
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeDomain(domain) {
    try {
      const response = await this.client.get(`/analyze/${encodeURIComponent(domain)}`)
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Failed to analyze domain')
    }
  }

  /**
   * Get API health status
   * @returns {Promise<Object>} Health status
   */
  async getHealthStatus() {
    try {
      const response = await this.client.get('/health')
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Failed to get health status')
    }
  }

  /**
   * Get API information
   * @returns {Promise<Object>} API info
   */
  async getApiInfo() {
    try {
      const response = await this.client.get('/')
      return response.data
    } catch (error) {
      throw new Error(error.message || 'Failed to get API info')
    }
  }
}

// Create singleton instance
const sslAnalysisService = new SSLAnalysisService()

export default sslAnalysisService