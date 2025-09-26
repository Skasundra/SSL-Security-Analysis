import Header from "./Header";
import ErrorBoundary from "./ErrorBoundary";
import { useTheme } from "../../contexts/ThemeContext";

/**
 * Main application layout component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.currentPage - Current active page
 * @param {Function} props.onNavigate - Navigation handler
 * @returns {JSX.Element} Layout component
 */
function AppLayout({ children, currentPage, onNavigate }) {
  const { theme, isDark } = useTheme();

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDark ? "dark" : ""
      }`}
    >
      <div className="min-h-screen bg-gradient-surface">
        <ErrorBoundary>
          <Header currentPage={currentPage} onNavigate={onNavigate} />
          <main className="flex-1">{children}</main>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default AppLayout;
