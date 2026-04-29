import ComponentPalette from './components/ComponentPalette';
import Canvas from './components/Canvas';
import AnalysisPanel from './components/AnalysisPanel';
import LanguageSwitcher from './components/LanguageSwitcher';
import './styles/layout.css';

function App() {
  return (
    <div className="app">
      <LanguageSwitcher />
      <ComponentPalette />
      <Canvas />
      <AnalysisPanel />
    </div>
  );
}

export default App;
