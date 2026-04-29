import type { Rule, RuleContext, RuleResult } from '../types';
import { computeTraffic, getNodeTraffic } from '../trafficModel';

const NODE_CAPACITY: Record<string, number> = {
  cdn: 200000,
  gateway: 100000,
  lb: 100000,
  app: 10000,
  cache: 50000,
  'db-primary': 5000,
  'db-replica': 8000,
  db: 5000,
};

function getNodeType(label: string): string {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('cdn')) return 'cdn';
  if (lowerLabel.includes('gateway')) return 'gateway';
  if (lowerLabel.includes('lb') || lowerLabel.includes('load balancer')) return 'lb';
  if (lowerLabel.includes('app') || lowerLabel.includes('server')) return 'app';
  if (lowerLabel.includes('db-primary') || lowerLabel.includes('db primary')) return 'db-primary';
  if (lowerLabel.includes('db-replica') || lowerLabel.includes('db replica')) return 'db-replica';
  if (lowerLabel.includes('db') || lowerLabel.includes('database')) return 'db';
  if (lowerLabel.includes('cache')) return 'cache';
  return 'app';
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

    const hasReplica = ctx.nodes.some((node) =>
      node.data.label.toLowerCase().includes('db-replica') ||
      node.data.label.toLowerCase().includes('db replica')
    );

    const traffic = computeTraffic(ctx.qps, hasCache, hasReplica);

    ctx.nodes.forEach((node) => {
      const nodeType = getNodeType(node.data.label);
      const maxQps = NODE_CAPACITY[nodeType] || 0;
      const currentQps = getNodeTraffic(nodeType, traffic, hasCache, hasReplica);
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
