import { useQuery } from '@tanstack/react-query'
import sslAnalysisService from '../services/sslAnalysisService'

/**
 * React Query hook for SSL analysis
 * @param {string} domain - Domain to analyze
 * @param {Object} options - Query options
 * @returns {Object} Query result
 * 
 */


const BASE_URL = import.meta.env.VITE_NODE_ENV === "development" ? "http://localhost:9000" : "/api";


export const useSSLAnalysis = (domain, options = {}) => {
  return useQuery({
    queryKey: ['ssl-analysis', domain],
    queryFn: () => sslAnalysisService.analyzeDomain(domain),
    enabled: !!domain && domain.length > 0,
    staleTime: parseInt(import.meta.env.VITE_CACHE_DURATION) || 5 * 60 * 1000, // 5 minutes default
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        return false
      }
      // Retry up to 2 times for other errors
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  })
}

/**
 * React Query hook for API health check
 * @param {Object} options - Query options
 * @returns {Object} Query result
 */
export const useApiHealth = (options = {}) => {
  return useQuery({
    queryKey: ['api-health'],
    queryFn: () => sslAnalysisService.getHealthStatus(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    retry: 1,
    ...options,
  })
}

/**
 * React Query hook for API information
 * @param {Object} options - Query options
 * @returns {Object} Query result
 */
export const useApiInfo = (options = {}) => {
  return useQuery({
    queryKey: ['api-info'],
    queryFn: () => sslAnalysisService.getApiInfo(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    ...options,
  })
}