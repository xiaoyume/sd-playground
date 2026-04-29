import type { Rule, RuleContext, RuleResult } from '../types';

export const dbRule: Rule = {
  name: 'db-rule',
  run(ctx: RuleContext): RuleResult[] {
    const results: RuleResult[] = [];
    const dbNodes = ctx.nodes.filter((node) =>
      node.data.label.toLowerCase().includes('db')
    );

    if (dbNodes.length === 0) {
      results.push({
        type: 'issue',
        message: 'Missing database',
      });
    } else if (dbNodes.length === 1) {
      results.push({
        type: 'warning',
        message: 'Single point of failure - consider adding database replication',
        nodeId: dbNodes[0].id,
      });
    }

    return results;
  },
};
