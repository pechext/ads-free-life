import { DnrRule } from './rule';
import DNRHelper from './dnr';
import { generateRuleId, isRelevantId } from './utils';

export interface BlockerConfig {
  key: string,
  rulesPrefix: number;
  rules: DnrRule[];
}

export default class BlockManager {
  constructor (private config: BlockerConfig) { }

  async enable() {
    await this.disable();
    const dnrRules = this.config.rules.map(r => {
      return {
        id: generateRuleId(this.config.key, this.config.rulesPrefix, r.id),
        priority: r.priority,
        action: r.action,
        condition: r.condition
      };
    });
    console.log(`Blocker[${this.config.key}] enabled, adding the following rules:\n${JSON.stringify(dnrRules)}`);
    await DNRHelper.updateDynamicRules({ addRules: dnrRules });
  }

  async disable() {
    let existingRules = await DNRHelper.getDynamicRules();
    existingRules = existingRules.filter(r => isRelevantId(r.id, this.config.key, this.config.rulesPrefix));
    console.log(`Blocker[${this.config.key}] disabled, removing the following rules:\n${JSON.stringify(existingRules)}`);
    await DNRHelper.updateDynamicRules({ removeRuleIds: existingRules.map(r => r.id) });
  }
}