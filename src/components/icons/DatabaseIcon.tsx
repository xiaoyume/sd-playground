import React from 'react';

const DatabaseIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="12" cy="6" rx="8" ry="3" stroke="#722ed1" strokeWidth="2" fill="#f9f0ff" />
    <path d="M4 6V18C4 19.1 7.6 20 12 20C16.4 20 20 19.1 20 18V6" stroke="#722ed1" strokeWidth="2" />
    <path d="M4 12C4 13.1 7.6 14 12 14C16.4 14 20 13.1 20 12" stroke="#722ed1" strokeWidth="2" />
  </svg>
);

export default DatabaseIcon;
