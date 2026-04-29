import React from 'react';
import useStore from '../store/useStore';
import { analyze } from '../logic/rules';
import type { Node, Edge } from 'reactflow';

const AnalysisPanel: React.FC = () => {
  const { nodes, edges, analysisResult, setAnalysisResult, setNodes, setEdges } = useStore();

  const handleAnalyze = () => {
    const result = analyze(nodes, edges);
    setAnalysisResult(result);
  };

  const handleLoadReference = () => {
    const referenceNodes: Node[] = [
      { id: 'lb-1', type: 'default', position: { x: 100, y: 100 }, data: { label: 'LB' } },
      { id: 'app-1', type: 'default', position: { x: 300, y: 100 }, data: { label: 'APP' } },
      { id: 'cache-1', type: 'default', position: { x: 500, y: 100 }, data: { label: 'CACHE' } },
      { id: 'db-1', type: 'default', position: { x: 700, y: 100 }, data: { label: 'DB' } },
    ];

    const referenceEdges: Edge[] = [
      { id: 'e-lb-app', source: 'lb-1', target: 'app-1' },
      { id: 'e-app-cache', source: 'app-1', target: 'cache-1' },
      { id: 'e-cache-db', source: 'cache-1', target: 'db-1' },
    ];

    setNodes(referenceNodes);
    setEdges(referenceEdges);
    setAnalysisResult(null);
  };

  return (
    <div className="analysis-panel">
      <h3>Analysis</h3>
      <button className="analyze-btn" onClick={handleAnalyze}>
        Analyze
      </button>
      <button className="reference-btn" onClick={handleLoadReference}>
        Load Reference
      </button>

      {analysisResult && (
        <div className="analysis-results">
          {analysisResult.issues.length > 0 && (
            <div className="issues-section">
              <h4>Issues</h4>
              <ul>
                {analysisResult.issues.map((issue, index) => (
                  <li key={index} className="issue-item">
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.suggestions.length > 0 && (
            <div className="suggestions-section">
              <h4>Suggestions</h4>
              <ul>
                {analysisResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="suggestion-item">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.issues.length === 0 && analysisResult.suggestions.length === 0 && (
            <div className="no-issues">
              <p>No issues found! Your architecture looks good.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
