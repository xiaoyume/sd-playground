export interface TrafficBreakdown {
  totalQps: number;
  readQps: number;
  writeQps: number;
  cacheHitQps: number;
  dbReadQps: number;
  dbWriteQps: number;
}

const DEFAULT_READ_RATIO = 0.9;
const DEFAULT_CACHE_HIT_RATE = 0.7;

export function computeTraffic(
  qps: number,
  hasCache: boolean,
  _hasReplica: boolean,
  readRatio: number = DEFAULT_READ_RATIO,
  cacheHitRate: number = DEFAULT_CACHE_HIT_RATE
): TrafficBreakdown {
  const readQps = qps * readRatio;
  const writeQps = qps * (1 - readRatio);

  const cacheHitQps = hasCache ? readQps * cacheHitRate : 0;
  const dbReadQps = readQps - cacheHitQps;

  const dbWriteQps = writeQps;

  return {
    totalQps: qps,
    readQps,
    writeQps,
    cacheHitQps,
    dbReadQps,
    dbWriteQps,
  };
}

export function getNodeTraffic(
  nodeType: string,
  traffic: TrafficBreakdown,
  _hasCache: boolean,
  hasReplica: boolean
): number {
  switch (nodeType) {
    case 'cdn':
    case 'gateway':
    case 'lb':
      return traffic.totalQps;
    case 'app':
      return traffic.totalQps;
    case 'cache':
      return traffic.readQps;
    case 'db-primary':
      // Primary handles all writes + reads if no replica
      return hasReplica ? traffic.dbWriteQps : traffic.dbWriteQps + traffic.dbReadQps;
    case 'db-replica':
      // Replica handles reads
      return traffic.dbReadQps;
    case 'db':
      return traffic.dbWriteQps + traffic.dbReadQps;
    default:
      return traffic.totalQps;
  }
}
