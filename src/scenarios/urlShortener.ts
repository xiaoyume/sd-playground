import type { Scenario } from './types';
import { cacheRule } from '../engine/rules/cache.rule';
import { capacityRule } from '../engine/rules/capacity.rule';
import { readWriteSplitRule } from '../engine/rules/readWriteSplit.rule';

export const urlShortenerScenario: Scenario = {
  id: 'url-shortener',
  name: 'URL Shortener',
  description: 'Design a URL shortening service like TinyURL with read/write separation',
  requirements: [
    'High read traffic (90% reads, 10% writes)',
    'Low latency for redirects',
    'Support large scale (millions of URLs)',
    'Cache-friendly workload',
  ],
  allowedComponents: ['cdn', 'gateway', 'lb', 'app', 'cache', 'db-primary', 'db-replica'],
  rules: [cacheRule, capacityRule, readWriteSplitRule],
  initialGraph: {
    nodes: [
      { id: 'cdn-1', type: 'custom', position: { x: 200, y: 50 }, data: { label: 'CDN', onDelete: () => {} } },
      { id: 'gw-1', type: 'custom', position: { x: 200, y: 130 }, data: { label: 'GATEWAY', onDelete: () => {} } },
      { id: 'lb-1', type: 'custom', position: { x: 200, y: 210 }, data: { label: 'LB', onDelete: () => {} } },
      { id: 'app-1', type: 'custom', position: { x: 200, y: 290 }, data: { label: 'APP', onDelete: () => {} } },
      { id: 'cache-1', type: 'custom', position: { x: 200, y: 370 }, data: { label: 'CACHE', onDelete: () => {} } },
      { id: 'db-primary-1', type: 'custom', position: { x: 130, y: 450 }, data: { label: 'DB-PRIMARY', onDelete: () => {} } },
      { id: 'db-replica-1', type: 'custom', position: { x: 270, y: 450 }, data: { label: 'DB-REPLICA', onDelete: () => {} } },
    ],
    edges: [
      { id: 'e-cdn-gw', source: 'cdn-1', target: 'gw-1' },
      { id: 'e-gw-lb', source: 'gw-1', target: 'lb-1' },
      { id: 'e-lb-app', source: 'lb-1', target: 'app-1' },
      { id: 'e-app-cache', source: 'app-1', target: 'cache-1' },
      { id: 'e-cache-dbprimary', source: 'cache-1', target: 'db-primary-1' },
      { id: 'e-cache-dbrreplica', source: 'cache-1', target: 'db-replica-1' },
    ],
  },
};
