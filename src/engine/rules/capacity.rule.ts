import type { Rule, RuleContext, RuleResult } from '../types';

const NODE_CAPACITY: Record<string, number> = {
  lb: 100000,
  app: 10000,
  cache: 50000,
  db: 5000,
};

function getNodeType(label: string): string {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('lb') || lowerLabel.includes('load balancer')) return 'lb';
  if (lowerLabel.includes('app') || lowerLabel.includes('server')) return 'app';
  if (lowerLabel.includes('db') || lowerLabel.includes('database')) return 'db';
  if (lowerLabel.includes('cache')) return 'cache';
  return 'app';
}

function calculateNodeLoad(qps: number, nodeType: string, hasCache: boolean): number {
  switch (nodeType) {
    case 'lb':
    case 'app':
    case 'cache':
      return qps;
    case 'db': {
      const cacheHitRate = 0.7;
      return hasCache ? qps * (1 - cacheHitRate) : qps;
    }
    default:
      return qps;
  }
}

export const capacityRule: Rule = {
  name: 'capacity-rule',
  run(ctx: RuleContext): RuleResult[] {
    const results: RuleResult[] = [];

    if (ctx.qps === undefined || ctx.qps <= 0) {
      return results;
    }

    const hasCache = ctx.nodes.some((node) =>
      node.data.label.toLowerCase().includes('cache')
    );

    ctx.nodes.forEach((node) => {
      const nodeType = getNodeType(node.data.label);
      const maxQps = NODE_CAPACITY[nodeType] || 0;
      const currentQps = calculateNodeLoad(ctx.qps!, nodeType, hasCache);
      const loadPercentage = maxQps > 0 ? (currentQps / maxQps) * 100 : 0;

      if (loadPercentage > 100) {
        results.push({
          type: 'issue',
          message: `Node ${node.data.label} overloaded (QPS: ${Math.round(currentQps)} > capacity: ${maxQps})`,
          nodeId: node.id,
        });
      } else if (loadPercentage > 70) {
        results.push({
          type: 'warning',
          message: `Node ${node.data.label} under high load (${Math.round(loadPercentage)}%)`,
          nodeId: node.id,
        });
      }
    });

    return results;
  },
};
