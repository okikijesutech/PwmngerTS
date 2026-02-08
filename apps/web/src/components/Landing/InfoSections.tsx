import React from 'react';
import { Button } from '@pwmnger/ui';

interface InfoSectionsProps {
  onRegister: () => void;
}

export const InfoSections: React.FC<InfoSectionsProps> = ({ onRegister }) => {
  return (
    <>
      <section id="how-it-works" className="how-it-works">
        <div className="section-header animate-on-scroll">
           <h2>The <span className="gradient-text">Zero-Knowledge</span> Protocol</h2>
           <p style={{ color: "rgba(255, 255, 255, 0.9)" }}>Privacy is not an elective feature. It's the core of our architectural DNA.</p>
        </div>

        <div className="workflow-steps">
          <div className="workflow-step animate-on-scroll">
            <div className="step-num">01</div>
            <div className="step-content">
              <h3>Local Key Derivation</h3>
              <p>Your master password is processed through <strong>Argon2id</strong> with high memory-cost parameters. The resulting key never leaves your RAM.</p>
            </div>
          </div>
          <div className="workflow-step animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
            <div className="step-num">02</div>
            <div className="step-content">
              <h3>Authenticated Encryption</h3>
              <p>Data is sealed using <strong>AES-256-GCM</strong>. Every entry is signed, ensuring that even a bit-flip in transit is detected instantly.</p>
            </div>
          </div>
          <div className="workflow-step animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
            <div className="step-num">03</div>
            <div className="step-content">
              <h3>Encrypted Synchronization</h3>
              <p>Only the encrypted "blob" reaches our servers. We have no keys, no backdoors, and no possibility of data access.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="use-cases animate-on-scroll">
         <div className="section-header">
            <h2>Your Security, <span className="gradient-text">Everywhere</span></h2>
            <p style={{ color: "rgba(255, 255, 255, 0.8)" }}>Seamlessly integrated into your existing digital workflow.</p>
         </div>
         <div className="use-case-grid">
            <div className="use-case-card glass animate-on-scroll hover-lift">
              <div className="use-case-icon">💻</div>
              <h3>Browser Extension</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Autofill and capture passwords directly in Chrome, Firefox, and Edge.</p>
            </div>
            <div className="use-case-card glass animate-on-scroll hover-lift" style={{ transitionDelay: '0.1s' }}>
              <div className="use-case-icon">📱</div>
              <h3>Native Mobile</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Access your vault on the go with Biometric Unlock on iOS and Android.</p>
            </div>
            <div className="use-case-card glass animate-on-scroll hover-lift" style={{ transitionDelay: '0.2s' }}>
              <div className="use-case-icon">🌐</div>
              <h3>Secure Web</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Manage your account settings and recovery options from any browser globally.</p>
            </div>
         </div>
      </section>

      <section id="compare" className="comparison-section">
        <div className="section-header">
           <h2>Engineered to <span className="gradient-text">Outperform</span></h2>
           <p style={{ color: "rgba(255, 255, 255, 0.9)" }}>Why trust PwmngerTS over legacy alternatives?</p>
        </div>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Google / Apple</th>
              <th>Bitwarden</th>
              <th className="highlight">PwmngerTS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Zero-Knowledge Architecture</td>
              <td><span className="cross">✕</span> (Cloud-based)</td>
              <td><span className="check">✓</span> Yes</td>
              <td className="highlight"><span className="check">✓</span> Yes</td>
            </tr>
            <tr>
              <td>Open Source Codebase</td>
              <td><span className="cross">✕</span> Closed</td>
              <td><span className="check">✓</span> Yes</td>
              <td className="highlight"><span className="check">✓</span> Transparent</td>
            </tr>
            <tr>
              <td>Argon2id Key Derivation</td>
              <td><span className="cross">✕</span> PBKDF2</td>
              <td><span className="check">✓</span> Yes</td>
              <td className="highlight"><span className="check">✓</span> Optimized</td>
            </tr>
            <tr>
              <td>2026 Stack (TS Native)</td>
              <td><span className="cross">✕</span> Legacy</td>
              <td><span className="cross">✕</span> .NET/Legacy</td>
              <td className="highlight"><span className="check">✓</span> TypeScript</td>
            </tr>
            <tr>
              <td>Privacy Focused</td>
              <td><span className="cross">✕</span> Data Mining</td>
              <td><span className="check">✓</span> High</td>
              <td className="highlight"><span className="check">✓</span> Maximum</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="community animate-on-scroll">
        <div className="community-inner glass hover-glow">
          <div style={{ fontSize: 60, marginBottom: 20 }}>🛡️</div>
          <h2>Our Promise: <span className="gradient-text">Open Source</span> Forever</h2>
          <p style={{ color: "rgba(255, 255, 255, 0.9)", maxWidth: 800, marginInline: "auto", fontSize: 18, lineHeight: 1.8 }}>
            In the world of security, trust is earned through transparency. Unlike proprietary managers, PwmngerTS allows you to inspect every line of code that handles your secrets. No backdoors, no tracking, just code.
          </p>
          <div className="community-links" style={{ display: "flex", gap: 20, justifyContent: "center" }}>
            <a href="https://github.com/okikijesutech/PwmngerTS" target="_blank" className="github-link" style={{ boxShadow: "0 10px 30px rgba(255,255,255,0.1)" }}>
              ⭐ Star us on GitHub
            </a>
            <Button variant="secondary" onClick={() => window.open('https://github.com/okikijesutech/PwmngerTS/issues', '_blank')}>
              Report Vulnerability
            </Button>
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="section-header animate-on-scroll">
          <h2>Security <span className="gradient-text">First</span></h2>
        </div>
        <div className="faq-grid">
          <div className="faq-item animate-on-scroll">
            <h3 style={{ borderLeft: "3px solid #1677ff", paddingLeft: 16 }}>Master Password Ownership</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.8)", paddingLeft: 16 }}>Because we are zero-knowledge, we never see your password. If you lose it, your data is mathematically impossible to recover without your secret recovery kit.</p>
          </div>
          <div className="faq-item animate-on-scroll">
            <h3 style={{ borderLeft: "3px solid #722ed1", paddingLeft: 16 }}>Quantum-Ready Strategy</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.8)", paddingLeft: 16 }}>We use the latest AES-256-GCM authenticated encryption, the current industry benchmark for cryptographic resistance against modern threats.</p>
          </div>
        </div>
      </section>

      <section className="final-cta animate-on-scroll">
         <div className="glass-card cta-inner">
            <div className="cta-bg-glow"></div>
            <h2>Secure your future today.</h2>
            <p style={{ color: "rgba(255, 255, 255, 0.95)", marginBottom: 48 }}>
              Experience true zero-knowledge privacy. Free, open source, and built for the future.
            </p>
            <Button onClick={onRegister} style={{ padding: '16px 50px', fontSize: '20px', fontWeight: 800, boxShadow: "0 15px 40px rgba(22, 119, 255, 0.4)" }}>Build Your Vault Now</Button>
         </div>
      </section>
    </>
  );
};
