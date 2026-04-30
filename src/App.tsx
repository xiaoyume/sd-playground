import ModeSelector from './components/ModeSelector';
import ComparisonView from './components/ComparisonView';
import FreeCreationView from './components/FreeCreationView';
import useStore from './store/useStore';
import './styles/layout.css';

function App() {
  const { currentScenario, appMode } = useStore();

  if (!currentScenario) {
    return <ModeSelector />;
  }

  if (appMode === 'free') {
    return <FreeCreationView />;
  }

  return <ComparisonView />;
}

export default App;
