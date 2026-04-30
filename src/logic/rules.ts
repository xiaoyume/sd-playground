import type { Node, Edge } from 'reactflow';
import { getNodeCapacity, getLoadPercentage, getLoadStatus } from './capacity';
import { runRules } from '../engine/ruleEngine';
import { computeTraffic, getNodeTraffic } from '../engine/trafficModel';
import { computeLatency } from '../engine/latency';
import type { RuleResult, Rule } from '../engine/types';
import type { TrafficBreakdown } from '../engine/trafficModel';
import type { LatencyResult } from '../engine/latency';

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
  bottleneckNodeIds: string[];
  trafficBreakdown: TrafficBreakdown | null;
  latency: LatencyResult | null;
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
  bottleneckNodeIds: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  const bottlenecks: string[] = [];
  const bottleneckNodeIds: string[] = [];

  for (const result of ruleResults) {
    switch (result.type) {
      case 'issue':
        bottlenecks.push(result.message);
        if (result.nodeId) {
          bottleneckNodeIds.push(result.nodeId);
        }
        break;
      case 'warning':
        suggestions.push(result.message);
        break;
      case 'suggestion':
        suggestions.push(result.message);
        break;
    }
  }

  return { issues, suggestions, bottlenecks, bottleneckNodeIds };
}

function getNodeType(label: string): string {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('cdn')) return 'cdn';
  if (lowerLabel.includes('gateway')) return 'gateway';
  if (lowerLabel.includes('lb') || lowerLabel.includes('load balancer')) return 'lb';
  if (lowerLabel.includes('redirect')) return 'redirect';
  if (lowerLabel.includes('write')) return 'write';
  if (lowerLabel.includes('id-generator') || lowerLabel.includes('id generator')) return 'id-generator';
  if (lowerLabel.includes('app') || lowerLabel.includes('server')) return 'app';
  if (lowerLabel.includes('db-primary') || lowerLabel.includes('db primary')) return 'db-primary';
  if (lowerLabel.includes('db-replica') || lowerLabel.includes('db replica')) return 'db-replica';
  if (lowerLabel.includes('db') || lowerLabel.includes('database')) return 'db';
  if (lowerLabel.includes('cache')) return 'cache';
  return 'app';
}

export function analyze(
  nodes: Node[],
  edges: Edge[],
  qps?: number,
  scenarioRules?: Rule[],
  hotKeyEnabled: boolean = false
): AnalysisResult {
  // Run plugin-based rules (scenario-specific or global)
  const ruleResults = scenarioRules
    ? runScenarioRules(scenarioRules, { nodes, edges, qps, hotKeyEnabled })
    : runRules({ nodes, edges, qps });
  const { issues, suggestions, bottlenecks, bottleneckNodeIds } = mapRuleResultsToAnalysis(ruleResults);

  const nodeLoadInfo: NodeLoadInfo[] = [];
  let trafficBreakdown: TrafficBreakdown | null = null;
  let latency: LatencyResult | null = null;
  let appLoad = 0;
  let dbLoad = 0;
  let cacheSaved = 0;

  // Traffic analysis if QPS is provided
  if (qps !== undefined && qps > 0) {
    const hasCache = nodes.some((node) =>
      node.data.label.toLowerCase().includes('cache')
    );

    const hasReplica = nodes.some((node) =>
      node.data.label.toLowerCase().includes('db-replica') ||
      node.data.label.toLowerCase().includes('db replica')
    );

    // Calculate traffic distribution
    trafficBreakdown = computeTraffic(qps, hasCache, hasReplica, 0.9, 0.7, hotKeyEnabled);
    appLoad = qps;
    dbLoad = trafficBreakdown.dbReadQps + trafficBreakdown.dbWriteQps;
    cacheSaved = trafficBreakdown.cacheHitQps;

    // Calculate latency
    latency = computeLatency(nodes, trafficBreakdown);

    // Analyze each node
    nodes.forEach((node) => {
      const nodeType = getNodeType(node.data.label);
      const maxQps = getNodeCapacity(nodeType);
      const currentQps = getNodeTraffic(nodeType, trafficBreakdown!, hasCache, hasReplica);
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
    bottleneckNodeIds,
    trafficBreakdown,
    latency,
    loadBreakdown: {
      appLoad,
      dbLoad,
      cacheSaved,
    },
    nodeLoadInfo,
  };
}

function runScenarioRules(rules: Rule[], ctx: { nodes: Node[]; edges: Edge[]; qps?: number; hotKeyEnabled?: boolean }): RuleResult[] {
  const results: RuleResult[] = [];
  for (const rule of rules) {
    const ruleResults = rule.run(ctx);
    results.push(...ruleResults);
  }
  return results;
}
