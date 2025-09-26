import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: parseInt(import.meta.env.VITE_CACHE_DURATION) || 5 * 60 * 1000, // 5 minutes default
      retry: 2,
    },
  },
})

console.log('Starting React app...')
console.log('Environment:', import.meta.env.MODE)
console.log('DEV mode:', import.meta.env.DEV)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)