import React from 'react';
import ModeSelector from './components/ModeSelector';
import ComparisonView from './components/ComparisonView';
import FreeCreationView from './components/FreeCreationView';
import LearnHome from './learn/pages/LearnHome';
import TopicPage from './learn/pages/TopicPage';
import useStore from './store/useStore';
import './styles/layout.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: 'red', fontFamily: 'monospace' }}>
          <h2>Runtime Error</h2>
          <pre>{this.state.error.message}</pre>
          <pre>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const { appView, currentScenario, appMode, learnTopicId } = useStore();

  return (
    <ErrorBoundary>
      {appView === 'learn' ? (
        learnTopicId ? <TopicPage /> : <LearnHome />
      ) : !currentScenario ? (
        <ModeSelector />
      ) : appMode === 'free' ? (
        <FreeCreationView />
      ) : (
        <ComparisonView />
      )}
    </ErrorBoundary>
  );
}

export default App;
