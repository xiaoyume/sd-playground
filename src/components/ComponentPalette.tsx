import React from 'react';
import { Network, Box, Database, Zap } from 'lucide-react';
import useI18n from '../i18n/useI18n';

interface PaletteItem {
  type: string;
  labelKey: 'loadBalancer' | 'appServer' | 'database' | 'cache';
  icon: React.ReactNode;
  color: string;
}

const items: PaletteItem[] = [
  { type: 'lb', labelKey: 'loadBalancer', icon: <Network size={20} />, color: '#3b82f6' },
  { type: 'app', labelKey: 'appServer', icon: <Box size={20} />, color: '#22c55e' },
  { type: 'db', labelKey: 'database', icon: <Database size={20} />, color: '#f97316' },
  { type: 'cache', labelKey: 'cache', icon: <Zap size={20} />, color: '#a855f7' },
];

const ComponentPalette: React.FC = () => {
  const { t } = useI18n();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="component-palette">
      <h3>{t.components.title}</h3>
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
            <span className="palette-label">{t.components[item.labelKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentPalette;
