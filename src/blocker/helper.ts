import { IStorage, LocalStorage } from '@pechext/extension-essentials-lib';
import { Rules, StoredRule, StoredRules } from './model';

export class _RulesHelper {
  private rules: Rules;

  constructor (storage: IStorage) {
    this.rules = Rules.get(storage);
  }

  async getRules(): Promise<StoredRules> {
    await this.rules.load();
    return this.rules.rules;
  }

  async updateRule(key: string, name: string, rule: StoredRule): Promise<void> {
    this.rules.rules[key] = { name: name, rule: rule };
    await this.saveChanges();
  }

  private async saveChanges(): Promise<void> {
    await this.rules.save();
  }
}

const RulesHelper = new _RulesHelper(new LocalStorage());
export default RulesHelper;