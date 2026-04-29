import type { RuleContext, RuleResult } from './types';
import { getRules } from './registry';

export function runRules(ctx: RuleContext): RuleResult[] {
  const rules = getRules();
  const results: RuleResult[] = [];

  for (const rule of rules) {
    const ruleResults = rule.run(ctx);
    results.push(...ruleResults);
  }

  return results;
}
