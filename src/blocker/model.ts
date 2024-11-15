import { IStorage, StorageItem } from '@pechext/extension-essentials-lib';

type ResourceType = chrome.declarativeNetRequest.ResourceType;

export type StoredRules = { [key: string]: { name: string; rule: StoredRule; }; };
export type StoredRule = { resourceTypes: ResourceType[]; urlFilters: string[]; };

export class Rules extends StorageItem {
  rules: StoredRules = {};

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