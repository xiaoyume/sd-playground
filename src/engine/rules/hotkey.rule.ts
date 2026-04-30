import type { Rule, RuleContext, RuleResult } from '../types';

export const hotkeyRule: Rule = {
  name: 'hotkey',
  run(ctx: RuleContext): RuleResult[] {
    const results: RuleResult[] = [];
    const hasCache = ctx.nodes.some((n) =>
      n.data.label.toLowerCase().includes('cache')
    );

    // Hot key is enabled via context (passed from UI)
    const hotKeyEnabled = (ctx as any).hotKeyEnabled || false;

    if (hotKeyEnabled) {
      if (!hasCache) {
        results.push({
          type: 'issue',
          message: 'Hot key enabled without cache will overload DB with concentrated traffic',
        });
      } else {
        results.push({
          type: 'suggestion',
          message: 'Cache effectively mitigates hot key traffic concentration',
        });
      }
    }

    return results;
  },
};
