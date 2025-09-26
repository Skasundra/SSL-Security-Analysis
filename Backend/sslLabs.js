// sslLabs.js
import axios from 'axios';

// Function to analyze SSL for a domain with comprehensive data
async function analyzeSSL(domain) {
  try {
    const apiUrl = `https://api.ssllabs.com/api/v3/analyze?host=${domain}&all=done&ignoreMismatch=on`;
    
    let data;
    let attempts = 0;
    const maxAttempts = 24; // Maximum 24 attempts (2 minutes)
    
    do {
      const response = await axios.get(apiUrl);
      console.log("response data------------------<>",response?.data)
      data = response.data;
      
      if (data.status === 'IN_PROGRESS') {
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('SSL analysis timeout - analysis taking too long');
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } while (data.status === 'IN_PROGRESS');

    if (data.status === 'ERROR') {
      throw new Error(`SSL Labs analysis failed: ${data.statusMessage || 'Unknown error'}`);
    }

    // Extract comprehensive SSL data
    const result = {
      host: data.host,
      port: data.port || 443,
      protocol: data.protocol || 'HTTP',
      isPublic: data.isPublic || false,
      status: data.status,
      startTime: data.startTime,
      testTime: data.testTime,
      engineVersion: data.engineVersion,
      criteriaVersion: data.criteriaVersion,
      endpoints: data.endpoints ? data.endpoints.map(ep => ({
        ipAddress: ep.ipAddress,
        serverName: ep.serverName,
        statusMessage: ep.statusMessage,
        grade: ep.grade,
        gradeTrustIgnored: ep.gradeTrustIgnored,
        hasWarnings: ep.hasWarnings || false,
        isExceptional: ep.isExceptional || false,
        progress: ep.progress,
        duration: ep.duration,
        eta: ep.eta,
        delegation: ep.delegation,
        details: ep.details ? {
          hostStartTime: ep.details.hostStartTime,
          certChains: ep.details.certChains ? ep.details.certChains.map(chain => ({
            id: chain.id,
            certIds: chain.certIds,
            trustPaths: chain.trustPaths,
            issues: chain.issues,
            noSni: chain.noSni
          })) : [],
          protocols: ep.details.protocols ? ep.details.protocols.map(proto => ({
            id: proto.id,
            name: proto.name,
            version: proto.version
          })) : [],
          suites: ep.details.suites ? {
            preference: ep.details.suites.preference,
            protocol: ep.details.suites.protocol,
            list: ep.details.suites.list ? ep.details.suites.list.slice(0, 10).map(suite => ({
              id: suite.id,
              name: suite.name,
              cipherStrength: suite.cipherStrength,
              kxType: suite.kxType,
              kxStrength: suite.kxStrength
            })) : []
          } : null,
          serverSignature: ep.details.serverSignature,
          prefixDelegation: ep.details.prefixDelegation,
          nonPrefixDelegation: ep.details.nonPrefixDelegation,
          vulnBeast: ep.details.vulnBeast || false,
          renegSupport: ep.details.renegSupport,
          stsResponseHeader: ep.details.stsResponseHeader,
          stsMaxAge: ep.details.stsMaxAge,
          stsSubdomains: ep.details.stsSubdomains,
          pkpResponseHeader: ep.details.pkpResponseHeader,
          sessionResumption: ep.details.sessionResumption,
          compressionMethods: ep.details.compressionMethods,
          supportsNpn: ep.details.supportsNpn || false,
          npnProtocols: ep.details.npnProtocols,
          supportsAlpn: ep.details.supportsAlpn || false,
          alpnProtocols: ep.details.alpnProtocols,
          sessionTickets: ep.details.sessionTickets,
          ocspStapling: ep.details.ocspStapling || false,
          staplingRevocationStatus: ep.details.staplingRevocationStatus,
          sniRequired: ep.details.sniRequired || false,
          httpStatusCode: ep.details.httpStatusCode,
          httpForwarding: ep.details.httpForwarding,
          supportsRc4: ep.details.supportsRc4 || false,
          rc4WithModern: ep.details.rc4WithModern || false,
          rc4Only: ep.details.rc4Only || false,
          forwardSecrecy: ep.details.forwardSecrecy,
          protocolIntolerance: ep.details.protocolIntolerance,
          miscIntolerance: ep.details.miscIntolerance,
          sims: ep.details.sims ? {
            results: ep.details.sims.results ? ep.details.sims.results.slice(0, 5).map(sim => ({
              client: sim.client,
              version: sim.version,
              platform: sim.platform,
              isReference: sim.isReference || false,
              protocols: sim.protocols,
              suites: sim.suites
            })) : []
          } : null,
          heartbleed: ep.details.heartbleed || false,
          heartbeat: ep.details.heartbeat || false,
          openSslCcs: ep.details.openSslCcs,
          openSSLLuckyMinus20: ep.details.openSSLLuckyMinus20,
          poodle: ep.details.poodle || false,
          poodleTls: ep.details.poodleTls,
          fallbackScsv: ep.details.fallbackScsv || false,
          freak: ep.details.freak || false,
          hasSct: ep.details.hasSct,
          dhPrimes: ep.details.dhPrimes,
          dhUsesKnownPrimes: ep.details.dhUsesKnownPrimes,
          dhYsReuse: ep.details.dhYsReuse || false,
          logjam: ep.details.logjam || false,
          chaCha20Preference: ep.details.chaCha20Preference || false,
          hstsPolicy: ep.details.hstsPolicy,
          hstsPreloads: ep.details.hstsPreloads,
          hpkpPolicy: ep.details.hpkpPolicy,
          hpkpRoPolicy: ep.details.hpkpRoPolicy,
          staticPkpPolicy: ep.details.staticPkpPolicy,
          drownHosts: ep.details.drownHosts,
          drownErrors: ep.details.drownErrors || false,
          drownVulnerable: ep.details.drownVulnerable || false
        } : null
      })) : [],
      certs: data.certs ? data.certs.map(cert => ({
        id: cert.id,
        subject: cert.subject,
        commonNames: cert.commonNames,
        altNames: cert.altNames,
        notBefore: cert.notBefore,
        notAfter: cert.notAfter,
        issuerSubject: cert.issuerSubject,
        sigAlg: cert.sigAlg,
        issuerLabel: cert.issuerLabel,
        revocationInfo: cert.revocationInfo,
        crlURIs: cert.crlURIs,
        ocspURIs: cert.ocspURIs,
        keyAlg: cert.keyAlg,
        keySize: cert.keySize,
        keyStrength: cert.keyStrength,
        keyKnownDebianInsecure: cert.keyKnownDebianInsecure || false,
        raw: cert.raw
      })) : []
    };

    return result;
  } catch (error) {
    throw new Error(`SSL Labs API error: ${error.message}`);
  }
}

export default analyzeSSL;