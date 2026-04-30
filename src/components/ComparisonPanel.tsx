import React, { useMemo } from 'react';
import useStore from '../store/useStore';
import useI18n from '../i18n/useI18n';
import type { Design } from '../store/useStore';
import { analyzeTradeoffs } from '../engine/tradeoff';

function evaluate(designA: Design, designB: Design): { winner: string | null; reasons: string[]; tradeoffsA: string[]; tradeoffsB: string[] } {
  const rA = designA.analysisResult;
  const rB = designB.analysisResult;

  if (!rA || !rB) return { winner: null, reasons: [], tradeoffsA: [], tradeoffsB: [] };

  let scoreA = 0;
  let scoreB = 0;
  const reasons: string[] = [];

  // Bottleneck comparison
  if (rA.bottlenecks.length < rB.bottlenecks.length) {
    scoreA++;
    reasons.push(`${designA.name} has fewer bottlenecks`);
  } else if (rB.bottlenecks.length < rA.bottlenecks.length) {
    scoreB++;
    reasons.push(`${designB.name} has fewer bottlenecks`);
  }

  // DB load comparison
  if (rA.trafficBreakdown && rB.trafficBreakdown) {
    const dbLoadA = rA.trafficBreakdown.dbReadQps + rA.trafficBreakdown.dbWriteQps;
    const dbLoadB = rB.trafficBreakdown.dbReadQps + rB.trafficBreakdown.dbWriteQps;

    if (dbLoadA < dbLoadB) {
      scoreA++;
      reasons.push(`${designA.name} has lower DB load (${Math.round(dbLoadA)} vs ${Math.round(dbLoadB)} QPS)`);
    } else if (dbLoadB < dbLoadA) {
      scoreB++;
      reasons.push(`${designB.name} has lower DB load (${Math.round(dbLoadB)} vs ${Math.round(dbLoadA)} QPS)`);
    }

    // Cache effect comparison
    if (rA.trafficBreakdown.cacheHitQps > rB.trafficBreakdown.cacheHitQps) {
      scoreA++;
      reasons.push(`${designA.name} has better cache utilization`);
    } else if (rB.trafficBreakdown.cacheHitQps > rA.trafficBreakdown.cacheHitQps) {
      scoreB++;
      reasons.push(`${designB.name} has better cache utilization`);
    }
  }

  // Latency comparison
  if (rA.latency && rB.latency) {
    if (rA.latency.totalLatency < rB.latency.totalLatency) {
      scoreA++;
      reasons.push(`${designA.name} has lower latency (${rA.latency.totalLatency}ms vs ${rB.latency.totalLatency}ms)`);
    } else if (rB.latency.totalLatency < rA.latency.totalLatency) {
      scoreB++;
      reasons.push(`${designB.name} has lower latency (${rB.latency.totalLatency}ms vs ${rA.latency.totalLatency}ms)`);
    }
  }

  // Node load comparison
  const overloadedA = rA.nodeLoadInfo.filter((n) => n.status === 'overloaded').length;
  const overloadedB = rB.nodeLoadInfo.filter((n) => n.status === 'overloaded').length;

  if (overloadedA < overloadedB) {
    scoreA++;
    reasons.push(`${designA.name} has fewer overloaded nodes`);
  } else if (overloadedB < overloadedA) {
    scoreB++;
    reasons.push(`${designB.name} has fewer overloaded nodes`);
  }

  // Get trade-offs
  const tradeoffA = analyzeTradeoffs(designA.nodes, rA);
  const tradeoffB = analyzeTradeoffs(designB.nodes, rB);

  const tradeoffsA = tradeoffA.tradeoffs.filter((t) => t.type === 'con').map((t) => t.text);
  const tradeoffsB = tradeoffB.tradeoffs.filter((t) => t.type === 'con').map((t) => t.text);

  if (scoreA > scoreB) return { winner: designA.name, reasons, tradeoffsA, tradeoffsB };
  if (scoreB > scoreA) return { winner: designB.name, reasons, tradeoffsA, tradeoffsB };
  return { winner: null, reasons: ['Both designs are comparable'], tradeoffsA, tradeoffsB };
}

const ComparisonPanel: React.FC = () => {
  const { designs } = useStore();
  const { t } = useI18n();

  if (designs.length < 2) return null;

  const designA = designs[0];
  const designB = designs[1];

  const resultA = designA.analysisResult;
  const resultB = designB.analysisResult;

  const hasResults = resultA && resultB;
  const verdict = useMemo(() => hasResults ? evaluate(designA, designB) : null, [designA, designB, hasResults]);

  return (
    <div className="comparison-panel">
      <h3>{t.comparison.title}</h3>

      {/* Verdict */}
      {verdict && (
        <div className="comparison-verdict">
          {verdict.winner ? (
            <div className="verdict-winner">
              <span className="verdict-icon">🏆</span>
              <span className="verdict-name">{verdict.winner}</span>
              <span className="verdict-label">{t.comparison.better}</span>
            </div>
          ) : (
            <div className="verdict-tie">
              <span className="verdict-icon">🤝</span>
              <span className="verdict-label">{t.comparison.comparable}</span>
            </div>
          )}

          {/* Reasons */}
          <div className="verdict-reasons">
            <h5>{t.comparison.because}</h5>
            <ul>
              {verdict.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Trade-offs */}
          <div className="verdict-tradeoffs">
            <h5>{t.comparison.however}</h5>
            {verdict.tradeoffsA.length > 0 && (
              <div className="tradeoff-list">
                <span className="tradeoff-design">{designA.name}:</span>
                {verdict.tradeoffsA.map((item, i) => (
                  <span key={i} className="tradeoff-con">⚠️ {item}</span>
                ))}
              </div>
            )}
            {verdict.tradeoffsB.length > 0 && (
              <div className="tradeoff-list">
                <span className="tradeoff-design">{designB.name}:</span>
                {verdict.tradeoffsB.map((item, i) => (
                  <span key={i} className="tradeoff-con">⚠️ {item}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {hasResults && (
        <>
          {/* Latency Comparison */}
          {resultA.latency && resultB.latency && (
            <div className="comparison-section">
              <h4>{t.analysis.latency}</h4>
              <div className="comparison-row">
                <div className={`comparison-cell ${resultA.latency.totalLatency <= resultB.latency.totalLatency ? 'good' : ''}`}>
                  <span className="comparison-design">{designA.name}</span>
                  <span className="latency-main">{resultA.latency.totalLatency} ms</span>
                  <span className="latency-detail">R: {resultA.latency.readLatency}ms / W: {resultA.latency.writeLatency}ms</span>
                </div>
                <div className={`comparison-cell ${resultB.latency.totalLatency <= resultA.latency.totalLatency ? 'good' : ''}`}>
                  <span className="comparison-design">{designB.name}</span>
                  <span className="latency-main">{resultB.latency.totalLatency} ms</span>
                  <span className="latency-detail">R: {resultB.latency.readLatency}ms / W: {resultB.latency.writeLatency}ms</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottleneck Comparison */}
          <div className="comparison-section">
            <h4>{t.analysis.bottlenecks}</h4>
            <div className="comparison-row">
              <div className={`comparison-cell ${resultA.bottlenecks.length === 0 ? 'good' : 'bad'}`}>
                <span className="comparison-design">{designA.name}</span>
                <span>{resultA.bottlenecks.length === 0 ? '✅ None' : `❌ ${resultA.bottlenecks.length}`}</span>
              </div>
              <div className={`comparison-cell ${resultB.bottlenecks.length === 0 ? 'good' : 'bad'}`}>
                <span className="comparison-design">{designB.name}</span>
                <span>{resultB.bottlenecks.length === 0 ? '✅ None' : `❌ ${resultB.bottlenecks.length}`}</span>
              </div>
            </div>
          </div>

          {/* DB Load Comparison */}
          {resultA.trafficBreakdown && resultB.trafficBreakdown && (
            <div className="comparison-section">
              <h4>{t.comparison.dbLoad}</h4>
              <div className="comparison-row">
                <div className="comparison-cell">
                  <span className="comparison-design">{designA.name}</span>
                  <span>{Math.round(resultA.trafficBreakdown.dbReadQps + resultA.trafficBreakdown.dbWriteQps)} QPS</span>
                </div>
                <div className="comparison-cell">
                  <span className="comparison-design">{designB.name}</span>
                  <span>{Math.round(resultB.trafficBreakdown.dbReadQps + resultB.trafficBreakdown.dbWriteQps)} QPS</span>
                </div>
              </div>
            </div>
          )}

          {/* Cache Effect Comparison */}
          {resultA.trafficBreakdown && resultB.trafficBreakdown && (
            <div className="comparison-section">
              <h4>{t.comparison.cacheEffect}</h4>
              <div className="comparison-row">
                <div className="comparison-cell">
                  <span className="comparison-design">{designA.name}</span>
                  <span>{Math.round(resultA.trafficBreakdown.cacheHitQps)} {t.comparison.qpsSaved}</span>
                </div>
                <div className="comparison-cell">
                  <span className="comparison-design">{designB.name}</span>
                  <span>{Math.round(resultB.trafficBreakdown.cacheHitQps)} {t.comparison.qpsSaved}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!hasResults && (
        <div className="comparison-empty">
          <p>{t.comparison.runAnalysis}</p>
        </div>
      )}
    </div>
  );
};

export default ComparisonPanel;
