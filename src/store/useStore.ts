import { create } from 'zustand';
import type { Node, Edge } from 'reactflow';
import type { AnalysisResult } from '../logic/rules';
import type { Scenario } from '../scenarios/types';

export type AppMode = 'comparison' | 'free';

export interface Design {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  analysisResult: AnalysisResult | null;
  isSimulating: boolean;
  animationSpeed: number;
}

interface AppState {
  // Mode
  appMode: AppMode;

  // Scenario
  currentScenario: Scenario | null;
  qps: number;

  // Designs
  designs: Design[];
  activeDesignId: string | null;

  // Actions
  setAppMode: (mode: AppMode) => void;
  setCurrentScenario: (scenario: Scenario | null) => void;
  setQps: (qps: number) => void;
  setDesigns: (designs: Design[]) => void;
  setActiveDesignId: (id: string | null) => void;
  createDesign: (name: string) => void;
  updateDesignGraph: (id: string, nodes: Node[], edges: Edge[]) => void;
  updateDesignAnalysis: (id: string, result: AnalysisResult | null) => void;
  setDesignSimulating: (id: string, isSimulating: boolean) => void;
  setDesignAnimationSpeed: (id: string, speed: number) => void;
  switchDesign: (id: string) => void;
  cloneDesign: (sourceId: string, targetId: string) => void;
  resetDesign: (id: string) => void;

  // Computed helpers
  getActiveDesign: () => Design | null;
  getDesignById: (id: string) => Design | null;
}

const useStore = create<AppState>((set, get) => ({
  // Mode
  appMode: 'comparison',

  // Scenario
  currentScenario: null,
  qps: 1000,

  // Designs
  designs: [],
  activeDesignId: null,

  // Actions
  setAppMode: (mode) => set({ appMode: mode }),
  setCurrentScenario: (scenario) => set({ currentScenario: scenario }),
  setQps: (qps) => set({ qps }),

  setDesigns: (designs) => set({ designs }),
  setActiveDesignId: (id) => set({ activeDesignId: id }),

  createDesign: (name) => {
    const id = `design-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newDesign: Design = {
      id,
      name,
      nodes: [],
      edges: [],
      analysisResult: null,
      isSimulating: false,
      animationSpeed: 1,
    };
    set((state) => ({
      designs: [...state.designs, newDesign],
      activeDesignId: state.activeDesignId || id,
    }));
  },

  updateDesignGraph: (id, nodes, edges) => {
    set((state) => ({
      designs: state.designs.map((d) =>
        d.id === id ? { ...d, nodes, edges } : d
      ),
    }));
  },

  updateDesignAnalysis: (id, result) => {
    set((state) => ({
      designs: state.designs.map((d) =>
        d.id === id ? { ...d, analysisResult: result } : d
      ),
    }));
  },

  setDesignSimulating: (id, isSimulating) => {
    set((state) => ({
      designs: state.designs.map((d) =>
        d.id === id ? { ...d, isSimulating } : d
      ),
    }));
  },

  setDesignAnimationSpeed: (id, speed) => {
    set((state) => ({
      designs: state.designs.map((d) =>
        d.id === id ? { ...d, animationSpeed: speed } : d
      ),
    }));
  },

  switchDesign: (id) => {
    set({ activeDesignId: id });
  },

  cloneDesign: (sourceId, targetId) => {
    const { designs } = get();
    const source = designs.find((d) => d.id === sourceId);
    if (!source) return;

    set((state) => ({
      designs: state.designs.map((d) =>
        d.id === targetId
          ? { ...d, nodes: [...source.nodes], edges: [...source.edges], analysisResult: null, isSimulating: false }
          : d
      ),
    }));
  },

  resetDesign: (id) => {
    set((state) => ({
      designs: state.designs.map((d) =>
        d.id === id ? { ...d, nodes: [], edges: [], analysisResult: null, isSimulating: false } : d
      ),
    }));
  },

  // Computed helpers
  getActiveDesign: () => {
    const { designs, activeDesignId } = get();
    return designs.find((d) => d.id === activeDesignId) || null;
  },

  getDesignById: (id) => {
    const { designs } = get();
    return designs.find((d) => d.id === id) || null;
  },
}));

export default useStore;
