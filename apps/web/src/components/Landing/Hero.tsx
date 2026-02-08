import React from 'react';
import { Button } from '@pwmnger/ui';

interface HeroProps {
  onRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegister }) => {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 60;
    const moveY = (clientY - window.innerHeight / 2) / 60;
    setMousePos({ x: moveX, y: moveY });
  };

  return (
    <header className="hero" onMouseMove={handleMouseMove}>
      <div className="hero-content reveal-on-scroll">
        <h1>Universal Peace of Mind via <span className="text-gradient">Zero-Knowledge</span></h1>
        <p>
          The ultimate cross-platform, open-source guardian for your digital life. Encrypted locally, synchronized globally, trusted universally.
        </p>
        <div className="hero-actions">
          <Button onClick={onRegister} className="hero-cta">Start Your Vault</Button>
          <button className="outline-btn" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
            Learn the Science
          </button>
        </div>
      </div>
      <div className="hero-visual" style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}>
        <div className="glass-shield">
           <div className="shield-ring"></div>
           <div className="shield-ring"></div>
           <div className="shield-core">🔐</div>
           <div className="shield-glow"></div>
        </div>
      </div>

      <style>{`
        .hero {
          display: flex;
          align-items: center;
          padding: 120px 10%;
          min-height: 85vh;
          gap: 100px;
          position: relative;
        }

        .hero-content { flex: 1.2; }
        .hero-content h1 {
          font-size: 84px;
          line-height: 1;
          margin-bottom: 32px;
          font-weight: 900;
          letter-spacing: -3px;
        }

        .hero-content p {
          font-size: 24px;
          color: var(--text-muted);
          margin-bottom: 54px;
          max-width: 640px;
          line-height: 1.6;
          font-weight: 500;
        }

        .hero-actions {
          display: flex;
          gap: 24px;
        }

        .hero-cta {
          padding: 16px 40px !important;
          font-size: 18px !important;
          font-weight: 800 !important;
          box-shadow: 0 20px 40px var(--primary-glow) !important;
          border-radius: 14px !important;
        }

        .outline-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 14px 34px;
          border-radius: 14px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.4s var(--ease-premium);
        }
        .outline-btn:hover { 
          background: rgba(255, 255, 255, 0.08); 
          transform: translateY(-4px); 
          border-color: rgba(255,255,255,0.2);
        }

        .hero-visual {
          flex: 0.8;
          display: flex;
          justify-content: center;
          position: relative;
          transition: transform 0.2s ease-out;
        }

        .glass-shield {
          width: 380px;
          height: 380px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 72px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 50px 100px rgba(0, 0, 0, 0.6);
          animation: float 10s infinite ease-in-out;
        }

        .shield-glow {
          position: absolute;
          width: 120%;
          height: 120%;
          background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
          filter: blur(50px);
          z-index: -1;
        }

        .shield-ring {
          position: absolute;
          border: 1px solid rgba(22, 119, 255, 0.2);
          border-radius: 50%;
          animation: rotate 20s linear infinite;
        }
        .shield-ring:nth-child(1) { width: 480px; height: 480px; border-style: dashed; }
        .shield-ring:nth-child(2) { width: 560px; height: 560px; border-style: dotted; animation-direction: reverse; animation-duration: 30s; }

        .shield-core { 
          font-size: 140px; 
          filter: drop-shadow(0 0 30px var(--primary-glow)); 
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(1deg); }
          50% { transform: translateY(-40px) rotate(-1deg); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .hero { flex-direction: column; text-align: center; padding-top: 80px; }
          .hero-content h1 { font-size: 56px; letter-spacing: -2px; }
          .hero-actions { justify-content: center; }
          .hero-visual { order: -1; margin-bottom: 80px; }
          .glass-shield { width: 300px; height: 300px; }
          .shield-core { font-size: 100px; }
        }
      `}</style>
    </header>
  );
};
