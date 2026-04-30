import type { Node } from 'reactflow';
import type { AnalysisResult } from '../logic/rules';

export interface Tradeoff {
  type: 'pro' | 'con';
  category: string;
  text: string;
}

export interface TradeoffResult {
  tradeoffs: Tradeoff[];
  summary: string;
}

function getNodeType(node: Node): string {
  return (node.data?.label || '').toLowerCase().replace(/\s+/g, '-');
}

export function analyzeTradeoffs(
  nodes: Node[],
  result: AnalysisResult | null
): TradeoffResult {
  const tradeoffs: Tradeoff[] = [];

  const hasCache = nodes.some((n) => getNodeType(n).includes('cache'));
  const hasReplica = nodes.some((n) => getNodeType(n).includes('db-replica') || getNodeType(n).includes('replica'));
  const hasCDN = nodes.some((n) => getNodeType(n).includes('cdn'));
  const hasLB = nodes.some((n) => getNodeType(n).includes('lb'));
  const hasGateway = nodes.some((n) => getNodeType(n).includes('gateway'));

  // Cache trade-offs
  if (hasCache) {
    tradeoffs.push({
      type: 'pro',
      category: 'Cache',
      text: 'Lower latency for read-heavy workloads',
    });
    tradeoffs.push({
      type: 'pro',
      category: 'Cache',
      text: 'Reduces DB load significantly',
    });
    tradeoffs.push({
      type: 'con',
      category: 'Cache',
      text: 'Cache consistency complexity',
    });
    tradeoffs.push({
      type: 'con',
      category: 'Cache',
      text: 'Extra memory cost',
    });
  } else {
    tradeoffs.push({
      type: 'con',
      category: 'Cache',
      text: 'Higher DB load without cache',
    });
    tradeoffs.push({
      type: 'con',
      category: 'Cache',
      text: 'Higher read latency',
    });
  }

  // Replica trade-offs
  if (hasReplica) {
    tradeoffs.push({
      type: 'pro',
      category: 'Replica',
      text: 'Improved read scalability',
    });
    tradeoffs.push({
      type: 'pro',
      category: 'Replica',
      text: 'Better fault tolerance',
    });
    tradeoffs.push({
      type: 'con',
      category: 'Replica',
      text: 'Replication lag risk',
    });
    tradeoffs.push({
      type: 'con',
      category: 'Replica',
      text: 'Eventual consistency',
    });
  } else {
    tradeoffs.push({
      type: 'con',
      category: 'Replica',
      text: 'Single point of failure for reads',
    });
    tradeoffs.push({
      type: 'con',
      category: 'Replica',
      text: 'Limited read scalability',
    });
  }

  // CDN trade-offs
  if (hasCDN) {
    tradeoffs.push({
      type: 'pro',
      category: 'CDN',
      text: 'Faster static content delivery',
    });
    tradeoffs.push({
      type: 'pro',
      category: 'CDN',
      text: 'Reduces origin server load',
    });
    tradeoffs.push({
      type: 'con',
      category: 'CDN',
      text: 'CDN cache invalidation complexity',
    });
  }

  // Load Balancer trade-offs
  if (hasLB) {
    tradeoffs.push({
      type: 'pro',
      category: 'LB',
      text: 'Horizontal scaling capability',
    });
    tradeoffs.push({
      type: 'pro',
      category: 'LB',
      text: 'High availability',
    });
  }

  // Gateway trade-offs
  if (hasGateway) {
    tradeoffs.push({
      type: 'pro',
      category: 'Gateway',
      text: 'Centralized authentication/authorization',
    });
    tradeoffs.push({
      type: 'pro',
      category: 'Gateway',
      text: 'Rate limiting and throttling',
    });
    tradeoffs.push({
      type: 'con',
      category: 'Gateway',
      text: 'Single point of failure if not HA',
    });
  }

  // Bottleneck-based trade-offs
  if (result) {
    if (result.bottlenecks.length > 0) {
      tradeoffs.push({
        type: 'con',
        category: 'Performance',
        text: `${result.bottlenecks.length} bottleneck(s) detected`,
      });
    }

    const overloadedNodes = result.nodeLoadInfo.filter((n) => n.status === 'overloaded');
    if (overloadedNodes.length > 0) {
      tradeoffs.push({
        type: 'con',
        category: 'Capacity',
        text: `${overloadedNodes.map((n) => n.label).join(', ')} overloaded`,
      });
    }
  }

  // Generate summary
  const pros = tradeoffs.filter((t) => t.type === 'pro');
  const cons = tradeoffs.filter((t) => t.type === 'con');

  let summary = '';
  if (pros.length > cons.length) {
    summary = 'More advantages than disadvantages';
  } else if (cons.length > pros.length) {
    summary = 'More disadvantages than advantages';
  } else {
    summary = 'Balanced trade-offs';
  }

  return { tradeoffs, summary };
}
