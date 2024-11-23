import { MESSAGES } from './constants';
import { BadgeManager } from './badge';
import SettingsHelper from './settings/helper';
import { SettingsFeature } from './settings/model';
import RulesUpdater from './blocker/updater';
import BlockManager from './blocker/blocker';
import RulesHelper from './blocker/helper';

async function toggleFeature(featureKey: string, featureState: boolean): Promise<void> {
  if (featureState) await SettingsHelper.enableFeature(featureKey);
  else await SettingsHelper.disableFeature(featureKey);
};

function onMessage(message: Message<any>, sender: chrome.runtime.MessageSender) {
  if (message.name === MESSAGES.ON_AD_REMOVED) {
    if (sender.tab) BadgeManager.increment(sender.tab.id as number);
  } else if (message.name === MESSAGES.TOGGLE_FEATURE) {
    const toggleMessage = message as Message<ToggleFeatureMessageData>;
    const featureKey = toggleMessage.data.featureKey;
    const isEnabled = !!toggleMessage.data.featureState;
    toggleFeature(featureKey, isEnabled);
  }
  return false;
};

function initBlocker(): void {
  SettingsHelper.registerListener(async (featureKey: string, featureState: SettingsFeature) => {
    const ruleKeyParts = featureKey.split('_');
    const rulesGroupKey = ruleKeyParts[0];
    const ruleKey = ruleKeyParts[1];
    let configs = await RulesHelper.getConfigs();
    const config = configs.filter(c => c.key === rulesGroupKey).find(c => ruleKey in c.rules);
    if (!config) return;
    console.log('SettingsHelper ->', featureKey, featureState);
    const blocker = await BlockManager.get();
    if (featureState.state) blocker.enable(featureKey, config.rules[ruleKey].rule, config.rulesPrefix);
    else blocker.disable(featureKey);
  });
};

initBlocker();

chrome.runtime.onMessage.addListener(onMessage);
chrome.runtime.onInstalled.addListener(async (details: chrome.runtime.InstalledDetails) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    await RulesUpdater.onInstall();
  }

  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL || details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    RulesUpdater.init();
    RulesUpdater.schedule(1, 1, true);
  }
});