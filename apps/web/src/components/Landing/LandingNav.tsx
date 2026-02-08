import React from 'react';
import { Button } from '@pwmnger/ui';

interface LandingNavProps {
  onLogin: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({ onLogin }) => {
  return (
    <nav className="landing-nav">
      <div className="nav-logo">Pwmnger<span>TS</span></div>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">Technology</a>
        <a href="#compare">Compare</a>
        <Button onClick={onLogin} variant="secondary">Unlock Vault</Button>
      </div>

      <style>{`
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 8%;
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(2, 6, 23, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-glass);
        }
        .nav-logo {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -1px;
        }
        .nav-logo span { color: var(--primary); }
        .nav-links {
          display: flex;
          gap: 32px;
          align-items: center;
        }
        .nav-links a {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .nav-links a:hover { color: white; }

        @media (max-width: 768px) {
          .nav-links a { display: none; }
        }
      `}</style>
    </nav>
  );
};
