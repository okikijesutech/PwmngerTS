import React from 'react';
import { Button } from '@pwmnger/ui';

interface LandingNavProps {
  onLogin: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({ onLogin }) => {
  return (
    <nav className="landing-nav animate-on-scroll">
      <div className="nav-logo">
        <span className="logo-icon">🛡️</span> Pwmnger<span>TS</span>
      </div>
      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#security">Security</a>
        <Button variant="secondary" onClick={onLogin} style={{ padding: '8px 20px', fontSize: '14px' }}>Login</Button>
      </div>
    </nav>
  );
};
