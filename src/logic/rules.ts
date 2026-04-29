import type { Node, Edge } from 'reactflow';

interface AnalysisResult {
  issues: string[];
  suggestions: string[];
}

export function analyze(nodes: Node[], _edges: Edge[]): AnalysisResult {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for database
  const dbNodes = nodes.filter((node) => node.data.label.toLowerCase().includes('db'));
  if (dbNodes.length === 0) {
    issues.push('Missing database');
  } else if (dbNodes.length === 1) {
    suggestions.push('Single point of failure - consider adding database replication');
  }

  // Check for cache
  const cacheNodes = nodes.filter((node) => node.data.label.toLowerCase().includes('cache'));
  if (cacheNodes.length === 0) {
    suggestions.push('No cache, poor read performance');
  }

  // Check for load balancer
  const lbNodes = nodes.filter((node) => node.data.label.toLowerCase().includes('lb'));
  if (lbNodes.length === 0) {
    suggestions.push('No load balancer, poor scalability');
  }

  return { issues, suggestions };
}
