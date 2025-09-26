import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import SecurityOverviewCards from "./SecurityOverviewCards";
import SSLDetailsPanel from "./SSLDetailsPanel";
import CertificateTransparencyPanel from "./CertificateTransparencyPanel";

/**
 * Main analysis results component
 * @param {Object} props - Component props
 * @param {string} props.domain - Domain being analyzed
 * @param {Object} props.data - Analysis data
 * @param {boolean} props.isLoading - Loading state
 * @param {Error} props.error - Error object
 * @param {Function} props.onRetry - Retry handler
 * @returns {JSX.Element} Analysis results component
 */
function AnalysisResults({ domain, data, isLoading, error, onRetry }) {
  if (isLoading) {
    return <LoadingState domain={domain} />;
  }

  if (error) {
    return <ErrorState domain={domain} error={error} onRetry={onRetry} />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-12 px-4 sm:px-6 lg:px-8 py-8">
      {/* Analysis Header */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-secondary rounded-full mb-6">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 dark:from-white dark:to-primary-200 bg-clip-text text-transparent mb-4">
          Analysis Results for {domain}
        </h2>
        <p className="mt-4 text-lg text-primary-600 dark:text-primary-400">
          Completed in {data.analysisTime} •{" "}
          {new Date(data.timestamp).toLocaleString()}
        </p>
      </div>

      {/* Security Overview Cards */}
      <div className="w-full">
        <SecurityOverviewCards
          sslData={data.data?.sslSecurity}
          summary={data.summary}
        />
      </div>

      {/* SSL Details Panel - Full Width */}
      <div className="w-full">
        <SSLDetailsPanel sslData={data.data?.sslSecurity} domain={domain} />
      </div>

      {/* Certificate Transparency Panel - Full Width */}
      <div className="w-full">
        <CertificateTransparencyPanel
          ctData={data.data?.certificateTransparency}
          domain={domain}
        />
      </div>
    </div>
  );
}

export default AnalysisResults;
