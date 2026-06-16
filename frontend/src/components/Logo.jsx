import React from 'react';

const Logo = ({ width = 40, height = 40, showText = true }) => {
  return (
    <div className="d-flex align-items-center gap-2">
      {/* SVG Icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100" 
        width={width} 
        height={height}
        fill="none"
      >
        <defs>
          {/* Premium Blue Gradient */}
          <linearGradient id="novusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" /> {/* Primary Blue */}
            <stop offset="100%" stopColor="#0ea5e9" /> {/* Light Blue/Cyan */}
          </linearGradient>
          
          {/* Dark Gradient for the folded corner */}
          <linearGradient id="novusFold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* Main Document Shape with stylized 'N' cutouts */}
        <path 
          d="M20 20 C20 12 26 6 34 6 L66 6 C74 6 80 12 80 20 L80 80 C80 88 74 94 66 94 L34 94 C26 94 20 88 20 80 Z" 
          fill="url(#novusGradient)" 
        />
        
        {/* The "N" / Upward Growth Arrow inside the document */}
        <path 
          d="M35 70 L35 45 L50 70 L65 70 L65 30 L50 30 L50 55 L35 30 L35 70 Z" 
          fill="#ffffff" 
        />
        
        {/* Futuristic Folded Corner for the "CV/Document" aspect */}
        <path 
          d="M80 20 L80 35 C70 35 65 30 65 20 L80 20 Z" 
          fill="url(#novusFold)" 
          opacity="0.8"
        />
      </svg>

      {/* Brand Text */}
      {showText && (
        <span 
          className="fw-bolder mb-0 tracking-tight" 
          style={{ 
            fontSize: `${width * 0.55}px`, 
            color: '#1e293b', 
            fontFamily: "'Inter', sans-serif" 
          }}
        >
          Novus<span className="text-primary">CV</span>
        </span>
      )}
    </div>
  );
};

export default Logo;