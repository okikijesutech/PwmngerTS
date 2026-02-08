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
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          if (entry.target.classList.contains('stats-strip')) {
            animateStats();
          }
        }
      });
    }, { threshold: 0.05 }); // Lower threshold for better sensitivity

    const elements = document.querySelectorAll('.animate-on-scroll, .stats-strip');
    elements.forEach(el => {
      observer.observe(el);
      // Force reveal if already in viewport (especially for Hero)
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('reveal');
      }
    });

    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    const duration = 2000;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentProgress = easeOut(progress);

      setStats({
        threats: Math.floor(currentProgress * 1200000),
        guardians: Math.floor(currentProgress * 45000),
        rating: Number((currentProgress * 99.9).toFixed(1))
      });

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  return (
    <div className="landing-container">
      <LandingNav onLogin={onLogin} />
      <Hero onRegister={onRegister} />
      <Stats {...stats} />
      <InfoSections onRegister={onRegister} />

      <style>{`
        .landing-container {
          background-color: #030816;
          color: white;
          min-height: 100vh;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .animate-on-scroll.reveal {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .glass {
          background: rgba(255, 255, 255, 0.06) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4) !important;
        }

        .hover-lift {
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease, border-color 0.4s ease, background 0.4s ease;
        }
        .hover-lift:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(22, 119, 255, 0.2);
          border-color: rgba(22, 119, 255, 0.5) !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .hover-glow {
          transition: all 0.5s ease;
        }
        .hover-glow:hover {
          background: rgba(22, 119, 255, 0.15) !important;
          box-shadow: 0 0 60px rgba(22, 119, 255, 0.3) !important;
          border-color: rgba(22, 119, 255, 0.5) !important;
        }

        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 5%;
          background: rgba(2, 6, 18, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-logo {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -1px;
        }
        .nav-logo span { color: #1677ff; }

        .nav-links {
          display: flex;
          gap: 30px;
          align-items: center;
        }
        .nav-links a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.3s;
        }
        .nav-links a:hover { color: #1677ff; }

        .hero {
          display: flex;
          align-items: center;
          padding: 120px 10%;
          min-height: 80vh;
          gap: 80px;
          position: relative;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 60%;
          height: 140%;
          background: radial-gradient(circle at center, rgba(22, 119, 255, 0.15) 0%, transparent 70%);
          z-index: 0;
          filter: blur(80px);
        }

        .hero-content { flex: 1.2; position: relative; z-index: 1; }
        .hero-content h1 {
          font-size: 72px;
          line-height: 1.05;
          margin-bottom: 24px;
          font-weight: 800;
          letter-spacing: -2px;
        }
        .hero-content p {
          font-size: 22px;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 48px;
          max-width: 600px;
          line-height: 1.6;
        }

        .gradient-text {
          background: linear-gradient(135deg, #1677ff 0%, #722ed1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-actions {
          display: flex;
          gap: 20px;
        }

        .outline-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 12px 30px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s;
        }
        .outline-btn:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-2px); }

        .hero-visual {
          flex: 0.8;
          display: flex;
          justify-content: center;
          position: relative;
        }

        .glass-shield {
          width: 340px;
          height: 340px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 60px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
          animation: float 8s infinite ease-in-out;
        }

        .shield-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(22, 119, 255, 0.2) 0%, transparent 70%);
          filter: blur(40px);
          z-index: -1;
        }

        .shield-ring {
          position: absolute;
          border: 1px solid rgba(22, 119, 255, 0.3);
          border-radius: 50%;
          animation: rotate 12s linear infinite;
        }
        .shield-ring:nth-child(1) { width: 440px; height: 440px; border-style: dashed; }
        .shield-ring:nth-child(2) { width: 520px; height: 520px; border-style: dotted; animation-direction: reverse; }

        .shield-core { font-size: 120px; filter: drop-shadow(0 0 20px rgba(22, 119, 255, 0.5)); }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-30px) rotate(-2deg); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .stats-strip {
          display: flex;
          justify-content: space-around;
          padding: 80px 10%;
          background: linear-gradient(to right, transparent, rgba(22, 119, 255, 0.05), transparent);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .stat-item { text-align: center; }
        .stat-item h3 { font-size: 52px; margin-bottom: 8px; font-weight: 800; letter-spacing: -2px; }
        .stat-item p { color: rgba(255, 255, 255, 0.4); font-size: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }

        .how-it-works { padding: 120px 10%; }
        .workflow-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 60px;
          margin-top: 80px;
        }
        .workflow-step { position: relative; }
        .step-num {
          font-size: 120px;
          font-weight: 900;
          color: rgba(22, 119, 255, 0.05);
          position: absolute;
          top: -60px;
          left: -20px;
          z-index: -1;
        }
        .step-content h3 { font-size: 24px; margin-bottom: 16px; font-weight: 700; }
        .step-content p { color: rgba(255, 255, 255, 0.5); line-height: 1.7; font-size: 17px; }

        .use-cases { padding: 120px 10%; background: rgba(255, 255, 255, 0.02); }
        .use-case-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-top: 80px;
        }
        .use-case-card {
          padding: 60px 40px;
          border-radius: 40px;
          text-align: center;
        }
        .use-case-icon { font-size: 48px; margin-bottom: 24px; }

        .community { padding: 100px 10%; }
        .community-inner {
          padding: 80px;
          border-radius: 48px;
          text-align: center;
          border-color: rgba(114, 46, 209, 0.2);
        }
        .community-links { margin-top: 40px; }
        .github-link {
          display: inline-block;
          padding: 14px 34px;
          background: white;
          color: black;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 700;
          transition: transform 0.3s;
        }
        .github-link:hover { transform: scale(1.05); }

        .faq { padding: 120px 10%; }
        .faq-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .faq-item h3 { font-size: 22px; margin-bottom: 16px; font-weight: 700; }
        .faq-item p { color: rgba(255, 255, 255, 0.5); line-height: 1.6; }

        .final-cta { padding: 120px 10%; position: relative; z-index: 1; }
        .cta-inner {
          padding: 80px 40px;
          border-radius: 40px;
          background: linear-gradient(135deg, rgba(11, 21, 49, 0.8) 0%, rgba(3, 8, 22, 0.8) 100%) !important;
          border: 1px solid rgba(22, 119, 255, 0.3) !important;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6) !important;
        }
        .cta-inner h2 { font-size: 48px; margin-bottom: 24px; font-weight: 800; letter-spacing: -2px; color: #fff; }

        .comparison-section { padding: 100px 10%; background: #050b1d; border-top: 1px solid rgba(255,255,255,0.05); }
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 40px;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .comparison-table td { color: #fff; font-size: 16px; font-weight: 500; }

        .footer-main {
          margin-top: 60px;
          padding: 80px 10% 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: #020612;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        .footer-logo { font-size: 24px; font-weight: 800; color: #fff; }
        .footer-copy { color: rgba(255, 255, 255, 0.8); font-size: 14px; font-weight: 500; }

        @media (max-width: 1200px) {
          .hero-content h1 { font-size: 60px; }
          .hero { gap: 40px; }
          .workflow-steps, .use-case-grid { gap: 30px; }
        }

        @media (max-width: 1024px) {
          .hero { flex-direction: column; text-align: center; padding-top: 60px; }
          .hero-content h1 { font-size: 52px; }
          .hero-actions { justify-content: center; }
          .workflow-steps, .use-case-grid, .faq-grid { grid-template-columns: 1fr; }
          .hero-visual { order: -1; margin-bottom: 60px; }
          .hero::before { display: none; }
          .comparison-table { display: block; overflow-x: auto; }
        }
      `}</style>
    </div>
  );
};
