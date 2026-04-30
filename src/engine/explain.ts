import type { Node } from 'reactflow';
import type { AnalysisResult } from '../logic/rules';
import type { LatencyResult } from './latency';

export interface NodeExplanation {
  nodeId: string;
  label: string;
  role: string;
  load: string;
  reasoning: string;
}

export interface MetricExplanation {
  metric: string;
  value: string;
  explanation: string;
}

export interface ExplainResult {
  nodeExplanations: NodeExplanation[];
  metricExplanations: MetricExplanation[];
  designSummary: string;
}

function getNodeType(node: Node): string {
  return (node.data?.label || '').toLowerCase().replace(/\s+/g, '-');
}

export function explainDesign(
  nodes: Node[],
  result: AnalysisResult | null,
  latency: LatencyResult | null
): ExplainResult {
  const nodeExplanations: NodeExplanation[] = [];
  const metricExplanations: MetricExplanation[] = [];

  const hasCache = nodes.some((n) => getNodeType(n).includes('cache'));
  const hasReplica = nodes.some((n) => getNodeType(n).includes('db-replica') || getNodeType(n).includes('replica'));
  const hasIdGenerator = nodes.some((n) => getNodeType(n).includes('id-generator') || getNodeType(n).includes('id generator'));

  // Node explanations
  nodes.forEach((node) => {
    const type = getNodeType(node);
    const loadInfo = result?.nodeLoadInfo.find((info) => info.nodeId === node.id);
    const loadPercentage = loadInfo?.loadPercentage || 0;
    const status = loadInfo?.status || 'normal';

    let role = '';
    let reasoning = '';

    if (type.includes('cdn')) {
      role = 'Content Delivery Network';
      reasoning = 'Serves static content close to users, reducing origin load';
    } else if (type.includes('gateway')) {
      role = 'API Gateway';
      reasoning = 'Handles authentication, rate limiting, and request routing';
    } else if (type.includes('lb')) {
      role = 'Load Balancer';
      reasoning = 'Distributes traffic across multiple application servers';
    } else if (type.includes('redirect')) {
      role = 'Redirect Service';
      reasoning = 'Handles HTTP 302 redirects for short URL resolution';
    } else if (type.includes('write')) {
      role = 'Write Service';
      reasoning = 'Handles URL creation requests and writes mapping to DB';
    } else if (type.includes('id-generator') || type.includes('id generator')) {
      role = 'ID Generator';
      reasoning = 'Generates unique short codes using selected strategy';
    } else if (type.includes('app')) {
      role = 'Application Server';
      reasoning = `Processing all incoming requests (${result?.trafficBreakdown?.totalQps || 0} QPS)`;
    } else if (type.includes('cache')) {
      const hitRate = result?.trafficBreakdown
        ? Math.round((result.trafficBreakdown.cacheHitQps / Math.max(result.trafficBreakdown.totalQps * 0.9, 1)) * 100)
        : 70;
      role = 'Cache Layer';
      reasoning = `Serving ${hitRate}% of read traffic, reducing DB load significantly`;
    } else if (type.includes('db-primary')) {
      role = 'Primary Database';
      const writeQps = result?.trafficBreakdown?.dbWriteQps || 0;
      const readQps = result?.trafficBreakdown?.dbReadQps || 0;
      reasoning = `Handling ${Math.round(writeQps)} write QPS + ${Math.round(readQps)} read QPS`;
    } else if (type.includes('db-replica')) {
      role = 'Database Replica';
      reasoning = 'Offloading read traffic from primary database';
    } else {
      role = 'Component';
      reasoning = 'Part of the system architecture';
    }

    nodeExplanations.push({
      nodeId: node.id,
      label: node.data?.label || type,
      role,
      load: `${Math.round(loadPercentage)}% (${status})`,
      reasoning,
    });
  });

  // Metric explanations
  if (result?.trafficBreakdown) {
    const tb = result.trafficBreakdown;
    metricExplanations.push({
      metric: 'Total Traffic',
      value: `${Math.round(tb.totalQps)} QPS`,
      explanation: 'Incoming requests per second',
    });

    if (tb.hotKeyEnabled) {
      metricExplanations.push({
        metric: 'Hot Key Traffic',
        value: `${Math.round(tb.hotQps)} QPS`,
        explanation: '20% of traffic concentrated on a single key',
      });
    }

    if (hasCache) {
      metricExplanations.push({
        metric: 'Cache Impact',
        value: `${Math.round(tb.cacheHitQps)} QPS saved`,
        explanation: `Cache serves ${Math.round(tb.cacheHitQps)} QPS, reducing DB load significantly`,
      });
    }

    metricExplanations.push({
      metric: 'DB Read Load',
      value: `${Math.round(tb.dbReadQps)} QPS`,
      explanation: hasCache
        ? 'Remaining reads after cache filtering'
        : 'All read requests hitting database',
    });

    metricExplanations.push({
      metric: 'DB Write Load',
      value: `${Math.round(tb.dbWriteQps)} QPS`,
      explanation: 'All write requests go to primary database',
    });
  }

  // Latency explanations
  if (latency) {
    metricExplanations.push({
      metric: 'Read Latency',
      value: `${latency.readLatency} ms`,
      explanation: hasCache
        ? `Cache hits: ~${latency.pathLatencies[0]?.latency || 0}ms, misses: ~${latency.pathLatencies[1]?.latency || 0}ms`
        : 'All reads go to database',
    });

    metricExplanations.push({
      metric: 'Write Latency',
      value: `${latency.writeLatency} ms`,
      explanation: 'Writes always go to primary database',
    });

    metricExplanations.push({
      metric: 'Avg Latency',
      value: `${latency.totalLatency} ms`,
      explanation: 'Weighted average (90% read, 10% write)',
    });
  }

  // Design summary
  const pros: string[] = [];
  const cons: string[] = [];

  if (hasCache) {
    pros.push('Cache reduces DB load');
  } else {
    cons.push('No cache means higher DB pressure');
  }

  if (hasReplica) {
    pros.push('Replica improves read scalability');
  } else {
    cons.push('No replica limits read capacity');
  }

  if (hasIdGenerator) {
    pros.push('ID generator enables scalable short code creation');
  }

  if (result?.bottlenecks && result.bottlenecks.length > 0) {
    cons.push(`${result.bottlenecks.length} bottleneck(s) detected`);
  }

  const designSummary = [
    pros.length > 0 ? `Strengths: ${pros.join(', ')}` : '',
    cons.length > 0 ? `Weaknesses: ${cons.join(', ')}` : '',
  ]
    .filter(Boolean)
    .join('. ');

  return { nodeExplanations, metricExplanations, designSummary };
}
