import { Config } from '../config';
import SettingsHelper, { _SettingsHelper } from '../settings/helper';
import { SettingsFeatures } from '../settings/model';
import { BlockerConfig } from './blocker';
import RulesHelper, { _RulesHelper } from './helper';
import { getStorageKey } from './utils';
import DNRHelper from './dnr';

declare let __BLOCKER_CONFIG_URL__: string;

export class _RulesUpdater {
  private static readonly ALARM_NAME: string = 'RulesUpdaterAlarm';

  static create(rulesHelper: _RulesHelper, settingsHelper: _SettingsHelper, configUrl: string) {
    return new _RulesUpdater(rulesHelper, settingsHelper, configUrl);
  }

  private constructor (
    private rulesHelper: _RulesHelper,
    private settingsHelper: _SettingsHelper,
    private configUrl: string,
  ) { }

  public init() {
    chrome.alarms.onAlarm.addListener((alarm: chrome.alarms.Alarm) => {
      switch (alarm.name) {
        case _RulesUpdater.ALARM_NAME:
          this.update();
          break;
      }
    });
  }

  public async onInstall() {
    await DNRHelper.clearRules();
  }

  private async update(): Promise<void> {
    const config = await this.download(this.configUrl);
    if (!config) return;
    this.onDownloadComplete(config);
  }

  public async download(url: string): Promise<Config | null> {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(`downloaded blocker config ${JSON.stringify(data)}`);
      return data as Config;
    } catch (exception) {
      return null;
    }
  }

  public async schedule(delayInMinutes: number, periodInMinutes: number, immediate: boolean = false): Promise<void> {
    if (immediate) this.update();
    const alarm: chrome.alarms.Alarm = await chrome.alarms.get(_RulesUpdater.ALARM_NAME);
    if (alarm) {
      if (alarm.periodInMinutes === periodInMinutes) return;
      console.log(`cleared alarm`);
      await chrome.alarms.clear(_RulesUpdater.ALARM_NAME);
    }
    console.log(`scheduled alarm ${delayInMinutes}, ${periodInMinutes}`);
    await chrome.alarms.create(_RulesUpdater.ALARM_NAME, { delayInMinutes, periodInMinutes });
  }

  private async onDownloadComplete(config: Config): Promise<boolean> {
    try {
      await this.rulesHelper.storeConfig(config);
      const configs = await this.rulesHelper.getConfigs();
      await this.updateSettings(configs);
      return true;
    } catch (exception) {
      return false;
    }
  }

  private async updateSettings(configs: BlockerConfig[]): Promise<void> {
    const currentSettings: SettingsFeatures = await this.settingsHelper.getFeatures();
    const expectedFeatures: Set<string> = new Set<string>();

    for (const config of configs) {
      const configKey = config.key;
      const rules = config.rules;
      for (const ruleKey of Object.keys(rules)) {
        const storageKey = getStorageKey(configKey, ruleKey);
        expectedFeatures.add(storageKey);
        if (storageKey in currentSettings) continue;
        currentSettings[storageKey] = { name: rules[ruleKey].name, state: true };
      }
    }

    for (const storageKey of Object.keys(currentSettings)) {
      if (!expectedFeatures.has(storageKey)) delete currentSettings[storageKey];
    }

    console.log(`currentSettings: ${JSON.stringify(currentSettings)}`);

    await this.settingsHelper.clearFeatures();
    await this.settingsHelper.createFeatures(currentSettings);
  }
}

const RulesUpdater = _RulesUpdater.create(RulesHelper, SettingsHelper, __BLOCKER_CONFIG_URL__);
export default RulesUpdater;