import type { Scenario } from './types';
import { cacheRule } from '../engine/rules/cache.rule';
import { capacityRule } from '../engine/rules/capacity.rule';
import { readWriteSplitRule } from '../engine/rules/readWriteSplit.rule';
import { idGeneratorRule } from '../engine/rules/idGenerator.rule';
import { redirectRule } from '../engine/rules/redirect.rule';
import { hotkeyRule } from '../engine/rules/hotkey.rule';

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
  allowedComponents: ['cdn', 'gateway', 'lb', 'redirect', 'write', 'cache', 'id-generator', 'db-primary', 'db-replica'],
  rules: [cacheRule, capacityRule, readWriteSplitRule, idGeneratorRule, redirectRule, hotkeyRule],
  initialGraph: {
    nodes: [
      { id: 'cdn-1', type: 'custom', position: { x: 200, y: 50 }, data: { label: 'CDN', onDelete: () => {} } },
      { id: 'gw-1', type: 'custom', position: { x: 200, y: 130 }, data: { label: 'GATEWAY', onDelete: () => {} } },
      { id: 'lb-1', type: 'custom', position: { x: 200, y: 210 }, data: { label: 'LB', onDelete: () => {} } },
      { id: 'redirect-1', type: 'custom', position: { x: 130, y: 290 }, data: { label: 'REDIRECT', onDelete: () => {} } },
      { id: 'write-1', type: 'custom', position: { x: 270, y: 290 }, data: { label: 'WRITE', onDelete: () => {} } },
      { id: 'cache-1', type: 'custom', position: { x: 130, y: 370 }, data: { label: 'CACHE', onDelete: () => {} } },
      { id: 'id-gen-1', type: 'custom', position: { x: 270, y: 370 }, data: { label: 'ID-GENERATOR', onDelete: () => {} } },
      { id: 'db-primary-1', type: 'custom', position: { x: 200, y: 450 }, data: { label: 'DB-PRIMARY', onDelete: () => {} } },
    ],
    edges: [
      { id: 'e-cdn-gw', source: 'cdn-1', target: 'gw-1' },
      { id: 'e-gw-lb', source: 'gw-1', target: 'lb-1' },
      { id: 'e-lb-redirect', source: 'lb-1', target: 'redirect-1' },
      { id: 'e-lb-write', source: 'lb-1', target: 'write-1' },
      { id: 'e-redirect-cache', source: 'redirect-1', target: 'cache-1' },
      { id: 'e-write-idgen', source: 'write-1', target: 'id-gen-1' },
      { id: 'e-cache-db', source: 'cache-1', target: 'db-primary-1' },
      { id: 'e-idgen-db', source: 'id-gen-1', target: 'db-primary-1' },
    ],
  },
};
