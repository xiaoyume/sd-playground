import React from 'react';
import { getScenarios } from '../scenarios/registry';
import useStore from '../store/useStore';
import useI18n from '../i18n/useI18n';
import type { Scenario } from '../scenarios/types';
import type { AppMode } from '../store/useStore';
import { GitCompare, Pencil } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const ModeSelector: React.FC = () => {
  const { setCurrentScenario, setAppMode } = useStore();
  const { t } = useI18n();
  const scenarios = getScenarios();

  const handleSelectScenario = (scenario: Scenario, mode: AppMode) => {
    setAppMode(mode);
    setCurrentScenario(scenario);
  };

  return (
    <div className="mode-selector">
      <LanguageSwitcher />
      <div className="mode-selector-header">
        <h1>{t.mode.title}</h1>
        <p>{t.mode.subtitle}</p>
      </div>
      <div className="scenario-list">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="scenario-card-enhanced">
            <div className="scenario-info">
              <h3>{scenario.name}</h3>
              <p>{scenario.description}</p>
              <div className="scenario-requirements">
                {scenario.requirements.map((req, index) => (
                  <span key={index} className="requirement-tag">{req}</span>
                ))}
              </div>
            </div>
            <div className="scenario-modes">
              <button
                className="mode-btn mode-comparison"
                onClick={() => handleSelectScenario(scenario, 'comparison')}
              >
                <GitCompare size={16} />
                <span>{t.mode.comparison}</span>
                <span className="mode-desc">{t.mode.comparisonDesc}</span>
              </button>
              <button
                className="mode-btn mode-free"
                onClick={() => handleSelectScenario(scenario, 'free')}
              >
                <Pencil size={16} />
                <span>{t.mode.freeCreate}</span>
                <span className="mode-desc">{t.mode.freeCreateDesc}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModeSelector;
