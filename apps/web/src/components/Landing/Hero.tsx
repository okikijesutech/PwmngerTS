import React from 'react';
import { Button } from '@pwmnger/ui';

interface HeroProps {
  onRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegister }) => {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 50;
    const moveY = (clientY - window.innerHeight / 2) / 50;
    setMousePos({ x: moveX, y: moveY });
  };

  return (
    <header className="hero" onMouseMove={handleMouseMove}>
      <div className="hero-content animate-on-scroll">
        <h1>Universal Peace of Mind via <span className="gradient-text">Zero-Knowledge</span></h1>
        <p style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "22px" }}>
          The ultimate cross-platform, open-source guardian for your digital life. Encrypted locally, synchronized globally, trusted universally.
        </p>
        <div className="hero-actions">
          <Button onClick={onRegister} style={{ padding: '12px 30px', fontSize: '16px', boxShadow: "0 10px 20px rgba(22, 119, 255, 0.3)" }}>Start Your Vault</Button>
          <button className="outline-btn" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
            Learn the Science
          </button>
        </div>
      </div>
      <div className="hero-visual animate-on-scroll" style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}>
        <div className="glass-shield">
           <div className="shield-ring"></div>
           <div className="shield-ring"></div>
           <div className="shield-core">🔐</div>
           <div className="shield-glow"></div>
        </div>
      </div>
    </header>
  );
};
