import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Shield, 
  Home, 
  Clock, 
  FileText, 
  Sparkles,
  Zap
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

/**
 * Header component with navigation and theme toggle
 * @param {Object} props - Component props
 * @param {string} props.currentPage - Current active page
 * @param {Function} props.onNavigate - Navigation handler
 * @returns {JSX.Element} Header component
 */
function Header({ currentPage = 'dashboard', onNavigate }) {
  const { theme, toggleTheme, isDark } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { 
      name: 'Dashboard', 
      key: 'dashboard', 
      icon: Home,
      description: 'SSL Analysis Dashboard'
    },
    { 
      name: 'History', 
      key: 'history', 
      icon: Clock,
      description: 'Analysis History & Favorites'
    },
    { 
      name: 'Documentation', 
      key: 'docs', 
      icon: FileText,
      description: 'API Documentation'
    },
  ]

  const handleNavigation = (key) => {
    onNavigate?.(key)
    setIsMenuOpen(false)
  }

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20 dark:border-primary-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer group"
            onClick={() => handleNavigation('dashboard')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex-shrink-0 flex items-center">
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-lg transition-all duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <Sparkles className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 dark:from-white dark:to-primary-200 bg-clip-text text-transparent">
                  SSL Dashboard
                </span>
                <div className="text-xs text-primary-600 dark:text-primary-400 -mt-1 flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  Security Analysis Platform
                </div>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.key
              
              return (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavigation(item.key)}
                  className={`${
                    isActive
                      ? 'bg-gradient-secondary text-white shadow-md'
                      : 'text-primary-700 dark:text-primary-300 hover:text-white hover:bg-gradient-primary border-transparent'
                  } inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={item.description}
                >
                  <Icon className={`w-4 h-4 mr-2 ${
                    isActive ? 'text-white' : 'text-primary-600 dark:text-primary-400 group-hover:text-white'
                  }`} />
                  {item.name}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-secondary-600 -z-10"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="relative p-3 text-primary-600 dark:text-primary-400 hover:text-white hover:bg-gradient-primary focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 rounded-xl transition-all duration-300 group overflow-hidden"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              <div className="relative z-10">
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </motion.button>

            {/* Quick Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              <motion.button
                onClick={() => handleNavigation('history')}
                className="p-3 text-primary-600 dark:text-primary-400 hover:text-white hover:bg-gradient-primary rounded-xl transition-all duration-300 group relative overflow-hidden"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                title="View History"
              >
                <Clock className="h-5 w-5 relative z-10" />
                <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 text-primary-600 dark:text-primary-400 hover:text-white hover:bg-gradient-primary focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 rounded-xl transition-all duration-300 group relative overflow-hidden"
                aria-label="Toggle menu"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="relative z-10">
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-6 space-y-2 bg-white/50 dark:bg-primary-900/50 backdrop-blur-sm rounded-b-2xl border-t border-white/20 dark:border-primary-700/50">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.key
              
              return (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavigation(item.key)}
                  className={`${
                    isActive
                      ? 'bg-gradient-secondary text-white shadow-md'
                      : 'text-primary-700 dark:text-primary-300 hover:bg-gradient-primary hover:text-white'
                  } w-full flex items-center mx-3 px-4 py-4 rounded-xl text-base font-medium transition-all duration-300 group relative overflow-hidden`}
                  whileHover={{ x: 8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-5 h-5 mr-4 ${
                    isActive ? 'text-white' : 'text-primary-600 dark:text-primary-400 group-hover:text-white'
                  }`} />
                  <div className="text-left flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className={`text-xs mt-0.5 ${
                      isActive ? 'text-white/80' : 'text-primary-500 dark:text-primary-400 group-hover:text-white/80'
                    }`}>{item.description}</div>
                  </div>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-secondary-400 to-secondary-600 -z-10"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </header>
  )
}

export default Header