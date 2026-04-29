import ComponentPalette from './components/ComponentPalette';
import Canvas from './components/Canvas';
import AnalysisPanel from './components/AnalysisPanel';
import LanguageSwitcher from './components/LanguageSwitcher';
import ScenarioSelector from './components/ScenarioSelector';
import ScenarioInfoPanel from './components/ScenarioInfoPanel';
import useStore from './store/useStore';
import './styles/layout.css';

function App() {
  const { currentScenario } = useStore();

  if (!currentScenario) {
    return <ScenarioSelector />;
  }

  return (
    <div className="app">
      <LanguageSwitcher />
      <ComponentPalette />
      <div className="main-content">
        <ScenarioInfoPanel />
        <Canvas />
      </div>
      <AnalysisPanel />
    </div>
  );
}

export default App;
