import { motion } from 'framer-motion'
import { Shield, Zap, Lock, Search } from 'lucide-react'

/**
 * Loading state component for analysis
 * @param {Object} props - Component props
 * @param {string} props.domain - Domain being analyzed
 * @returns {JSX.Element} Loading component
 */


function LoadingState({ domain }) {
  return (
    <div className="text-center py-16">
      <motion.div 
        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-secondary rounded-2xl mb-6 relative overflow-hidden"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <Shield className="w-10 h-10 text-white relative z-10" />
      </motion.div>
      
      <motion.h3 
        className="text-2xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 dark:from-white dark:to-primary-200 bg-clip-text text-transparent mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Analyzing SSL Security
      </motion.h3>
      
      <motion.p 
        className="text-primary-600 dark:text-primary-400 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Running comprehensive security analysis for <span className="font-semibold text-secondary-600 dark:text-secondary-400">{domain}</span>
      </motion.p>

      {/* Progress Steps */}
      <div className="max-w-lg mx-auto">
        <div className="card card-gradient">
          <div className="card-body">
            <div className="space-y-4">
              {[
                { icon: Search, text: "Connecting to SSL Labs API...", active: true },
                { icon: Lock, text: "Analyzing certificate chain...", active: false },
                { icon: Shield, text: "Checking certificate transparency...", active: false },
                { icon: Zap, text: "Generating security report...", active: false }
              ].map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div 
                    key={index}
                    className="flex items-center text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.2 }}
                  >
                    <div className={`w-8 h-8 rounded-full mr-4 flex items-center justify-center ${
                      step.active 
                        ? 'bg-gradient-secondary' 
                        : 'bg-primary-100 dark:bg-primary-800'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        step.active 
                          ? 'text-white animate-pulse' 
                          : 'text-primary-400 dark:text-primary-500'
                      }`} />
                    </div>
                    <span className={`font-medium ${
                      step.active 
                        ? 'text-primary-900 dark:text-white' 
                        : 'text-primary-500 dark:text-primary-400'
                    }`}>
                      {step.text}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        className="mt-8 text-sm text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 rounded-lg py-2 px-4 inline-block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        This may take up to 2 minutes for a complete analysis
      </motion.div>
    </div>
  )
}

export default LoadingState