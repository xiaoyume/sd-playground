import ScenarioSelector from './components/ScenarioSelector';
import ComparisonView from './components/ComparisonView';
import useStore from './store/useStore';
import './styles/layout.css';

function App() {
  const { currentScenario } = useStore();

  if (!currentScenario) {
    return <ScenarioSelector />;
  }

  return <ComparisonView />;
}

export default App;
