import React from 'react';
import { Network, Database, Zap, Globe, Shield, Server } from 'lucide-react';
import useStore from '../store/useStore';

interface PaletteItem {
  type: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const allItems: PaletteItem[] = [
  { type: 'cdn', label: 'CDN', icon: <Globe size={20} />, color: '#06b6d4' },
  { type: 'gateway', label: 'Gateway', icon: <Shield size={20} />, color: '#8b5cf6' },
  { type: 'lb', label: 'LB', icon: <Network size={20} />, color: '#3b82f6' },
  { type: 'app', label: 'APP', icon: <Server size={20} />, color: '#22c55e' },
  { type: 'cache', label: 'Cache', icon: <Zap size={20} />, color: '#a855f7' },
  { type: 'db-primary', label: 'DB Primary', icon: <Database size={20} />, color: '#f97316' },
  { type: 'db-replica', label: 'DB Replica', icon: <Database size={20} />, color: '#fb923c' },
  { type: 'db', label: 'DB', icon: <Database size={20} />, color: '#f97316' },
];

const ComponentPalette: React.FC = () => {
  const { currentScenario } = useStore();

  const items = currentScenario
    ? allItems.filter((item) => currentScenario.allowedComponents.includes(item.type))
    : allItems.slice(0, 5); // Default: cdn, gateway, lb, app, cache, db

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="component-palette">
      <h3>Components</h3>
      <div className="palette-items">
        {items.map((item) => (
          <div
            key={item.type}
            className="palette-item"
            draggable
            onDragStart={(event) => onDragStart(event, item.type)}
            style={{ '--item-color': item.color } as React.CSSProperties}
          >
            <span className="palette-icon">{item.icon}</span>
            <span className="palette-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentPalette;
