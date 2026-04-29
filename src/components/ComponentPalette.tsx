import React from 'react';

interface PaletteItem {
  type: string;
  label: string;
  icon: string;
}

const items: PaletteItem[] = [
  { type: 'lb', label: 'Load Balancer', icon: '⚖️' },
  { type: 'app', label: 'App Server', icon: '🖥️' },
  { type: 'db', label: 'Database', icon: '🗄️' },
  { type: 'cache', label: 'Cache', icon: '⚡' },
];

const ComponentPalette: React.FC = () => {
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
