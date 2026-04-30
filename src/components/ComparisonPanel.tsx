import React from 'react';
import useStore from '../store/useStore';
import type { Design } from '../store/useStore';

function evaluate(designA: Design, designB: Design): { winner: string | null; reason: string } {
  const rA = designA.analysisResult;
  const rB = designB.analysisResult;

  if (!rA || !rB) return { winner: null, reason: '' };

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
      reasons.push(`${designA.name} has lower DB load`);
    } else if (dbLoadB < dbLoadA) {
      scoreB++;
      reasons.push(`${designB.name} has lower DB load`);
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

  if (scoreA > scoreB) return { winner: designA.name, reason: reasons.join('; ') };
  if (scoreB > scoreA) return { winner: designB.name, reason: reasons.join('; ') };
  return { winner: null, reason: 'Both designs are comparable' };
}

const ComparisonPanel: React.FC = () => {
  const { designs } = useStore();

  if (designs.length < 2) return null;

  const designA = designs[0];
  const designB = designs[1];

  const resultA = designA.analysisResult;
  const resultB = designB.analysisResult;

  const hasResults = resultA && resultB;
  const verdict = hasResults ? evaluate(designA, designB) : null;

  return (
    <div className="comparison-panel">
      <h3>📊 Comparison</h3>

      {/* Verdict */}
      {verdict && (
        <div className="comparison-verdict">
          {verdict.winner ? (
            <div className="verdict-winner">
              <span className="verdict-icon">🏆</span>
              <span className="verdict-name">{verdict.winner}</span>
              <span className="verdict-label">is better</span>
            </div>
          ) : (
            <div className="verdict-tie">
              <span className="verdict-icon">🤝</span>
              <span className="verdict-label">Comparable</span>
            </div>
          )}
          <div className="verdict-reasons">{verdict.reason}</div>
        </div>
      )}

      {hasResults && (
        <>
          {/* Bottleneck Comparison */}
          <div className="comparison-section">
            <h4>🚨 Bottlenecks</h4>
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
              <h4>💾 DB Load</h4>
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
              <h4>⚡ Cache Effect</h4>
              <div className="comparison-row">
                <div className="comparison-cell">
                  <span className="comparison-design">{designA.name}</span>
                  <span>{Math.round(resultA.trafficBreakdown.cacheHitQps)} QPS saved</span>
                </div>
                <div className="comparison-cell">
                  <span className="comparison-design">{designB.name}</span>
                  <span>{Math.round(resultB.trafficBreakdown.cacheHitQps)} QPS saved</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!hasResults && (
        <div className="comparison-empty">
          <p>Run analysis on both designs to compare</p>
        </div>
      )}
    </div>
  );
};

export default ComparisonPanel;
