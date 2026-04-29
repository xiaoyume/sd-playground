import type { Node, Edge } from 'reactflow';
import type { Rule } from '../engine/types';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  allowedComponents: string[];
  rules: Rule[];
  initialGraph?: {
    nodes: Node[];
    edges: Edge[];
  };
}
