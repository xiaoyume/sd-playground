import type { Rule } from './types';
import { dbRule } from './rules/db.rule';
import { cacheRule } from './rules/cache.rule';
import { capacityRule } from './rules/capacity.rule';
import { loadBalancerRule } from './rules/loadBalancer.rule';

const rules: Rule[] = [
  dbRule,
  cacheRule,
  capacityRule,
  loadBalancerRule,
];

export function getRules(): Rule[] {
  return rules;
}

export function addRule(rule: Rule): void {
  rules.push(rule);
}
