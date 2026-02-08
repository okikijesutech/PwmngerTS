import React from 'react';

interface StatsProps {
  threats: number;
  guardians: number;
  rating: number;
}

export const Stats: React.FC<StatsProps> = ({ threats, guardians, rating }) => {
  return (
    <section className="stats-strip">
       <div className="stat-item reveal-on-scroll">
          <h3 className="text-gradient">{(threats / 1000000).toFixed(1)}M+</h3>
          <p>Threats Defused</p>
       </div>
       <div className="stat-item reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
          <h3 className="text-gradient">{(guardians / 1000).toFixed(0)}k+</h3>
          <p>Active Users</p>
       </div>
       <div className="stat-item reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
          <h3 className="text-gradient">{rating}%</h3>
          <p>Security Audit</p>
       </div>

       <style>{`
         .stat-item {
           text-align: center;
         }
         .stat-item h3 {
           font-size: 64px;
           font-weight: 900;
           letter-spacing: -3px;
           margin-bottom: 8px;
         }
         .stat-item p {
           color: var(--text-muted);
           font-size: 14px;
           font-weight: 700;
           text-transform: uppercase;
           letter-spacing: 2px;
         }

         @media (max-width: 768px) {
           .stat-item h3 { font-size: 48px; }
         }
       `}</style>
    </section>
  );
};
