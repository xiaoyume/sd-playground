import type { Rule, RuleContext, RuleResult } from '../types';

export const readWriteSplitRule: Rule = {
  name: 'read-write-split-rule',
  run(ctx: RuleContext): RuleResult[] {
    const results: RuleResult[] = [];

    const hasReplica = ctx.nodes.some((node) =>
      node.data.label.toLowerCase().includes('db-replica') ||
      node.data.label.toLowerCase().includes('db replica')
    );

    const hasPrimary = ctx.nodes.some((node) =>
      node.data.label.toLowerCase().includes('db-primary') ||
      node.data.label.toLowerCase().includes('db primary') ||
      node.data.label.toLowerCase().includes('db')
    );

    if (hasPrimary && !hasReplica) {
      results.push({
        type: 'warning',
        message: 'No DB replica - all read traffic goes to primary (consider adding replica for read scaling)',
      });
    }

    if (hasReplica && hasPrimary) {
      results.push({
        type: 'suggestion',
        message: 'Read/write split enabled - reads routed to replica, writes to primary',
      });
    }

    return results;
  },
};
