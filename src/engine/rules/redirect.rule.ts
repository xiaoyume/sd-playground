import type { Rule, RuleContext, RuleResult } from '../types';

export const redirectRule: Rule = {
  name: 'redirect',
  run(ctx: RuleContext): RuleResult[] {
    const results: RuleResult[] = [];
    const hasRedirectService = ctx.nodes.some((n) =>
      n.data.label.toLowerCase().includes('redirect')
    );

    const hasCache = ctx.nodes.some((n) =>
      n.data.label.toLowerCase().includes('cache')
    );

    if (hasRedirectService) {
      results.push({
        type: 'suggestion',
        message: 'Redirect service handles HTTP 302 responses for short URL resolution',
      });

      if (!hasCache) {
        results.push({
          type: 'warning',
          message: 'Redirect service without cache will cause high DB read load',
        });
      }
    }

    return results;
  },
};
