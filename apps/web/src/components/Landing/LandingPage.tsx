import React, { useState, useEffect } from 'react';
import { LandingNav } from './LandingNav';
import { Hero } from './Hero';
import { Stats } from './Stats';
import { InfoSections } from './InfoSections';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister }) => {
  const [stats, setStats] = useState({ threats: 0, guardians: 0, rating: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('stats-strip')) {
            animateStats();
          }
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal-on-scroll, .stats-strip');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    const duration = 2500;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
      const currentProgress = easeOut(progress);

      setStats({
        threats: Math.floor(currentProgress * 1250000),
        guardians: Math.floor(currentProgress * 48000),
        rating: Number((currentProgress * 100).toFixed(1))
      });

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  return (
    <div className="landing-container">
      <div className="mesh-bg"></div>
      <LandingNav onLogin={onLogin} />
      <Hero onRegister={onRegister} />
      <Stats {...stats} />
      <InfoSections onRegister={onRegister} />

      <footer className="footer-main">
        <div className="footer-logo">Pwmnger<span>TS</span></div>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">Technology</a>
          <a href="#compare">Compare</a>
          <a href="https://github.com/okikijesutech/PwmngerTS">Source</a>
        </div>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="mailto:support@pwmnger.ts">Support</a>
        </div>
        <div className="footer-copy">© 2026 PwmngerTS. Secure Zero-Knowledge Storage Global.</div>
      </footer>

      <style>{`
        .landing-container {
          position: relative;
          z-index: 1;
        }

        .stats-strip {
          display: flex;
          justify-content: space-around;
          padding: 100px 10%;
          background: border-box linear-gradient(to right, transparent, rgba(22, 119, 255, 0.03), transparent);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          opacity: 0;
          transition: opacity 1s var(--ease-premium);
        }
        .stats-strip.visible { opacity: 1; }

        .footer-main {
          padding: 100px 10% 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-logo {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -1px;
        }
        .footer-logo span { color: var(--primary); }

        .footer-links {
          display: flex;
          gap: 40px;
        }
        .footer-links a {
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .footer-links a:hover { color: var(--primary); }

        .footer-legal {
          display: flex;
          gap: 24px;
          margin-top: -10px;
        }
        .footer-legal a {
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          font-size: 13px;
          transition: color 0.3s ease;
        }
        .footer-legal a:hover { color: white; }

        .footer-copy {
          color: rgba(255, 255, 255, 0.2);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .stats-strip { flex-direction: column; gap: 40px; padding: 60px 10%; }
          .footer-links { flex-direction: column; align-items: center; gap: 20px; }
        }
      `}</style>
    </div>
  );
};
