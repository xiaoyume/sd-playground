import React, { useEffect } from 'react';
import useStore from '../store/useStore';
import useI18n from '../i18n/useI18n';
import DesignCanvas from './DesignCanvas';
import DesignAnalysisPanel from './DesignAnalysisPanel';
import ComparisonPanel from './ComparisonPanel';
import ComponentPalette from './ComponentPalette';

const ComparisonView: React.FC = () => {
  const {
    designs,
    activeDesignId,
    currentScenario,
    qps,
    setQps,
    setActiveDesignId,
    createDesign,
    cloneDesign,
    resetDesign,
    setCurrentScenario,
  } = useStore();
  const { t } = useI18n();

  // Initialize two designs on mount
  useEffect(() => {
    if (designs.length === 0) {
      createDesign('Design A');
      createDesign('Design B');
    }
  }, []);

  // Set active design when designs are created
  useEffect(() => {
    if (!activeDesignId && designs.length > 0) {
      setActiveDesignId(designs[0].id);
    }
  }, [designs, activeDesignId]);

  // Don't render until designs are ready
  if (designs.length < 2) {
    return <div>Loading...</div>;
  }

  const handleBackToScenarios = () => {
    setCurrentScenario(null);
  };

  const handleCloneDesign = () => {
    if (designs.length >= 2) {
      cloneDesign(designs[0].id, designs[1].id);
    }
  };

  return (
    <div className="comparison-view">
      {/* Top Bar */}
      <div className="comparison-topbar">
        <button className="back-btn" onClick={handleBackToScenarios}>
          {t.comparison.back}
        </button>
        <div className="comparison-title">
          <span className="scenario-badge-small">{currentScenario?.name}</span>
          <span>{t.comparison.comparison}</span>
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
          <button className="clone-btn" onClick={handleCloneDesign}>
            {t.comparison.clone}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="comparison-content">
        {/* Left Panel - Design A */}
        {designs[0] && (
          <div className="design-panel">
            <div className="design-header">
              <h3>{designs[0].name}</h3>
              <button
                className="reset-btn"
                onClick={() => resetDesign(designs[0].id)}
              >
                {t.comparison.reset}
              </button>
            </div>
            <div className="design-body">
              <DesignCanvas designId={designs[0].id} />
              <DesignAnalysisPanel designId={designs[0].id} />
            </div>
          </div>
        )}

        {/* Center - Comparison */}
        <div className="comparison-center">
          <ComparisonPanel />
        </div>

        {/* Right Panel - Design B */}
        {designs[1] && (
          <div className="design-panel">
            <div className="design-header">
              <h3>{designs[1].name}</h3>
              <button
                className="reset-btn"
                onClick={() => resetDesign(designs[1].id)}
              >
                {t.comparison.reset}
              </button>
            </div>
            <div className="design-body">
              <DesignCanvas designId={designs[1].id} />
              <DesignAnalysisPanel designId={designs[1].id} />
            </div>
          </div>
        )}
      </div>

      {/* Component Palette */}
      <ComponentPalette />
    </div>
  );
};

export default ComparisonView;
