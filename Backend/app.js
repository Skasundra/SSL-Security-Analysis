// app.js
import express from "express";
import getCertLogs from "./crtSh.js";
import analyzeSSL from "./sslLabs.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 9000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Enhanced CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Max-Age", "3600");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`
  );
  next();
});

// Domain validation middleware
const validateDomain = (req, res, next) => {
  const { domain } = req.params;

  if (!domain) {
    return res.status(400).json({
      success: false,
      error: "Domain parameter is required",
      timestamp: new Date().toISOString(),
    });
  }

  // Basic domain validation
  const domainRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.([a-zA-Z]{2,}\.?)+$/;
  if (!domainRegex.test(domain)) {
    return res.status(400).json({
      success: false,
      error: "Invalid domain format",
      domain: domain,
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

// Root route - API documentation
app.get("/", (req, res) => {
  res.json({
    name: "SSL Security Analysis API",
    version: "2.0.0",
    description:
      "Comprehensive SSL/TLS security analysis and certificate transparency monitoring",
    endpoints: {
      "GET /analyze/:domain": "Complete SSL security analysis (recommended)",
      "GET /health": "API health status",
    },
    usage: {
      example: `${req.protocol}://${req.get("host")}/analyze/google.com`,
      rateLimit: "No rate limiting currently applied",
      timeout: "Maximum 2 minutes per analysis",
    },
    features: [
      "SSL Labs comprehensive security analysis",
      "Certificate transparency log monitoring",
      "Vulnerability detection",
      "Certificate chain analysis",
      "Subdomain discovery",
      "Historical certificate tracking",
    ],
  });
});

// Main analysis endpoint - combines SSL Labs + Certificate Transparency
app.get("/analyze/:domain", validateDomain, async (req, res) => {
  const { domain } = req.params;
  const startTime = Date.now();

  try {
    console.log(`Starting comprehensive SSL analysis for: ${domain}`);

    // Set response timeout
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          domain: domain,
          error: "Analysis timeout - request took too long",
          timestamp: new Date().toISOString(),
        });
      }
    }, 120000); // 2 minute timeout

    // Run both analyses in parallel for optimal performance
    const [sslData, certData] = await Promise.allSettled([
      analyzeSSL(domain),
      getCertLogs(domain),
    ]);

    clearTimeout(timeout);

    if (res.headersSent) return; // Response already sent due to timeout

    // Process results
    const result = {
      success: true,
      domain: domain,
      timestamp: new Date().toISOString(),
      analysisTime: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
      data: {},
    };

    // Handle SSL Labs result
    if (sslData.status === "fulfilled") {
      result.data.sslSecurity = sslData.value;
    } else {
      result.data.sslSecurity = {
        error: sslData.reason.message,
        status: "failed",
      };
    }

    // Handle Certificate Transparency result
    if (certData.status === "fulfilled") {
      result.data.certificateTransparency = certData.value;
    } else {
      result.data.certificateTransparency = {
        error: certData.reason.message,
        status: "failed",
      };
    }

    // Generate security summary
    result.summary = generateSecuritySummary(result.data);

    res.json(result);
  } catch (error) {
    console.error(`Analysis error for ${domain}:`, error.message);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        domain: domain,
        error: error.message,
        timestamp: new Date().toISOString(),
        analysisTime: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
      });
    }
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  const uptime = process.uptime();
  const memUsage = process.memoryUsage();

  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      formatted: `${Math.floor(uptime / 3600)}h ${Math.floor(
        (uptime % 3600) / 60
      )}m ${Math.floor(uptime % 60)}s`,
    },
    memory: {
      used: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
    },
    nodeVersion: process.version,
    platform: process.platform,
  });
});

// Generate security summary from analysis data
function generateSecuritySummary(data) {
  const summary = {
    overallGrade: "Unknown",
    securityIssues: [],
    recommendations: [],
    certificateStatus: "Unknown",
  };

  // SSL Labs summary
  if (data.sslSecurity && data.sslSecurity.endpoints) {
    const grades = data.sslSecurity.endpoints
      .map((ep) => ep.grade)
      .filter((g) => g && g !== "N/A");
    if (grades.length > 0) {
      summary.overallGrade = grades.sort()[0]; // Best grade
    }

    // Check for common security issues
    data.sslSecurity.endpoints.forEach((endpoint) => {
      if (endpoint.details) {
        const details = endpoint.details;

        if (details.heartbleed)
          summary.securityIssues.push("Heartbleed vulnerability detected");
        if (details.poodle)
          summary.securityIssues.push("POODLE vulnerability detected");
        if (details.freak)
          summary.securityIssues.push("FREAK vulnerability detected");
        if (details.logjam)
          summary.securityIssues.push("Logjam vulnerability detected");
        if (details.drownVulnerable)
          summary.securityIssues.push("DROWN vulnerability detected");
        if (details.supportsRc4)
          summary.securityIssues.push("RC4 cipher support detected");
        if (!details.forwardSecrecy)
          summary.recommendations.push("Enable Perfect Forward Secrecy");
        if (!details.ocspStapling)
          summary.recommendations.push("Enable OCSP Stapling");
      }
    });
  }

  // Certificate Transparency summary
  if (data.certificateTransparency && data.certificateTransparency.summary) {
    const ctSummary = data.certificateTransparency.summary;
    summary.certificateStatus =
      ctSummary.activeCertificates > 0 ? "Active" : "No active certificates";

    if (ctSummary.discoveredSubdomains > 10) {
      summary.recommendations.push("Review exposed subdomains for security");
    }
  }

  return summary;
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    message: `${req.method} ${req.path} is not a valid endpoint`,
    availableEndpoints: ["GET /analyze/:domain", "GET /health"],
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SSL Security Analysis API running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}`);
  console.log(
    `🔍 Example analysis: http://localhost:${PORT}/analyze/google.com`
  );
});
