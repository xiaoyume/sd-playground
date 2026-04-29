import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';
import type { AnalysisResult } from '../logic/rules';
import type { Scenario } from '../scenarios/types';

interface AppState {
  nodes: Node[];
  edges: Edge[];
  analysisResult: AnalysisResult | null;
  currentScenario: Scenario | null;
  isSimulating: boolean;
  animationSpeed: number;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setCurrentScenario: (scenario: Scenario | null) => void;
  setIsSimulating: (isSimulating: boolean) => void;
  setAnimationSpeed: (speed: number) => void;
}

const useStore = create<AppState>((set) => ({
  nodes: [],
  edges: [],
  analysisResult: null,
  currentScenario: null,
  isSimulating: false,
  animationSpeed: 1,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setCurrentScenario: (scenario) => set({ currentScenario: scenario }),
  setIsSimulating: (isSimulating) => set({ isSimulating }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
}));

export default useStore;
