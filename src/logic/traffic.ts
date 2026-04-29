export interface TrafficResult {
  dbQps: number;
  cacheSavedQps: number;
  cacheHitRate: number;
}

export function calculateEffectiveDBLoad(
  qps: number,
  hasCache: boolean,
  cacheHitRate: number = 0.7
): TrafficResult {
  if (!hasCache) {
    return {
      dbQps: qps,
      cacheSavedQps: 0,
      cacheHitRate: 0,
    };
  }

  const cacheSavedQps = qps * cacheHitRate;
  const dbQps = qps - cacheSavedQps;

  return {
    dbQps,
    cacheSavedQps,
    cacheHitRate,
  };
}

export function calculateNodeLoad(
  qps: number,
  nodeType: string,
  hasCache: boolean
): number {
  const normalizedType = nodeType.toLowerCase();

  switch (normalizedType) {
    case 'lb':
      return qps;
    case 'app':
      return qps;
    case 'cache':
      return qps;
    case 'db': {
      const result = calculateEffectiveDBLoad(qps, hasCache);
      return result.dbQps;
    }
    default:
      return qps;
  }
}
