import type { Rule, RuleContext, RuleResult } from '../types';

export const cacheRule: Rule = {
  name: 'cache-rule',
  run(ctx: RuleContext): RuleResult[] {
    const results: RuleResult[] = [];
    const cacheNodes = ctx.nodes.filter((node) =>
      node.data.label.toLowerCase().includes('cache')
    );

    if (cacheNodes.length === 0) {
      results.push({
        type: 'warning',
        message: 'No cache, poor read performance',
      });
    }

    return results;
  },
};
