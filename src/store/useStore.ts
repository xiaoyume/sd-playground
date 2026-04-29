import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';
import type { AnalysisResult } from '../logic/rules';
import type { Scenario } from '../scenarios/types';

interface AppState {
  nodes: Node[];
  edges: Edge[];
  analysisResult: AnalysisResult | null;
  currentScenario: Scenario | null;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setCurrentScenario: (scenario: Scenario | null) => void;
}

const useStore = create<AppState>((set) => ({
  nodes: [],
  edges: [],
  analysisResult: null,
  currentScenario: null,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setCurrentScenario: (scenario) => set({ currentScenario: scenario }),
}));

export default useStore;
