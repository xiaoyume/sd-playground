import type { Rule, RuleContext, RuleResult } from '../types';

export const idGeneratorRule: Rule = {
  name: 'id-generator',
  run(ctx: RuleContext): RuleResult[] {
    const results: RuleResult[] = [];
    const hasIdGenerator = ctx.nodes.some((n) =>
      n.data.label.toLowerCase().includes('id-generator') ||
      n.data.label.toLowerCase().includes('id generator')
    );

    const hasWriteService = ctx.nodes.some((n) =>
      n.data.label.toLowerCase().includes('write') ||
      n.data.label.toLowerCase().includes('write-service')
    );

    if (hasWriteService && !hasIdGenerator) {
      results.push({
        type: 'warning',
        message: 'No ID generation strategy defined for write service',
      });
    }

    if (hasIdGenerator) {
      results.push({
        type: 'suggestion',
        message: 'ID generator enables scalable short code creation',
      });
    }

    return results;
  },
};
