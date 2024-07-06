import { IStorage, StorageItem } from '@pechext/extension-essentials-lib';

export type SettingsFeature = { name: string, state: boolean; };
export type SettingsFeatures = { [name: string]: SettingsFeature; };

export class Settings extends StorageItem {
  features: SettingsFeatures = {};

  protected getKey(): string {
    return 'settings';
  }

  protected getVersion(): number {
    return 1;
  }

  static get(storage: IStorage): Settings {
    return new Settings(storage);
  }
}