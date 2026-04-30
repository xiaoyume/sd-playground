export interface NodeCapacity {
  type: string;
  maxQps: number;
}

export const CAPACITY: Record<string, number> = {
  lb: 100000,
  app: 10000,
  redirect: 15000,
  'redirect-service': 15000,
  write: 5000,
  'write-service': 5000,
  cache: 50000,
  'id-generator': 50000,
  db: 5000,
};

export function getNodeCapacity(type: string): number {
  return CAPACITY[type.toLowerCase()] || 0;
}

export function getLoadPercentage(currentQps: number, maxQps: number): number {
  if (maxQps === 0) return 0;
  return (currentQps / maxQps) * 100;
}

export function isOverloaded(currentQps: number, maxQps: number): boolean {
  return currentQps > maxQps;
}

export function getLoadStatus(percentage: number): 'normal' | 'warning' | 'overloaded' {
  if (percentage > 100) return 'overloaded';
  if (percentage > 70) return 'warning';
  return 'normal';
}
