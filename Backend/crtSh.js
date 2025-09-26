// crtSh.js
import axios from 'axios';

// Function to fetch comprehensive certificate transparency data
async function getCertLogs(domain) {
  try {
    // Get certificates for the domain and its subdomains
    const apiUrl = `https://crt.sh/?q=%25.${domain}&output=json`;
    const response = await axios.get(apiUrl, {
      timeout: 15000,
      headers: {
        'User-Agent': 'SSL-Checker-API/1.0'
      }
    });
    
    const certificates = response.data || [];

    // Process and enhance certificate data
    const processedCerts = certificates.map(cert => {
      const notBefore = new Date(cert.not_before);
      const notAfter = new Date(cert.not_after);
      const now = new Date();
      
      return {
        id: cert.id,
        loggedAt: cert.entry_timestamp,
        notBefore: cert.not_before,
        notAfter: cert.not_after,
        commonName: cert.common_name,
        nameValue: cert.name_value,
        issuerCaId: cert.issuer_ca_id,
        issuerName: cert.issuer_name,
        serialNumber: cert.serial_number,
        resultCount: cert.result_count,
        isExpired: now > notAfter,
        isActive: now >= notBefore && now <= notAfter,
        daysUntilExpiry: Math.ceil((notAfter - now) / (1000 * 60 * 60 * 24)),
        validityPeriod: Math.ceil((notAfter - notBefore) / (1000 * 60 * 60 * 24)),
        subdomains: cert.name_value ? cert.name_value.split('\n').filter(name => 
          name.trim() && name.includes(domain)
        ) : []
      };
    });

    // Sort by most recent first
    processedCerts.sort((a, b) => new Date(b.loggedAt) - new Date(a.loggedAt));

    // Get statistics
    const activeCerts = processedCerts.filter(cert => cert.isActive);
    const expiredCerts = processedCerts.filter(cert => cert.isExpired);
    const uniqueIssuers = [...new Set(processedCerts.map(cert => cert.issuerName))];
    const uniqueSubdomains = [...new Set(
      processedCerts.flatMap(cert => cert.subdomains)
    )].filter(subdomain => subdomain && subdomain.length > 0);

    // Get recent certificates (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCerts = processedCerts.filter(cert => 
      new Date(cert.loggedAt) > thirtyDaysAgo
    );

    const result = {
      domain: domain,
      scanTimestamp: new Date().toISOString(),
      summary: {
        totalCertificates: certificates.length,
        activeCertificates: activeCerts.length,
        expiredCertificates: expiredCerts.length,
        recentCertificates: recentCerts.length,
        uniqueIssuers: uniqueIssuers.length,
        discoveredSubdomains: uniqueSubdomains.length
      },
      statistics: {
        issuers: uniqueIssuers.slice(0, 10),
        subdomains: uniqueSubdomains.slice(0, 20),
        certificatesByMonth: getCertificatesByMonth(processedCerts)
      },
      certificates: {
        active: activeCerts.slice(0, 10),
        recent: recentCerts.slice(0, 10),
        all: processedCerts.slice(0, 50) // Limit to 50 most recent
      }
    };

    return result;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Certificate transparency lookup timeout');
    }
    throw new Error(`Certificate transparency API error: ${error.message}`);
  }
}

// Helper function to group certificates by month
function getCertificatesByMonth(certificates) {
  const monthCounts = {};
  
  certificates.forEach(cert => {
    const date = new Date(cert.loggedAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
  });

  return Object.entries(monthCounts)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 12)
    .map(([month, count]) => ({ month, count }));
}

export default getCertLogs;