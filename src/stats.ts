import { IStorage, StorageItem } from '@pechext/extension-essentials-lib';

interface TabStats {
  blockedAds: number;
}

export class TemporaryStats extends StorageItem {
  tabs: { [id: number]: TabStats; } = {};

  protected getKey(): string {
    return 'tStats';
  }

  protected getVersion(): number {
    return 1;
  }

  static get(storage: IStorage): TemporaryStats {
    return new TemporaryStats(storage);
  }
}
