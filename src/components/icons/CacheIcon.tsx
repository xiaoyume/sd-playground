import React from 'react';

const CacheIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      stroke="#faad14"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#fffbe6"
    />
  </svg>
);

export default CacheIcon;
