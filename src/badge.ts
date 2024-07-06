import { CrossBrowserAPI, IStorage, SessionStorage } from '@pechext/extension-essentials-lib';
import { TemporaryStats } from './stats';

class _BadgeManager {
  private stats: TemporaryStats;

  constructor (storage: IStorage) {
    this.stats = TemporaryStats.get(storage);
  }

  increment = async (tabId: number) => {
    await this.stats.load();
    if (tabId in this.stats.tabs) {
      this.stats.tabs[tabId].blockedAds++;
    } else {
      this.stats.tabs[tabId] = { blockedAds: 1 };
    }
    await this.stats.save();
    this.updateBadge(tabId);
  };

  private updateBadge = (tabId: number) => {
    CrossBrowserAPI.action.setBadgeBackgroundColor({ tabId: tabId, color: '#FFC55A' });
    CrossBrowserAPI.action.setBadgeTextColor({ tabId: tabId, color: '#FFF' });
  };
}

export const BadgeManager = new _BadgeManager(new SessionStorage());