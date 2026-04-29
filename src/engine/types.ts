import type { Node, Edge } from 'reactflow';

export interface RuleContext {
  nodes: Node[];
  edges: Edge[];
  qps?: number;
}

export interface RuleResult {
  type: 'issue' | 'warning' | 'suggestion';
  message: string;
  nodeId?: string;
}

export interface Rule {
  name: string;
  run(ctx: RuleContext): RuleResult[];
}
