import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';
import type { AnalysisResult } from '../logic/rules';

interface AppState {
  nodes: Node[];
  edges: Edge[];
  analysisResult: AnalysisResult | null;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
}

const useStore = create<AppState>((set) => ({
  nodes: [],
  edges: [],
  analysisResult: null,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
}));

export default useStore;
