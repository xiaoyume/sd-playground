import type { Node, Edge } from 'reactflow';
import { getNodeCapacity, getLoadPercentage, getLoadStatus } from './capacity';
import { calculateNodeLoad, calculateEffectiveDBLoad } from './traffic';

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

export function analyze(nodes: Node[], _edges: Edge[], qps?: number): AnalysisResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  const bottlenecks: string[] = [];
  const nodeLoadInfo: NodeLoadInfo[] = [];

  let appLoad = 0;
  let dbLoad = 0;
  let cacheSaved = 0;

  // Check for database
  const dbNodes = nodes.filter((node) => node.data.label.toLowerCase().includes('db'));
  if (dbNodes.length === 0) {
    issues.push('Missing database');
  } else if (dbNodes.length === 1) {
    suggestions.push('Single point of failure - consider adding database replication');
  }

  // Check for cache
  const cacheNodes = nodes.filter((node) => node.data.label.toLowerCase().includes('cache'));
  const hasCache = cacheNodes.length > 0;
  if (!hasCache) {
    suggestions.push('No cache, poor read performance');
  }

  // Check for load balancer
  const lbNodes = nodes.filter((node) => node.data.label.toLowerCase().includes('lb'));
  if (lbNodes.length === 0) {
    suggestions.push('No load balancer, poor scalability');
  }

  // Traffic analysis if QPS is provided
  if (qps !== undefined && qps > 0) {
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

      // Check for bottlenecks
      if (status === 'overloaded') {
        bottlenecks.push(
          `Node ${node.data.label} overloaded (QPS: ${Math.round(currentQps)} > capacity: ${maxQps})`
        );
      }
    });

    // Generate suggestions based on load
    if (bottlenecks.length > 0) {
      if (!hasCache) {
        suggestions.push('Add cache to reduce database load');
      }
      if (dbNodes.length < 2) {
        suggestions.push('Scale DB (replication/sharding)');
      }
      if (lbNodes.length === 0) {
        suggestions.push('Add load balancer for better distribution');
      }
      suggestions.push('Consider adding more app servers');
    }
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
