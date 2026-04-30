import type { Node } from 'reactflow';
import type { TrafficBreakdown } from './trafficModel';

const BASE_LATENCY: Record<string, number> = {
  cdn: 20,
  gateway: 10,
  lb: 5,
  app: 30,
  cache: 5,
  'db-primary': 50,
  'db-replica': 40,
};

export interface LatencyResult {
  readLatency: number;
  writeLatency: number;
  totalLatency: number;
  pathLatencies: PathLatency[];
}

export interface PathLatency {
  path: string;
  latency: number;
  description: string;
}

function getNodeType(node: Node): string {
  return (node.data?.label || '').toLowerCase().replace(/\s+/g, '-');
}

function getNodeLatency(nodeType: string): number {
  return BASE_LATENCY[nodeType] || 30;
}

export function computeLatency(
  nodes: Node[],
  traffic: TrafficBreakdown | null
): LatencyResult {
  const readRatio = 0.9;
  const writeRatio = 0.1;
  const cacheHitRate = traffic ? traffic.cacheHitQps / Math.max(traffic.totalQps * readRatio, 1) : 0.7;

  const hasCache = nodes.some((n) => {
    const type = getNodeType(n);
    return type.includes('cache');
  });

  const pathLatencies: PathLatency[] = [];

  // Build node latency map
  const nodeLatencies: Record<string, number> = {};
  nodes.forEach((node) => {
    const type = getNodeType(node);
    nodeLatencies[node.id] = getNodeLatency(type);
  });

  // Find nodes by type
  const findNode = (typePattern: string) =>
    nodes.find((n) => getNodeType(n).includes(typePattern));

  const gatewayNode = findNode('gateway');
  const lbNode = findNode('lb');
  const appNode = findNode('app');
  const cacheNode = findNode('cache');
  const dbPrimaryNode = findNode('db-primary');
  const dbReplicaNode = findNode('db-replica');
  const cdnNode = findNode('cdn');

  // Read path latency
  let readLatency = 0;
  if (hasCache && cacheNode) {
    // Cache hit path: gateway → lb → app → cache
    const cacheHitPath =
      (gatewayNode ? nodeLatencies[gatewayNode.id] : 0) +
      (lbNode ? nodeLatencies[lbNode.id] : 0) +
      (appNode ? nodeLatencies[appNode.id] : 0) +
      nodeLatencies[cacheNode.id];

    // Cache miss path: gateway → lb → app → cache → db
    const dbNode = dbReplicaNode || dbPrimaryNode;
    const cacheMissPath =
      (gatewayNode ? nodeLatencies[gatewayNode.id] : 0) +
      (lbNode ? nodeLatencies[lbNode.id] : 0) +
      (appNode ? nodeLatencies[appNode.id] : 0) +
      nodeLatencies[cacheNode.id] +
      (dbNode ? nodeLatencies[dbNode.id] : 0);

    readLatency = cacheHitRate * cacheHitPath + (1 - cacheHitRate) * cacheMissPath;

    pathLatencies.push({
      path: 'Read (cache hit)',
      latency: Math.round(cacheHitPath),
      description: `gateway → lb → app → cache (${Math.round(cacheHitRate * 100)}% of reads)`,
    });
    pathLatencies.push({
      path: 'Read (cache miss)',
      latency: Math.round(cacheMissPath),
      description: `gateway → lb → app → cache → db (${Math.round((1 - cacheHitRate) * 100)}% of reads)`,
    });
  } else {
    // No cache: gateway → lb → app → db
    const dbNode = dbPrimaryNode;
    readLatency =
      (gatewayNode ? nodeLatencies[gatewayNode.id] : 0) +
      (lbNode ? nodeLatencies[lbNode.id] : 0) +
      (appNode ? nodeLatencies[appNode.id] : 0) +
      (dbNode ? nodeLatencies[dbNode.id] : 0);

    pathLatencies.push({
      path: 'Read',
      latency: Math.round(readLatency),
      description: 'gateway → lb → app → db (no cache)',
    });
  }

  // Write path latency: gateway → lb → app → db-primary
  const writeLatency =
    (gatewayNode ? nodeLatencies[gatewayNode.id] : 0) +
    (lbNode ? nodeLatencies[lbNode.id] : 0) +
    (appNode ? nodeLatencies[appNode.id] : 0) +
    (dbPrimaryNode ? nodeLatencies[dbPrimaryNode.id] : 0);

  pathLatencies.push({
    path: 'Write',
    latency: Math.round(writeLatency),
    description: 'gateway → lb → app → db-primary',
  });

  // CDN latency (if present)
  if (cdnNode) {
    const cdnLatency = nodeLatencies[cdnNode.id];
    pathLatencies.unshift({
      path: 'CDN',
      latency: Math.round(cdnLatency),
      description: 'Static content served from CDN',
    });
  }

  const totalLatency = readRatio * readLatency + writeRatio * writeLatency;

  return {
    readLatency: Math.round(readLatency),
    writeLatency: Math.round(writeLatency),
    totalLatency: Math.round(totalLatency),
    pathLatencies,
  };
}
