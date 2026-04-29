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
        message: 'No cache - high DB load due to no caching layer',
      });
    } else if (ctx.qps && ctx.qps > 0) {
      results.push({
        type: 'suggestion',
        message: 'Cache layer active - reducing DB read load by ~70%',
      });
    }

    return results;
  },
};
