import { IStorage, LocalStorage } from '@pechext/extension-essentials-lib';
import { ConfigStorageItem } from './model';
import { BlockerConfig } from './blocker';
import { Config } from '../config';

export class _RulesHelper {
  private configStorageItem: ConfigStorageItem;

  constructor (storage: IStorage) {
    this.configStorageItem = ConfigStorageItem.get(storage);
  }

  async storeConfig(config: Config): Promise<void> {
    await this.configStorageItem.load();
    if (this.configStorageItem.config.v < config.v) {
      this.configStorageItem.config = config;
      this.saveChanges();
    }
  }

  async getConfigs(): Promise<BlockerConfig[]> {
    await this.configStorageItem.load();
    return this.configStorageItem.config.items;
  }

  private async saveChanges(): Promise<void> {
    await this.configStorageItem.save();
  }
}

const RulesHelper = new _RulesHelper(new LocalStorage());
export default RulesHelper;