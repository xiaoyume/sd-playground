import type { Rule, RuleContext, RuleResult } from '../types';

export const loadBalancerRule: Rule = {
  name: 'load-balancer-rule',
  run(ctx: RuleContext): RuleResult[] {
    const results: RuleResult[] = [];
    const lbNodes = ctx.nodes.filter((node) =>
      node.data.label.toLowerCase().includes('lb')
    );

    if (lbNodes.length === 0) {
      results.push({
        type: 'warning',
        message: 'No load balancer, poor scalability',
      });
    }

    return results;
  },
};
