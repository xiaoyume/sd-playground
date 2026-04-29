import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { LoadBalancerIcon, AppServerIcon, DatabaseIcon, CacheIcon } from './icons';

const getIcon = (label: string) => {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('lb') || lowerLabel.includes('load balancer')) {
    return <LoadBalancerIcon size={32} />;
  }
  if (lowerLabel.includes('app') || lowerLabel.includes('server')) {
    return <AppServerIcon size={32} />;
  }
  if (lowerLabel.includes('db') || lowerLabel.includes('database')) {
    return <DatabaseIcon size={32} />;
  }
  if (lowerLabel.includes('cache')) {
    return <CacheIcon size={32} />;
  }
  return null;
};

const CustomNode: React.FC<NodeProps> = ({ data, id }) => {
  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    data.onDelete(id);
  };

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div className="custom-node-content">
        <div className="custom-node-icon">{getIcon(data.label)}</div>
        <div className="custom-node-label">{data.label}</div>
      </div>
      <button className="custom-node-delete" onClick={handleDelete} title="Delete node">
        ×
      </button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(CustomNode);
