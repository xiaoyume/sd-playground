import type { Scenario } from './types';
import { dbRule } from '../engine/rules/db.rule';
import { cacheRule } from '../engine/rules/cache.rule';
import { capacityRule } from '../engine/rules/capacity.rule';

export const urlShortenerScenario: Scenario = {
  id: 'url-shortener',
  name: 'URL Shortener',
  description: 'Design a URL shortening service like TinyURL',
  requirements: [
    'High read traffic',
    'Low latency',
    'Support large scale (millions of URLs)',
  ],
  allowedComponents: ['lb', 'app', 'cache', 'db'],
  rules: [dbRule, cacheRule, capacityRule],
  initialGraph: {
    nodes: [
      { id: 'lb-1', type: 'custom', position: { x: 200, y: 50 }, data: { label: 'LB', onDelete: () => {} } },
      { id: 'app-1', type: 'custom', position: { x: 200, y: 150 }, data: { label: 'APP', onDelete: () => {} } },
      { id: 'cache-1', type: 'custom', position: { x: 200, y: 250 }, data: { label: 'CACHE', onDelete: () => {} } },
      { id: 'db-1', type: 'custom', position: { x: 200, y: 350 }, data: { label: 'DB', onDelete: () => {} } },
    ],
    edges: [
      { id: 'e-lb-app', source: 'lb-1', target: 'app-1' },
      { id: 'e-app-cache', source: 'app-1', target: 'cache-1' },
      { id: 'e-cache-db', source: 'cache-1', target: 'db-1' },
    ],
  },
};
