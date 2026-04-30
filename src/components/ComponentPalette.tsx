import React from 'react';
import { Network, Database, Zap, Globe, Shield, Server } from 'lucide-react';
import useStore from '../store/useStore';
import useI18n from '../i18n/useI18n';

interface PaletteItem {
  type: string;
  labelKey: string;
  icon: React.ReactNode;
  color: string;
}

const allItems: PaletteItem[] = [
  { type: 'cdn', labelKey: 'cdn', icon: <Globe size={20} />, color: '#06b6d4' },
  { type: 'gateway', labelKey: 'gateway', icon: <Shield size={20} />, color: '#8b5cf6' },
  { type: 'lb', labelKey: 'loadBalancer', icon: <Network size={20} />, color: '#3b82f6' },
  { type: 'app', labelKey: 'appServer', icon: <Server size={20} />, color: '#22c55e' },
  { type: 'cache', labelKey: 'cache', icon: <Zap size={20} />, color: '#a855f7' },
  { type: 'db-primary', labelKey: 'dbPrimary', icon: <Database size={20} />, color: '#f97316' },
  { type: 'db-replica', labelKey: 'dbReplica', icon: <Database size={20} />, color: '#fb923c' },
  { type: 'db', labelKey: 'database', icon: <Database size={20} />, color: '#f97316' },
];

const ComponentPalette: React.FC = () => {
  const { currentScenario } = useStore();
  const { t } = useI18n();

  const items = currentScenario
    ? allItems.filter((item) => currentScenario.allowedComponents.includes(item.type))
    : allItems.slice(0, 5);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const getLabel = (key: string): string => {
    const components = t.components as Record<string, string>;
    return components[key] || key;
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
            <span className="palette-label">{getLabel(item.labelKey)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentPalette;
