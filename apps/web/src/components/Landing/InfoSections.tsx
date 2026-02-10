import React from 'react';
import { Button } from '@pwmnger/ui';

interface InfoSectionsProps {
  onRegister: () => void;
}

export const InfoSections: React.FC<InfoSectionsProps> = ({ onRegister }) => {
  return (
    <>
      <section id="how-it-works" className="how-it-works">
        <div className="section-header reveal-on-scroll">
           <h2>The <span className="text-gradient">Zero-Knowledge</span> Protocol</h2>
           <p>Privacy is not an elective feature. It's our absolute core.</p>
        </div>

        <div className="workflow-steps">
          <div className="workflow-step reveal-on-scroll">
            <div className="step-num">01</div>
            <div className="step-content">
              <h3>Local Key Derivation</h3>
              <p>Your master password is processed through <strong>Argon2id</strong> with maximum memory-hard parameters. The key never leaves your RAM.</p>
            </div>
          </div>
          <div className="workflow-step reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <div className="step-num">02</div>
            <div className="step-content">
              <h3>Authenticated Encryption</h3>
              <p>Data is sealed using <strong>AES-256-GCM</strong>. Every entry is signed, ensuring that even a bit-flip in transit is detected instantly.</p>
            </div>
          </div>
          <div className="workflow-step reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="step-num">03</div>
            <div className="step-content">
              <h3>Encrypted Synchronization</h3>
              <p>Only the encrypted "blob" reaches our servers. We have no keys, no backdoors, and no possibility of data access.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="use-cases">
         <div className="section-header reveal-on-scroll">
            <h2>Your Security, <span className="text-gradient">Everywhere</span></h2>
            <p>Seamlessly integrated into your digital workflow.</p>
         </div>
         <div className="use-case-grid">
            <div className="use-case-card glass-premium reveal-on-scroll hover-energy">
              <div className="use-case-icon">💻</div>
              <h3>Browser Extension</h3>
              <p>Autofill and capture passwords directly in Chrome, Firefox, and Edge.</p>
            </div>
            <div className="use-case-card glass-premium reveal-on-scroll hover-energy" style={{ transitionDelay: '0.1s' }}>
              <div className="use-case-icon">📱</div>
              <h3>Native Mobile</h3>
              <p>Access your vault on the go with biometric integration on iOS and Android.</p>
            </div>
            <div className="use-case-card glass-premium reveal-on-scroll hover-energy" style={{ transitionDelay: '0.2s' }}>
              <div className="use-case-icon">🌐</div>
              <h3>Secure Web</h3>
              <p>Manage your account settings and recovery options from any browser globally.</p>
            </div>
         </div>
      </section>

      <section id="compare" className="comparison-section">
        <div className="section-header reveal-on-scroll">
           <h2>Engineered to <span className="text-gradient">Outperform</span></h2>
           <p>Why trust PwmngerTS over legacy alternatives?</p>
        </div>
        <div className="table-container reveal-on-scroll">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Traditional</th>
                <th>Legacy Managers</th>
                <th className="highlight">PwmngerTS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Zero-Knowledge</td>
                <td className="no">No</td>
                <td className="partial">Partial</td>
                <td className="yes highlight">Complete</td>
              </tr>
              <tr>
                <td>Open Source</td>
                <td className="no">Closed</td>
                <td className="partial">Selective</td>
                <td className="yes highlight">100% Core</td>
              </tr>
              <tr>
                <td>Argon2id KDF</td>
                <td className="no">PBKDF2</td>
                <td className="yes">Yes</td>
                <td className="yes highlight">Optimized</td>
              </tr>
              <tr>
                <td>2026 Stack</td>
                <td className="no">Legacy</td>
                <td className="no">Mixed</td>
                <td className="yes highlight">TS Native</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="community">
        <div className="community-inner glass-premium reveal-on-scroll hover-energy">
          <div className="community-icon">🛡️</div>
          <h2>Our Promise: <span className="text-gradient">Open Source</span> Forever</h2>
          <p>
            In the world of security, trust is earned through transparency. Unlike proprietary managers, PwmngerTS allows you to inspect every line of code. No backdoors, no tracking, just code.
          </p>
          <div className="community-links">
            <a href="https://github.com/okikijesutech/PwmngerTS" target="_blank" className="github-link">
              ⭐ Star on GitHub
            </a>
            <Button variant="secondary" onClick={() => window.open('https://github.com/okikijesutech/PwmngerTS/issues', '_blank')}>
              Report Vulnerability
            </Button>
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="faq-grid">
          <div className="faq-item reveal-on-scroll">
            <h3 className="accent-blue">Master Password Ownership</h3>
            <p>Because we are zero-knowledge, we never see your password. If you lose it, your data is mathematically impossible to recover without your secret recovery kit.</p>
          </div>
          <div className="faq-item reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <h3 className="accent-purple">Hardware Isolation</h3>
            <p>We leverage the Web Crypto API to ensure that encryption operations take place in protected browser contexts, isolated from page scripts.</p>
          </div>
        </div>
      </section>

      <section id="install" className="install-hub">
        <div className="section-header reveal-on-scroll">
          <h2>Deploy Your <span className="text-gradient">Guardian</span></h2>
          <p>Secure your identity across all platforms in minutes.</p>
        </div>

        <div className="install-grid">
          {/* Extension Card */}
          <div className="install-card glass-premium reveal-on-scroll">
            <div className="card-tag">Web & Desktop</div>
            <div className="card-icon-wrap">
              <div className="card-icon">🧩</div>
            </div>
            <h3>Browser Extension</h3>
            <p>Our flagship guardian for Chrome, Brave, and Edge.</p>
            
            <div className="install-steps">
              <div className="step">
                <span className="step-count">1</span>
                <p>Download the <code>extension-build.zip</code></p>
              </div>
              <div className="step">
                <span className="step-count">2</span>
                <p>Enable <strong>Developer Mode</strong> in <code>chrome://extensions</code></p>
              </div>
              <div className="step">
                <span className="step-count">3</span>
                <p>Click <strong>Load unpacked</strong> and select our folder</p>
              </div>
            </div>
            
            <Button className="w-full" onClick={() => window.open('/extension-build.zip', '_blank')}>
              Download ZIP Build
            </Button>
          </div>

          {/* Android Card */}
          <div className="install-card glass-premium reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <div className="card-tag">Mobile</div>
            <div className="card-icon-wrap">
              <div className="card-icon">🤖</div>
            </div>
            <h3>Android Native</h3>
            <p>Biometric security and autofill for your mobile device.</p>
            
            <div className="install-steps">
              <div className="step">
                <span className="step-count">1</span>
                <p>Get the <code>PwmngerTS.apk</code> binary</p>
              </div>
              <div className="step">
                <span className="step-count">2</span>
                <p>Allow <strong>Unknown Sources</strong> in settings</p>
              </div>
              <div className="step">
                <span className="step-count">3</span>
                <p>Install and enable <strong>Biometric Lock</strong></p>
              </div>
            </div>
            
            <Button variant="secondary" className="w-full" onClick={() => window.open('/PwmngerTS.apk', '_blank')}>
              Download APK
            </Button>
          </div>

          {/* iOS Card */}
          <div className="install-card glass-premium reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
             <div className="card-tag muted">Coming Soon</div>
            <div className="card-icon-wrap">
              <div className="card-icon">🍎</div>
            </div>
            <h3>iOS Guardian</h3>
            <p>Apple ecosystem integration currently in active development.</p>
            
            <div className="install-empty">
               <div className="pulse-dot"></div>
               <p>Beta testing starts Q2 2026</p>
            </div>

            <Button variant="secondary" disabled style={{ opacity: 0.5 }}>
              Check TestFlight
            </Button>
          </div>
        </div>
      </section>

      <section className="final-cta reveal-on-scroll">
         <div className="cta-inner glass-premium">
            <div className="cta-glow"></div>
            <h2>Secure your digital future.</h2>
            <p>Experience true zero-knowledge privacy. Free, open source, and built for the future.</p>
            <Button onClick={onRegister} className="cta-btn">Build Your Vault Now</Button>
         </div>
      </section>

      <style>{`
        .section-header { text-align: center; margin-bottom: 80px; }
        .section-header h2 { font-size: 52px; font-weight: 900; letter-spacing: -2px; margin-bottom: 16px; }
        .section-header p { font-size: 20px; color: var(--text-muted); font-weight: 500; }

        .how-it-works { padding: 120px 10%; }
        .workflow-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 60px;
        }
        .workflow-step { position: relative; }
        .step-num {
          font-size: 140px;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.02);
          position: absolute;
          top: -80px;
          left: -20px;
          z-index: -1;
        }
        .step-content h3 { font-size: 24px; font-weight: 800; margin-bottom: 16px; }
        .step-content p { color: var(--text-muted); line-height: 1.7; font-size: 17px; }

        .use-cases { padding: 120px 10%; }
        .use-case-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        .use-case-card {
          padding: 60px 40px;
          border-radius: var(--radius-xl);
          text-align: center;
        }
        .use-case-icon { font-size: 56px; margin-bottom: 32px; filter: drop-shadow(0 0 20px rgba(22, 119, 255, 0.2)); }
        .use-case-card h3 { font-size: 24px; font-weight: 800; margin-bottom: 16px; }
        .use-case-card p { color: var(--text-muted); line-height: 1.6; }

        .comparison-section { padding: 120px 10%; }
        .table-container { 
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid var(--border-glass);
          background: rgba(255,255,255,0.01);
        }
        .comparison-table { width: 100%; border-collapse: collapse; text-align: left; }
        .comparison-table th, .comparison-table td { padding: 32px; border-bottom: 1px solid var(--border-glass); }
        .comparison-table th { font-weight: 800; color: var(--text-primary); background: rgba(255,255,255,0.03); }
        .comparison-table .highlight { background: rgba(22, 119, 255, 0.05); color: var(--primary); }
        .comparison-table .yes { color: #4ade80; font-weight: 700; }
        .comparison-table .partial { color: #fbbf24; font-weight: 700; }
        .comparison-table .no { color: #f87171; font-weight: 700; }

        .community { padding: 120px 10%; }
        .community-inner {
          padding: 100px 60px;
          text-align: center;
          border-radius: 48px;
        }
        .community-icon { font-size: 80px; margin-bottom: 32px; }
        .community-inner h2 { font-size: 48px; font-weight: 900; letter-spacing: -2px; margin-bottom: 24px; }
        .community-inner p { 
          font-size: 19px; 
          color: var(--text-muted); 
          max-width: 800px; 
          margin: 0 auto 48px; 
          line-height: 1.8; 
        }
        .community-links { display: flex; gap: 24px; justify-content: center; }
        .github-link {
          padding: 14px 30px;
          background: white;
          color: black;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 800;
          transition: transform 0.3s var(--ease-premium);
        }
        .github-link:hover { transform: translateY(-4px); }

        .faq { padding: 120px 10%; }
        .faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
        .faq-item h3 { font-size: 24px; font-weight: 800; margin-bottom: 16px; padding-left: 20px; }
        .faq-item p { color: var(--text-muted); line-height: 1.7; padding-left: 20px; }
        .accent-blue { border-left: 4px solid var(--primary); }
        .accent-purple { border-left: 4px solid var(--secondary); }

        .final-cta { padding: 120px 10%; }
        .cta-inner {
          padding: 100px 40px;
          text-align: center;
          border-radius: 48px;
          position: relative;
          overflow: hidden;
        }
        .cta-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, var(--primary-glow) 0%, transparent 60%);
          transform: translate(-50%, -50%);
          z-index: -1;
          filter: blur(80px);
        }
        .cta-inner h2 { font-size: 56px; font-weight: 900; letter-spacing: -2px; margin-bottom: 24px; }
        .cta-inner p { font-size: 20px; color: var(--text-muted); margin-bottom: 48px; }
        .cta-btn { 
          padding: 18px 60px !important; 
          font-size: 20px !important; 
          font-weight: 900 !important; 
          box-shadow: 0 20px 50px var(--primary-glow) !important;
          border-radius: 16px !important;
        }

        .install-hub { padding: 120px 10%; }
        .install-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .install-card {
          padding: 40px;
          border-radius: 32px;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .card-tag {
          align-self: flex-start;
          padding: 6px 12px;
          background: rgba(22, 119, 255, 0.1);
          color: var(--primary);
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 24px;
        }
        .card-tag.muted { background: rgba(255,255,255,0.05); color: var(--text-muted); }
        .card-icon-wrap {
          width: 64px;
          height: 64px;
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        .card-icon { font-size: 32px; }
        .install-card h3 { font-size: 24px; font-weight: 800; margin-bottom: 12px; }
        .install-card p { color: var(--text-muted); font-size: 14px; margin-bottom: 32px; line-height: 1.6; }
        
        .install-steps {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
          flex: 1;
        }
        .step { display: flex; gap: 16px; align-items: flex-start; }
        .step-count {
          width: 24px;
          height: 24px;
          background: var(--primary);
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 900;
          flex-shrink: 0;
        }
        .step p { margin-bottom: 0; font-size: 13px; color: var(--text-primary); }
        .step code { background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; font-size: 11px; }

        .install-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 40px;
          color: var(--text-muted);
          opacity: 0.5;
        }
        .pulse-dot {
          width: 12px;
          height: 12px;
          background: var(--secondary);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(110, 89, 255, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(110, 89, 255, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(110, 89, 255, 0); }
        }

        .w-full { width: 100%; }

        .glass-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 10px 20px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .glass-pill:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); border-color: var(--primary); }
        .glass-pill .icon { font-size: 18px; }

        @media (max-width: 1024px) {
          .workflow-steps, .use-case-grid, .faq-grid { grid-template-columns: 1fr; }
          .community-inner { padding: 60px 30px; }
          .community-links { flex-direction: column; align-items: stretch; }
          .comparison-table th, .comparison-table td { padding: 16px; font-size: 14px; }
        }
      `}</style>
    </>
  );
};
