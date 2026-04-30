import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Network, Box, Database, Zap, Globe, Shield, Server, Info, ArrowRight, PenTool, Key } from 'lucide-react';

interface NodeConfig {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
  role: string;
  description: string;
}

const getNodeConfig = (label: string): NodeConfig => {
  const lowerLabel = label.toLowerCase();

  if (lowerLabel.includes('cdn')) {
    return {
      icon: <Globe size={16} />,
      color: '#06b6d4',
      bgColor: '#ecfeff',
      borderColor: '#67e8f9',
      label: 'CDN',
      role: 'Content Delivery Network',
      description: 'Serves static content close to users, reducing origin server load',
    };
  }
  if (lowerLabel.includes('gateway')) {
    return {
      icon: <Shield size={16} />,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
      borderColor: '#c4b5fd',
      label: 'GW',
      role: 'API Gateway',
      description: 'Handles authentication, rate limiting, and request routing',
    };
  }
  if (lowerLabel.includes('lb') || lowerLabel.includes('load balancer')) {
    return {
      icon: <Network size={16} />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      borderColor: '#93c5fd',
      label: 'LB',
      role: 'Load Balancer',
      description: 'Distributes traffic across multiple application servers',
    };
  }
  if (lowerLabel.includes('redirect')) {
    return {
      icon: <ArrowRight size={16} />,
      color: '#14b8a6',
      bgColor: '#f0fdfa',
      borderColor: '#5eead4',
      label: 'REDIRECT',
      role: 'Redirect Service',
      description: 'Handles HTTP 302 redirects for short URL resolution',
    };
  }
  if (lowerLabel.includes('write')) {
    return {
      icon: <PenTool size={16} />,
      color: '#f43f5e',
      bgColor: '#fff1f2',
      borderColor: '#fda4af',
      label: 'WRITE',
      role: 'Write Service',
      description: 'Handles URL creation requests and writes mapping to DB',
    };
  }
  if (lowerLabel.includes('id-generator') || lowerLabel.includes('id generator')) {
    return {
      icon: <Key size={16} />,
      color: '#eab308',
      bgColor: '#fefce8',
      borderColor: '#fde047',
      label: 'ID-GEN',
      role: 'ID Generator',
      description: 'Generates unique short codes using selected strategy',
    };
  }
  if (lowerLabel.includes('app') || lowerLabel.includes('server')) {
    return {
      icon: <Server size={16} />,
      color: '#22c55e',
      bgColor: '#f0fdf4',
      borderColor: '#86efac',
      label: 'APP',
      role: 'Application Server',
      description: 'Processes incoming requests and business logic',
    };
  }
  if (lowerLabel.includes('db-primary') || lowerLabel.includes('db primary')) {
    return {
      icon: <Database size={16} />,
      color: '#f97316',
      bgColor: '#fff7ed',
      borderColor: '#fdba74',
      label: 'DB-P',
      role: 'Primary Database',
      description: 'Handles all write operations and serves as source of truth',
    };
  }
  if (lowerLabel.includes('db-replica') || lowerLabel.includes('db replica')) {
    return {
      icon: <Database size={16} />,
      color: '#fb923c',
      bgColor: '#fff7ed',
      borderColor: '#fdba74',
      label: 'DB-R',
      role: 'Database Replica',
      description: 'Offloads read traffic from primary database',
    };
  }
  if (lowerLabel.includes('db') || lowerLabel.includes('database')) {
    return {
      icon: <Database size={16} />,
      color: '#f97316',
      bgColor: '#fff7ed',
      borderColor: '#fdba74',
      label: 'DB',
      role: 'Database',
      description: 'Stores and retrieves application data',
    };
  }
  if (lowerLabel.includes('cache')) {
    return {
      icon: <Zap size={16} />,
      color: '#a855f7',
      bgColor: '#faf5ff',
      borderColor: '#d8b4fe',
      label: 'CACHE',
      role: 'Cache Layer',
      description: 'Stores frequently accessed data to reduce database load',
    };
  }

  return {
    icon: <Box size={16} />,
    color: '#6b7280',
    bgColor: '#f9fafb',
    borderColor: '#d1d5db',
    label: label,
    role: 'Component',
    description: 'Part of the system architecture',
  };
};

const CustomNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const config = getNodeConfig(data.label);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    data.onDelete(id);
  };

  return (
    <div
      className={`custom-node ${selected ? 'custom-node-selected' : ''}`}
      style={{
        '--node-color': config.color,
        '--node-bg': config.bgColor,
        '--node-border': config.borderColor,
      } as React.CSSProperties}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Handle type="target" position={Position.Top} className="custom-node-handle" />
      <div className="custom-node-content">
        <div className="custom-node-icon">{config.icon}</div>
        <div className="custom-node-label">{config.label}</div>
      </div>
      <button className="custom-node-delete" onClick={handleDelete} title="Delete node">
        ×
      </button>
      <Handle type="source" position={Position.Bottom} className="custom-node-handle" />

      {/* Tooltip */}
      {showTooltip && (
        <div className="node-tooltip">
          <div className="tooltip-header">
            <Info size={12} />
            <span className="tooltip-role">{config.role}</span>
          </div>
          <div className="tooltip-desc">{config.description}</div>
          {data.loadInfo && (
            <div className="tooltip-load">
              <div className="tooltip-load-bar">
                <div
                  className="tooltip-load-fill"
                  style={{
                    width: `${Math.min(data.loadInfo.loadPercentage, 100)}%`,
                    backgroundColor: data.loadInfo.status === 'overloaded' ? '#ef4444' :
                      data.loadInfo.status === 'warning' ? '#f59e0b' : '#22c55e',
                  }}
                />
              </div>
              <span className="tooltip-load-text">
                {Math.round(data.loadInfo.loadPercentage)}% load
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(CustomNode);
