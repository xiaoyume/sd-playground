import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Network, Box, Database, Zap, Globe, Shield, Server } from 'lucide-react';

interface NodeConfig {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
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
    };
  }
  if (lowerLabel.includes('gateway')) {
    return {
      icon: <Shield size={16} />,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
      borderColor: '#c4b5fd',
      label: 'GW',
    };
  }
  if (lowerLabel.includes('lb') || lowerLabel.includes('load balancer')) {
    return {
      icon: <Network size={16} />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      borderColor: '#93c5fd',
      label: 'LB',
    };
  }
  if (lowerLabel.includes('app') || lowerLabel.includes('server')) {
    return {
      icon: <Server size={16} />,
      color: '#22c55e',
      bgColor: '#f0fdf4',
      borderColor: '#86efac',
      label: 'APP',
    };
  }
  if (lowerLabel.includes('db-primary') || lowerLabel.includes('db primary')) {
    return {
      icon: <Database size={16} />,
      color: '#f97316',
      bgColor: '#fff7ed',
      borderColor: '#fdba74',
      label: 'DB-P',
    };
  }
  if (lowerLabel.includes('db-replica') || lowerLabel.includes('db replica')) {
    return {
      icon: <Database size={16} />,
      color: '#fb923c',
      bgColor: '#fff7ed',
      borderColor: '#fdba74',
      label: 'DB-R',
    };
  }
  if (lowerLabel.includes('db') || lowerLabel.includes('database')) {
    return {
      icon: <Database size={16} />,
      color: '#f97316',
      bgColor: '#fff7ed',
      borderColor: '#fdba74',
      label: 'DB',
    };
  }
  if (lowerLabel.includes('cache')) {
    return {
      icon: <Zap size={16} />,
      color: '#a855f7',
      bgColor: '#faf5ff',
      borderColor: '#d8b4fe',
      label: 'CACHE',
    };
  }

  return {
    icon: <Box size={16} />,
    color: '#6b7280',
    bgColor: '#f9fafb',
    borderColor: '#d1d5db',
    label: label,
  };
};

const CustomNode: React.FC<NodeProps> = ({ data, id, selected }) => {
  const config = getNodeConfig(data.label);

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
    </div>
  );
};

export default memo(CustomNode);
