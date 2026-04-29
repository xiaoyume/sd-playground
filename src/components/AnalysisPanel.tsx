import React, { useState, useCallback } from 'react';
import useStore from '../store/useStore';
import { analyze } from '../logic/rules';
import useI18n from '../i18n/useI18n';
import type { Node, Edge } from 'reactflow';

const AnalysisPanel: React.FC = () => {
  const {
    nodes,
    edges,
    analysisResult,
    setAnalysisResult,
    currentScenario,
    setCurrentScenario,
    setNodes,
    setEdges,
    isSimulating,
    setIsSimulating,
    setAnimationSpeed,
  } = useStore();
  const { t } = useI18n();
  const [qps, setQps] = useState<number>(1000);

  const getAnimationSpeed = useCallback((qps: number): number => {
    if (qps <= 100) return 0.5;
    if (qps <= 1000) return 1;
    if (qps <= 5000) return 2;
    return 3;
  }, []);

  const handleAnalyze = () => {
    const scenarioRules = currentScenario?.rules;
    const result = analyze(nodes, edges, undefined, scenarioRules);
    setAnalysisResult(result);
  };

  const handleSimulate = () => {
    const scenarioRules = currentScenario?.rules;
    const result = analyze(nodes, edges, qps, scenarioRules);
    setAnalysisResult(result);
    setAnimationSpeed(getAnimationSpeed(qps));
    setIsSimulating(true);
  };

  const handleStop = () => {
    setIsSimulating(false);
  };

  const handleLoadReference = () => {
    const referenceNodes: Node[] = [
      { id: 'lb-1', type: 'custom', position: { x: 200, y: 50 }, data: { label: 'LB', onDelete: () => {} } },
      { id: 'app-1', type: 'custom', position: { x: 200, y: 150 }, data: { label: 'APP', onDelete: () => {} } },
      { id: 'cache-1', type: 'custom', position: { x: 200, y: 250 }, data: { label: 'CACHE', onDelete: () => {} } },
      { id: 'db-1', type: 'custom', position: { x: 200, y: 350 }, data: { label: 'DB', onDelete: () => {} } },
    ];

    const referenceEdges: Edge[] = [
      { id: 'e-lb-app', source: 'lb-1', target: 'app-1' },
      { id: 'e-app-cache', source: 'app-1', target: 'cache-1' },
      { id: 'e-cache-db', source: 'cache-1', target: 'db-1' },
    ];

    setNodes(referenceNodes);
    setEdges(referenceEdges);
    setAnalysisResult(null);
    setIsSimulating(false);
  };

  const handleBackToScenarios = () => {
    setCurrentScenario(null);
    setNodes([]);
    setEdges([]);
    setAnalysisResult(null);
    setIsSimulating(false);
  };

  return (
    <div className="analysis-panel">
      <div className="analysis-panel-header">
        <h3>{t.analysis.title}</h3>
        {currentScenario && (
          <button className="back-btn" onClick={handleBackToScenarios}>
            ← Back
          </button>
        )}
      </div>

      {currentScenario && (
        <div className="scenario-badge">
          <span className="scenario-name">{currentScenario.name}</span>
        </div>
      )}

      <div className="qps-input">
        <label htmlFor="qps">{t.analysis.trafficLabel}</label>
        <input
          id="qps"
          type="number"
          value={qps}
          onChange={(e) => setQps(Number(e.target.value))}
          min="0"
          step="100"
        />
      </div>

      <button className="analyze-btn" onClick={handleAnalyze}>
        {t.analysis.analyze}
      </button>
      <button className="reference-btn" onClick={handleLoadReference}>
        {t.analysis.loadReference}
      </button>

      <div className="simulation-controls">
        {!isSimulating ? (
          <button className="simulate-btn" onClick={handleSimulate}>
            ▶ Simulate Traffic
          </button>
        ) : (
          <button className="stop-btn" onClick={handleStop}>
            ⏹ Stop
          </button>
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
          {analysisResult.issues.length > 0 && (
            <div className="issues-section">
              <h4>{t.analysis.issues}</h4>
              <ul>
                {analysisResult.issues.map((issue, index) => (
                  <li key={index} className="issue-item">
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.bottlenecks.length > 0 && (
            <div className="bottlenecks-section">
              <h4>{t.analysis.bottlenecks}</h4>
              <ul>
                {analysisResult.bottlenecks.map((bottleneck, index) => (
                  <li key={index} className="bottleneck-item">
                    {bottleneck}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.loadBreakdown.appLoad > 0 && (
            <div className="load-breakdown-section">
              <h4>{t.analysis.loadBreakdown}</h4>
              <div className="load-item">
                <span>{t.analysis.appLoad}</span>
                <span>{Math.round(analysisResult.loadBreakdown.appLoad)} QPS</span>
              </div>
              <div className="load-item">
                <span>{t.analysis.dbLoad}</span>
                <span>{Math.round(analysisResult.loadBreakdown.dbLoad)} QPS</span>
              </div>
              {analysisResult.loadBreakdown.cacheSaved > 0 && (
                <div className="load-item cache-saved">
                  <span>{t.analysis.cacheSaved}</span>
                  <span>{Math.round(analysisResult.loadBreakdown.cacheSaved)} QPS</span>
                </div>
              )}
            </div>
          )}

          {analysisResult.nodeLoadInfo.length > 0 && (
            <div className="node-status-section">
              <h4>{t.analysis.nodeStatus}</h4>
              <ul>
                {analysisResult.nodeLoadInfo.map((node) => (
                  <li key={node.nodeId} className={`node-status-${node.status}`}>
                    <span className="node-label">{node.label}</span>
                    <span className="node-load">
                      {Math.round(node.loadPercentage)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.suggestions.length > 0 && (
            <div className="suggestions-section">
              <h4>{t.analysis.suggestions}</h4>
              <ul>
                {analysisResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="suggestion-item">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.issues.length === 0 &&
            analysisResult.bottlenecks.length === 0 &&
            analysisResult.suggestions.length === 0 && (
              <div className="no-issues">
                <p>{t.analysis.noIssues}</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
