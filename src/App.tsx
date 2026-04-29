import ComponentPalette from './components/ComponentPalette';
import Canvas from './components/Canvas';
import AnalysisPanel from './components/AnalysisPanel';
import './styles/layout.css';

function App() {
  return (
    <div className="app">
      <ComponentPalette />
      <Canvas />
      <AnalysisPanel />
    </div>
  );
}

export default App;
