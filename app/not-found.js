import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-3xl aspect-[2/1]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" className="w-full h-full">
          <defs>
            <filter id="neon">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#e0e7ff" }} />
              <stop offset="100%" style={{ stopColor: "#c7d2fe" }} />
            </linearGradient>
            <radialGradient id="circle-gradient">
              <stop offset="0%" style={{ stopColor: "#818cf8" }} />
              <stop offset="100%" style={{ stopColor: "#6366f1" }} />
            </radialGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#bg-gradient)" />

          <text x="50%" y="45%" fontFamily="Arial, sans-serif" fontSize="120" fontWeight="bold" textAnchor="middle" fill="#4f46e5" filter="url(#neon)" transform="translate(0, 10) skewX(-15)">
            404
          </text>

          <text x="50%" y="65%" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" textAnchor="middle" fill="#6366f1" filter="url(#neon)" transform="translate(0, 10)">
            NOT FOUND
          </text>

          <g transform="translate(400, 200) rotate(-10)">
            <rect x="-150" y="-10" width="300" height="20" fill="#818cf8" opacity="0.7" />
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="2s" repeatCount="indefinite" />
          </g>

          <circle cx="100" cy="100" r="50" fill="url(#circle-gradient)" opacity={0.5}>
            <animate attributeName='r' values='50;60;50' dur='2s' repeatCount='indefinite' />
          </circle>

          <polygon points='700,300 750,350 650,350' fill='#818cf8' opacity={0.7}>
            <animateTransform attributeName='transform' type='rotate' from='0 700 350' to='360 700 350' dur='10s' repeatCount='indefinite' />
          </polygon>

          <circle cx='200' cy='350' r='30' fill='#818cf8' opacity={0.5}>
            <animate attributeName='r' values='30;40;30' dur='3s' repeatCount='indefinite' />
          </circle>
          
          <circle cx='600' cy='50' r='30' fill='#818cf8' opacity={0.5}>
            <animate attributeName='r' values='30;40;30' dur='3s' repeatCount='indefinite' />
          </circle>

          <polygon points='700,150 720,180 680,180' fill='#818cf8' opacity={0.7}>
            <animateTransform attributeName='transform' type='translate' values='0,0; 0,-10; 0,0' dur='2s' repeatCount='indefinite' />
          </polygon>
        </svg>
      </div>
      
      <Link href="/" passHref>
        <button className="
          mt-8 group relative inline-flex items-center justify-center px-8 py-3
          font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600
          rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
        >
          <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-300 ease-in-out bg-purple-600 rounded-lg group-hover:mt-0 group-hover:ml-0"></span>
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg"></span>
          <span className="relative">Take Me Home</span>
        </button>
      </Link>
    </div>
  );
};

export default NotFound;