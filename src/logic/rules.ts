import type { Node, Edge } from 'reactflow';
import { getNodeCapacity, getLoadPercentage, getLoadStatus } from './capacity';
import { calculateNodeLoad, calculateEffectiveDBLoad } from './traffic';
import { runRules } from '../engine/ruleEngine';
import type { RuleResult } from '../engine/types';

export interface NodeLoadInfo {
  nodeId: string;
  nodeType: string;
  label: string;
  currentQps: number;
  maxQps: number;
  loadPercentage: number;
  status: 'normal' | 'warning' | 'overloaded';
}

export interface AnalysisResult {
  issues: string[];
  suggestions: string[];
  bottlenecks: string[];
  loadBreakdown: {
    appLoad: number;
    dbLoad: number;
    cacheSaved: number;
  };
  nodeLoadInfo: NodeLoadInfo[];
}

function mapRuleResultsToAnalysis(ruleResults: RuleResult[]): {
  issues: string[];
  suggestions: string[];
  bottlenecks: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  const bottlenecks: string[] = [];

  for (const result of ruleResults) {
    switch (result.type) {
      case 'issue':
        bottlenecks.push(result.message);
        break;
      case 'warning':
        suggestions.push(result.message);
        break;
      case 'suggestion':
        suggestions.push(result.message);
        break;
    }
  }

  return { issues, suggestions, bottlenecks };
}

export function analyze(nodes: Node[], edges: Edge[], qps?: number): AnalysisResult {
  // Run plugin-based rules
  const ruleResults = runRules({ nodes, edges, qps });
  const { issues, suggestions, bottlenecks } = mapRuleResultsToAnalysis(ruleResults);

  const nodeLoadInfo: NodeLoadInfo[] = [];
  let appLoad = 0;
  let dbLoad = 0;
  let cacheSaved = 0;

  // Traffic analysis if QPS is provided
  if (qps !== undefined && qps > 0) {
    const hasCache = nodes.some((node) =>
      node.data.label.toLowerCase().includes('cache')
    );

    // Calculate traffic distribution
    const trafficResult = calculateEffectiveDBLoad(qps, hasCache);
    appLoad = qps;
    dbLoad = trafficResult.dbQps;
    cacheSaved = trafficResult.cacheSavedQps;

    // Analyze each node
    nodes.forEach((node) => {
      const nodeType = getNodeType(node.data.label);
      const maxQps = getNodeCapacity(nodeType);
      const currentQps = calculateNodeLoad(qps, nodeType, hasCache);
      const loadPercentage = getLoadPercentage(currentQps, maxQps);
      const status = getLoadStatus(loadPercentage);

      nodeLoadInfo.push({
        nodeId: node.id,
        nodeType,
        label: node.data.label,
        currentQps,
        maxQps,
        loadPercentage,
        status,
      });
    });
  }

  return {
    issues,
    suggestions,
    bottlenecks,
    loadBreakdown: {
      appLoad,
      dbLoad,
      cacheSaved,
    },
    nodeLoadInfo,
  };
}

function getNodeType(label: string): string {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('lb') || lowerLabel.includes('load balancer')) return 'lb';
  if (lowerLabel.includes('app') || lowerLabel.includes('server')) return 'app';
  if (lowerLabel.includes('db') || lowerLabel.includes('database')) return 'db';
  if (lowerLabel.includes('cache')) return 'cache';
  return 'app';
}
