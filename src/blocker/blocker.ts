import { BlockDnrRule, DnrRule } from './rule';
import DNRHelper from './dnr';
import { generateRuleId, isRelevantId } from './utils';

type RuleActionType = chrome.declarativeNetRequest.RuleActionType;
type RuleCondition = chrome.declarativeNetRequest.RuleCondition;

export interface BlockerConfig {
  key: string,
  rulesPrefix: number;
  rules: BlockDnrRule[];
}

export default class BlockManager {
  constructor (private config: BlockerConfig) { }

  async enable() {
    await this.disable();
    const dnrRules: DnrRule[] = [];
    for (let i = 0; i < this.config.rules.length; i++) {
      const rule = this.config.rules[i];
      const rules: DnrRule[] = rule.urlsFilter.map((url, urlIndex) => {
        const condition: RuleCondition = {
          urlFilter: url,
          resourceTypes: rule.resourceTypes,
        };

        return {
          id: generateRuleId(this.config.key, this.config.rulesPrefix, i + urlIndex),
          priority: 1,
          action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
          condition: condition,
        };
      });
      dnrRules.push(...rules);
    }
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