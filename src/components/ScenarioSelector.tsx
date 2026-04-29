import React from 'react';
import { getScenarios } from '../scenarios/registry';
import useStore from '../store/useStore';
import type { Scenario } from '../scenarios/types';

const ScenarioSelector: React.FC = () => {
  const { setCurrentScenario, setNodes, setEdges, setAnalysisResult } = useStore();
  const scenarios = getScenarios();

  const handleSelectScenario = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    if (scenario.initialGraph) {
      setNodes(scenario.initialGraph.nodes);
      setEdges(scenario.initialGraph.edges);
    } else {
      setNodes([]);
      setEdges([]);
    }
    setAnalysisResult(null);
  };

  return (
    <div className="scenario-selector">
      <div className="scenario-selector-header">
        <h1>System Design Playground</h1>
        <p>Select a scenario to practice system design</p>
      </div>
      <div className="scenario-list">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="scenario-card"
            onClick={() => handleSelectScenario(scenario)}
          >
            <h3>{scenario.name}</h3>
            <p>{scenario.description}</p>
            <div className="scenario-requirements">
              {scenario.requirements.map((req, index) => (
                <span key={index} className="requirement-tag">{req}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScenarioSelector;
