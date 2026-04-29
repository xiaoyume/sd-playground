import React from 'react';

const AppServerIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="#52c41a" strokeWidth="2" fill="#f6ffed" />
    <rect x="7" y="5" width="10" height="3" rx="1" fill="#52c41a" />
    <rect x="7" y="10" width="10" height="3" rx="1" fill="#52c41a" />
    <circle cx="9" cy="16" r="1" fill="#52c41a" />
    <circle cx="12" cy="16" r="1" fill="#52c41a" />
    <circle cx="15" cy="16" r="1" fill="#52c41a" />
  </svg>
);

export default AppServerIcon;
