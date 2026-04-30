import React, { useCallback, useMemo } from 'react';
import useStore from '../store/useStore';
import useI18n from '../i18n/useI18n';
import { analyze } from '../logic/rules';
import { analyzeTradeoffs } from '../engine/tradeoff';
import { explainDesign } from '../engine/explain';

interface DesignAnalysisPanelProps {
  designId: string;
}

const DesignAnalysisPanel: React.FC<DesignAnalysisPanelProps> = ({ designId }) => {
  const {
    currentScenario,
    qps,
    hotKeyEnabled,
    getDesignById,
    updateDesignAnalysis,
    setDesignSimulating,
    setDesignAnimationSpeed,
  } = useStore();
  const { t } = useI18n();

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
    const result = analyze(design.nodes, design.edges, undefined, scenarioRules, hotKeyEnabled);
    updateDesignAnalysis(designId, result);
  }, [design, designId, currentScenario, hotKeyEnabled, updateDesignAnalysis]);

  const handleSimulate = useCallback(() => {
    if (!design) return;
    const scenarioRules = currentScenario?.rules;
    const result = analyze(design.nodes, design.edges, qps, scenarioRules, hotKeyEnabled);
    updateDesignAnalysis(designId, result);
    setDesignAnimationSpeed(designId, getAnimationSpeed(qps));
    setDesignSimulating(designId, true);
  }, [design, designId, currentScenario, qps, hotKeyEnabled, updateDesignAnalysis, setDesignSimulating, setDesignAnimationSpeed, getAnimationSpeed]);

  const handleStop = useCallback(() => {
    setDesignSimulating(designId, false);
  }, [designId, setDesignSimulating]);

  const tradeoffResult = useMemo(() => {
    if (!design) return null;
    return analyzeTradeoffs(design.nodes, design.analysisResult);
  }, [design]);

  const explainResult = useMemo(() => {
    if (!design || !design.analysisResult) return null;
    return explainDesign(design.nodes, design.analysisResult, design.analysisResult.latency);
  }, [design]);

  if (!design) return null;

  const { analysisResult, isSimulating } = design;

  return (
    <div className="design-analysis-panel">
      <div className="design-analysis-actions">
        <button className="analyze-btn" onClick={handleAnalyze}>{t.analysis.analyze}</button>
        {!isSimulating ? (
          <button className="simulate-btn" onClick={handleSimulate}>▶ {t.analysis.simulate}</button>
        ) : (
          <button className="stop-btn" onClick={handleStop}>⏹ {t.analysis.stop}</button>
        )}
      </div>

      {isSimulating && (
        <div className="simulation-status">
          <div className="status-indicator"></div>
          <span>{t.analysis.simulate} {qps} QPS</span>
        </div>
      )}

      {analysisResult && (
        <div className="analysis-results">
          {/* Hot Key Status */}
          {hotKeyEnabled && (
            <div className="hotkey-section">
              <h4>🔥 Hot Key</h4>
              <div className="hotkey-status">
                <span className="hotkey-badge enabled">Enabled</span>
                {analysisResult.trafficBreakdown && (
                  <span className="hotkey-traffic">{Math.round(analysisResult.trafficBreakdown.hotQps)} QPS</span>
                )}
              </div>
            </div>
          )}

          {/* Latency */}
          {analysisResult.latency && (
            <div className="latency-section">
              <h4>{t.analysis.latency}</h4>
              <div className="latency-item">
                <span>{t.analysis.totalLatency}</span>
                <span className="latency-value">{analysisResult.latency.totalLatency} ms</span>
              </div>
              <div className="latency-item">
                <span>{t.analysis.readLatency}</span>
                <span>{analysisResult.latency.readLatency} ms</span>
              </div>
              <div className="latency-item">
                <span>{t.analysis.writeLatency}</span>
                <span>{analysisResult.latency.writeLatency} ms</span>
              </div>
              {analysisResult.latency.pathLatencies.length > 0 && (
                <div className="latency-paths">
                  {analysisResult.latency.pathLatencies.map((path, i) => (
                    <div key={i} className="latency-path">
                      <span className="path-name">{path.path}</span>
                      <span className="path-latency">{path.latency} ms</span>
                      <span className="path-desc">{path.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {analysisResult.trafficBreakdown && (
            <div className="traffic-breakdown-section">
              <h4>📊 {t.analysis.trafficLabel}</h4>
              <div className="traffic-item">
                <span>Total</span>
                <span>{Math.round(analysisResult.trafficBreakdown.totalQps)}</span>
              </div>
              <div className="traffic-item">
                <span>Read</span>
                <span>{Math.round(analysisResult.trafficBreakdown.readQps)}</span>
              </div>
              <div className="traffic-item">
                <span>Write</span>
                <span>{Math.round(analysisResult.trafficBreakdown.writeQps)}</span>
              </div>
              {hotKeyEnabled && (
                <div className="traffic-item highlight">
                  <span>Hot Key</span>
                  <span>{Math.round(analysisResult.trafficBreakdown.hotQps)}</span>
                </div>
              )}
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

          {/* Request Flow */}
          <div className="flow-section">
            <h4>📍 Request Flow</h4>
            <div className="flow-path">
              <span className="flow-label">READ:</span>
              <span className="flow-route">gateway → lb → redirect → cache → db</span>
            </div>
            <div className="flow-path">
              <span className="flow-label">WRITE:</span>
              <span className="flow-route">gateway → lb → write → id-gen → db</span>
            </div>
          </div>

          {analysisResult.bottlenecks.length > 0 && (
            <div className="bottlenecks-section">
              <h4>{t.analysis.bottlenecks}</h4>
              <ul>
                {analysisResult.bottlenecks.map((b, i) => (
                  <li key={i} className="bottleneck-item">{b}</li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.nodeLoadInfo.length > 0 && (
            <div className="node-status-section">
              <h4>{t.analysis.nodeStatus}</h4>
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

          {/* Trade-offs */}
          {tradeoffResult && tradeoffResult.tradeoffs.length > 0 && (
            <div className="tradeoff-section">
              <h4>{t.analysis.tradeoffs}</h4>
              <div className="tradeoff-list">
                {tradeoffResult.tradeoffs.map((item, i) => (
                  <div key={i} className={`tradeoff-item ${item.type}`}>
                    <span className="tradeoff-icon">{item.type === 'pro' ? '✅' : '⚠️'}</span>
                    <span className="tradeoff-text">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanations */}
          {explainResult && (
            <div className="explanation-section">
              <h4>{t.analysis.whyThisDesign}</h4>
              <div className="explanation-summary">{explainResult.designSummary}</div>
              {explainResult.metricExplanations.length > 0 && (
                <div className="metric-explanations">
                  {explainResult.metricExplanations.map((m, i) => (
                    <div key={i} className="metric-explanation">
                      <div className="metric-header">
                        <span className="metric-name">{m.metric}</span>
                        <span className="metric-value">{m.value}</span>
                      </div>
                      <div className="metric-desc">{m.explanation}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {analysisResult.suggestions.length > 0 && (
            <div className="suggestions-section">
              <h4>{t.analysis.suggestions}</h4>
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
