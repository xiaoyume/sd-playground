import React from 'react';

const LoadBalancerIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#1890ff" strokeWidth="2" fill="#e6f7ff" />
    <path d="M8 12H16" stroke="#1890ff" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 8L16 12L12 16" stroke="#1890ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="6" cy="8" r="1.5" fill="#1890ff" />
    <circle cx="6" cy="16" r="1.5" fill="#1890ff" />
  </svg>
);

export default LoadBalancerIcon;
