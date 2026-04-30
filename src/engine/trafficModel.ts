export interface TrafficBreakdown {
  totalQps: number;
  readQps: number;
  writeQps: number;
  cacheHitQps: number;
  dbReadQps: number;
  dbWriteQps: number;
  hotKeyEnabled: boolean;
  hotQps: number;
}

const DEFAULT_READ_RATIO = 0.9;
const DEFAULT_CACHE_HIT_RATE = 0.7;
const HOT_KEY_RATIO = 0.2;

export function computeTraffic(
  qps: number,
  hasCache: boolean,
  _hasReplica: boolean,
  readRatio: number = DEFAULT_READ_RATIO,
  cacheHitRate: number = DEFAULT_CACHE_HIT_RATE,
  hotKeyEnabled: boolean = false
): TrafficBreakdown {
  const readQps = qps * readRatio;
  const writeQps = qps * (1 - readRatio);

  const hotQps = hotKeyEnabled ? qps * HOT_KEY_RATIO : 0;
  const normalQps = qps - hotQps;

  const normalReadQps = normalQps * readRatio;
  const normalCacheHitQps = hasCache ? normalReadQps * cacheHitRate : 0;
  const normalDbReadQps = normalReadQps - normalCacheHitQps;

  // Hot key traffic - if cache exists, most hits go to cache
  const hotCacheHitQps = hasCache ? hotQps * 0.9 : 0; // 90% cache hit for hot keys
  const hotDbReadQps = hotQps - hotCacheHitQps;

  const cacheHitQps = normalCacheHitQps + hotCacheHitQps;
  const dbReadQps = normalDbReadQps + hotDbReadQps;
  const dbWriteQps = writeQps;

  return {
    totalQps: qps,
    readQps,
    writeQps,
    cacheHitQps,
    dbReadQps,
    dbWriteQps,
    hotKeyEnabled,
    hotQps,
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
    case 'redirect':
    case 'redirect-service':
      // Redirect service handles read traffic
      return traffic.readQps;
    case 'write':
    case 'write-service':
      // Write service handles write traffic
      return traffic.writeQps;
    case 'id-generator':
      // ID generator handles write traffic
      return traffic.writeQps;
    case 'app':
      return traffic.totalQps;
    case 'cache':
      return traffic.readQps;
    case 'db-primary':
      return hasReplica ? traffic.dbWriteQps : traffic.dbWriteQps + traffic.dbReadQps;
    case 'db-replica':
      return traffic.dbReadQps;
    case 'db':
      return traffic.dbWriteQps + traffic.dbReadQps;
    default:
      return traffic.totalQps;
  }
}
