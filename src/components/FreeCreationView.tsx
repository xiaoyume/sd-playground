import React, { useEffect } from 'react';
import useStore from '../store/useStore';
import useI18n from '../i18n/useI18n';
import DesignCanvas from './DesignCanvas';
import DesignAnalysisPanel from './DesignAnalysisPanel';
import ComponentPalette from './ComponentPalette';

const FreeCreationView: React.FC = () => {
  const {
    designs,
    currentScenario,
    qps,
    hotKeyEnabled,
    setQps,
    setHotKeyEnabled,
    createDesign,
    resetDesign,
    setCurrentScenario,
  } = useStore();
  const { t } = useI18n();

  // Initialize single design on mount
  useEffect(() => {
    if (designs.length === 0) {
      createDesign('My Design');
    }
  }, []);

  // Don't render until design is ready
  if (designs.length === 0) {
    return <div>Loading...</div>;
  }

  const design = designs[0];

  const handleBackToScenarios = () => {
    setCurrentScenario(null);
  };

  return (
    <div className="free-creation-view">
      {/* Top Bar */}
      <div className="comparison-topbar">
        <button className="back-btn" onClick={handleBackToScenarios}>
          {t.comparison.back}
        </button>
        <div className="comparison-title">
          <span className="scenario-badge-small">{currentScenario?.name}</span>
          <span>{t.mode.freeCreate}</span>
        </div>
        <div className="comparison-controls">
          <label>{t.comparison.qps}</label>
          <input
            type="number"
            value={qps}
            onChange={(e) => setQps(Number(e.target.value))}
            min="0"
            step="100"
            className="qps-input-small"
          />
          <label className="hotkey-toggle">
            <input
              type="checkbox"
              checked={hotKeyEnabled}
              onChange={(e) => setHotKeyEnabled(e.target.checked)}
            />
            <span>🔥 Hot Key</span>
          </label>
          <button className="reset-btn-small" onClick={() => resetDesign(design.id)}>
            {t.comparison.reset}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="free-creation-content">
        <div className="design-panel-full">
          <div className="design-body">
            <DesignCanvas designId={design.id} />
            <DesignAnalysisPanel designId={design.id} />
          </div>
        </div>
      </div>

      {/* Component Palette */}
      <ComponentPalette />
    </div>
  );
};

export default FreeCreationView;
