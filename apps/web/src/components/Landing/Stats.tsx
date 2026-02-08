import React from 'react';

interface StatsProps {
  threats: number;
  guardians: number;
  rating: number;
}

export const Stats: React.FC<StatsProps> = ({ threats, guardians, rating }) => {
  return (
    <section className="stats-strip">
       <div className="stat-item">
          <h3 className="counter gradient-text">{(threats / 1000000).toFixed(1)}M+</h3>
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Threats Annihilated</p>
       </div>
       <div className="stat-item">
          <h3 className="counter gradient-text">{(guardians / 1000).toFixed(0)}k+</h3>
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Active Guardians</p>
       </div>
       <div className="stat-item">
          <h3 className="counter gradient-text">{rating}%</h3>
          <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>Security Rating</p>
       </div>
    </section>
  );
};
