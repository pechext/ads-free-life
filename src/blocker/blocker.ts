import { BlockDnrRule, DnrRule } from './rule';
import DNRHelper from './dnr';
import { generateRuleId } from './utils';
import { StoredRule } from './model';
import DBHelper from '../utils/db';

type RuleCondition = chrome.declarativeNetRequest.RuleCondition;

export interface BlockerConfig {
  key: string,
  rulesPrefix: number;
  rules: Record<string, StoredRule>;
}

export default class BlockManager {
  private constructor (private db: DBHelper) { }

  static async get(): Promise<BlockManager> {
    return new BlockManager(await DBHelper.createDatabase('blocker', 'enabled_rules'));
  }

  async enable(ruleId: string, rule: BlockDnrRule, rulesPrefix: number) {
    await this.disable(ruleId);
    const dnrRules: DnrRule[] = [];
    const blockerEnabledRules: { [key: string]: number[]; } = {};
    const rules: DnrRule[] = rule.urlFilters.map((url, urlIndex) => {
      const condition: RuleCondition = {
        urlFilter: url,
        resourceTypes: rule.resourceTypes,
      };

      return {
        id: generateRuleId(rulesPrefix, urlIndex),
        priority: 1,
        action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
        condition,
      };
    });
    dnrRules.push(...rules);
    blockerEnabledRules[ruleId] = rules.map(r => r.id);
    console.log(`Blocker enabled, adding the following rules:\n${JSON.stringify(dnrRules)} (${JSON.stringify(blockerEnabledRules)})`);
    await DNRHelper.updateDynamicRules({ addRules: dnrRules });
    await this.db.set(ruleId, rules.map(r => r.id));
  }

  async disable(ruleId: string) {
    const idsToRemove = await this.db.get(ruleId);
    console.log(`Blocker disabled, removing the following rules:\n${JSON.stringify(idsToRemove)}`);
    await DNRHelper.updateDynamicRules({ removeRuleIds: idsToRemove });
    await this.db.remove(ruleId);
  }

  async disableByRules(specificIds?: number[]) {
    let rulesIdsToRemove: number[] = [];
    if (specificIds) {
      rulesIdsToRemove = specificIds;
    } else {
      const dnrRules = await DNRHelper.getDynamicRules();
      rulesIdsToRemove = dnrRules.map(r => r.id);
    }
    console.log(`Blocker disabled, removing the following rules:\n${JSON.stringify(rulesIdsToRemove)}`);
    await DNRHelper.updateDynamicRules({ removeRuleIds: rulesIdsToRemove });
  }
};