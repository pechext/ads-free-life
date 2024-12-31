import { IStorage, StorageItem } from '@pechext/extension-essentials-lib';
import { BlockDnrRule } from './rule';
import { Config } from '../config';

export type StoredRule = { name: string; rule: BlockDnrRule; };
export type StoredRules = Record<string, Record<string, StoredRule>>;

export class Rules extends StorageItem {
  data: StoredRules = {};

  protected getKey(): string {
    return 'rules';
  }

  protected getVersion(): number {
    return 1;
  }

  static get(storage: IStorage): Rules {
    return new Rules(storage);
  }
}

export class ConfigStorageItem extends StorageItem {
  config: Config = {
    v: 0,
    items: []
  };

  protected getKey(): string {
    return 'blocker_configs';
  }

  protected getVersion(): number {
    return 1;
  }

  static get(storage: IStorage): ConfigStorageItem {
    return new ConfigStorageItem(storage);
  }
}