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

      <section id="install-extension" className="install-guide">
         <div className="section-header reveal-on-scroll">
            <h2>Manual <span className="text-gradient">Extension</span> Setup</h2>
            <p>Follow these steps to install the PwmngerTS browser guardian.</p>
         </div>
         <div className="guide-content glass-premium reveal-on-scroll">
            <div className="guide-layout">
              <div className="guide-text">
                <ol>
                  <li><strong>Download:</strong> Get the <code>extension-build.zip</code> from <a href="https://github.com/okikijesutech/PwmngerTS/releases" target="_blank" className="text-link">GitHub Releases</a>.</li>
                  <li><strong>Unpack:</strong> Extract the <code>.zip</code> file to a permanent folder on your drive.</li>
                  <li><strong>Extensions Page:</strong> Open <code>chrome://extensions</code> in your browser.</li>
                  <li><strong>Dev Mode:</strong> Toggle <strong>"Developer mode"</strong> in the top-right corner.</li>
                  <li><strong>Install:</strong> Click <strong>"Load unpacked"</strong> and select the extracted folder.</li>
                </ol>
                <div style={{ marginTop: '32px' }}>
                  <Button onClick={() => window.open('https://github.com/okikijesutech/PwmngerTS/releases', '_blank')}>Download Latest Zip</Button>
                </div>
              </div>
              <div className="guide-visual">
                <div className="browser-mockup">
                   <div className="mockup-header">
                      <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                   </div>
                   <div className="mockup-content">
                      <div className="mockup-toggle">Developer mode <span>●</span></div>
                   </div>
                </div>
              </div>
            </div>
         </div>
      </section>

      <section id="install-mobile" className="install-guide">
         <div className="section-header reveal-on-scroll">
            <h2>Android <span className="text-gradient">Sideload</span> Guide</h2>
            <p>Get the full PwmngerTS experience on your mobile device.</p>
         </div>
         <div className="guide-content glass-premium reveal-on-scroll">
            <div className="mobile-guide-grid">
              <div className="qr-box">
                <div className="qr-mock">📱</div>
                <p style={{ marginTop: 12, fontSize: 13, opacity: 0.6 }}>Scan to Download APK</p>
              </div>
              <div className="guide-steps">
                <ol>
                  <li><strong>APK Download:</strong> Download <code>PwmngerTS.apk</code> from the <a href="https://github.com/okikijesutech/PwmngerTS/releases" target="_blank" className="text-link">latest release</a>.</li>
                  <li><strong>Permissions:</strong> If prompted, allow <strong>"Install from Unknown Sources"</strong> in your settings.</li>
                  <li><strong>Launch:</strong> Open the file and follow the Android system prompts.</li>
                  <li><strong>Secure:</strong> Login and enable Biometric Lock for maximum safety.</li>
                </ol>
                <div style={{ marginTop: '24px' }}>
                  <Button variant="secondary" onClick={() => window.open('https://github.com/okikijesutech/PwmngerTS/releases', '_blank')}>Get Android APK</Button>
                </div>
              </div>
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

        .guide-layout { display: flex; gap: 48px; align-items: center; }
        .guide-text { flex: 1.5; }
        .guide-visual { flex: 1; }
        .browser-mockup {
          background: #1e1e1e;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .mockup-header {
          background: #333;
          padding: 8px 12px;
          display: flex;
          gap: 6px;
        }
        .mockup-header .dot { width: 8px; height: 8px; border-radius: 50%; background: #555; }
        .mockup-content { padding: 40px 20px; text-align: center; }
        .mockup-toggle {
          background: rgba(255,255,255,0.05);
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
        }
        .mockup-toggle span { color: var(--primary); font-size: 18px; }

        .text-link { color: var(--primary); text-decoration: none; font-weight: 600; }
        .text-link:hover { text-decoration: underline; }

        .qr-mock {
          width: 150px;
          height: 150px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 60px;
          border: 1px dashed rgba(255,255,255,0.1);
        }

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
