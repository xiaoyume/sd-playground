import React from 'react';
import { LoadBalancerIcon, AppServerIcon, DatabaseIcon, CacheIcon } from './icons';
import useI18n from '../i18n/useI18n';

interface PaletteItem {
  type: string;
  labelKey: 'loadBalancer' | 'appServer' | 'database' | 'cache';
  icon: React.ReactNode;
}

const items: PaletteItem[] = [
  { type: 'lb', labelKey: 'loadBalancer', icon: <LoadBalancerIcon /> },
  { type: 'app', labelKey: 'appServer', icon: <AppServerIcon /> },
  { type: 'db', labelKey: 'database', icon: <DatabaseIcon /> },
  { type: 'cache', labelKey: 'cache', icon: <CacheIcon /> },
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
