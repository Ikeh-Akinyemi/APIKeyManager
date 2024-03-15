import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <div className="hero">
      <h1>API Key Manager</h1>
      <p>Manage and secure your API keys efficiently with our comprehensive API Key Manager.</p>
      <input type="search" placeholder="Search..." />
    </div>
  );
};

export default Hero;
