import React from 'react';
import useStore from '../store/useStore';

const ScenarioInfoPanel: React.FC = () => {
  const { currentScenario } = useStore();

  if (!currentScenario) {
    return null;
  }

  return (
    <div className="scenario-info-panel">
      <h3>{currentScenario.name}</h3>
      <p className="scenario-description">{currentScenario.description}</p>
      <div className="scenario-requirements-section">
        <h4>Requirements</h4>
        <ul>
          {currentScenario.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScenarioInfoPanel;
