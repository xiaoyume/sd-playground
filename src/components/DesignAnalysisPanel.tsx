import React, { useCallback } from 'react';
import useStore from '../store/useStore';
import { analyze } from '../logic/rules';

interface DesignAnalysisPanelProps {
  designId: string;
}

const DesignAnalysisPanel: React.FC<DesignAnalysisPanelProps> = ({ designId }) => {
  const {
    currentScenario,
    qps,
    getDesignById,
    updateDesignAnalysis,
    setDesignSimulating,
    setDesignAnimationSpeed,
  } = useStore();

  const design = getDesignById(designId);

  const getAnimationSpeed = useCallback((qps: number): number => {
    if (qps <= 100) return 0.5;
    if (qps <= 1000) return 1;
    if (qps <= 5000) return 2;
    return 3;
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!design) return;
    const scenarioRules = currentScenario?.rules;
    const result = analyze(design.nodes, design.edges, undefined, scenarioRules);
    updateDesignAnalysis(designId, result);
  }, [design, designId, currentScenario, updateDesignAnalysis]);

  const handleSimulate = useCallback(() => {
    if (!design) return;
    const scenarioRules = currentScenario?.rules;
    const result = analyze(design.nodes, design.edges, qps, scenarioRules);
    updateDesignAnalysis(designId, result);
    setDesignAnimationSpeed(designId, getAnimationSpeed(qps));
    setDesignSimulating(designId, true);
  }, [design, designId, currentScenario, qps, updateDesignAnalysis, setDesignSimulating, setDesignAnimationSpeed, getAnimationSpeed]);

  const handleStop = useCallback(() => {
    setDesignSimulating(designId, false);
  }, [designId, setDesignSimulating]);

  if (!design) return null;

  const { analysisResult, isSimulating } = design;

  return (
    <div className="design-analysis-panel">
      <div className="design-analysis-actions">
        <button className="analyze-btn" onClick={handleAnalyze}>Analyze</button>
        {!isSimulating ? (
          <button className="simulate-btn" onClick={handleSimulate}>▶ Simulate</button>
        ) : (
          <button className="stop-btn" onClick={handleStop}>⏹ Stop</button>
        )}
      </div>

      {isSimulating && (
        <div className="simulation-status">
          <div className="status-indicator"></div>
          <span>Simulating {qps} QPS</span>
        </div>
      )}

      {analysisResult && (
        <div className="analysis-results">
          {analysisResult.trafficBreakdown && (
            <div className="traffic-breakdown-section">
              <h4>📊 Traffic</h4>
              <div className="traffic-item">
                <span>Total</span>
                <span>{Math.round(analysisResult.trafficBreakdown.totalQps)}</span>
              </div>
              <div className="traffic-item highlight">
                <span>Cache Hit</span>
                <span>{Math.round(analysisResult.trafficBreakdown.cacheHitQps)}</span>
              </div>
              <div className="traffic-item">
                <span>DB Load</span>
                <span>{Math.round(analysisResult.trafficBreakdown.dbReadQps + analysisResult.trafficBreakdown.dbWriteQps)}</span>
              </div>
            </div>
          )}

          {analysisResult.bottlenecks.length > 0 && (
            <div className="bottlenecks-section">
              <h4>🚨 Bottlenecks</h4>
              <ul>
                {analysisResult.bottlenecks.map((b, i) => (
                  <li key={i} className="bottleneck-item">{b}</li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.nodeLoadInfo.length > 0 && (
            <div className="node-status-section">
              <h4>Nodes</h4>
              <ul>
                {analysisResult.nodeLoadInfo.map((node) => (
                  <li key={node.nodeId} className={`node-status-${node.status}`}>
                    <span className="node-label">{node.label}</span>
                    <span className="node-load">{Math.round(node.loadPercentage)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.suggestions.length > 0 && (
            <div className="suggestions-section">
              <h4>💡 Tips</h4>
              <ul>
                {analysisResult.suggestions.map((s, i) => (
                  <li key={i} className="suggestion-item">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DesignAnalysisPanel;
