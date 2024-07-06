import { MESSAGES } from './constants';
import { BadgeManager } from './badge';
import BlockManager, { BlockerConfig } from './blocker/blocker';
import GmailDnrRulesConfig from '../public/gmail-config.json';
import SiteAdsDnrRulesConfig from '../public/ads-config.json';
import DefaultSettings from '../public/default-settings.json';
import SettingsHelper from './settings/helper';
import { SettingsFeature, SettingsFeatures } from './settings/model';

function toggleFeature(featureKey: string, featureState: boolean) {
  if (featureState) SettingsHelper.enableFeature(featureKey);
  else SettingsHelper.disableFeature(featureKey);
};

function onMessage(message: Message, sender: any, sendResponse: (response?: any) => void) {
  if (message.name === MESSAGES.ON_AD_REMOVED) {
    BadgeManager.increment(sender.tab.id as number);
  } else if (message.name === MESSAGES.TOGGLE_FEATURE) {
    const featureKey = message.data.featureKey as string;
    const isEnabled = !!message.data.featureState;
    toggleFeature(featureKey, isEnabled);
  }
  return false;
};

function initBlocker(): void {
  SettingsHelper.registerListener((featureKey: string, featureState: SettingsFeature) => {
    switch (featureKey) {
      case 'gmail':
        const gmailAdsBlocker = new BlockManager(GmailDnrRulesConfig as BlockerConfig);
        if (featureState.state) gmailAdsBlocker.enable();
        else gmailAdsBlocker.disable();
        break;
      case 'siteAds':
        const siteAdsBlocker = new BlockManager(SiteAdsDnrRulesConfig as BlockerConfig);
        if (featureState.state) siteAdsBlocker.enable();
        else siteAdsBlocker.disable();
        break;
    }
  });
};

initBlocker();

chrome.runtime.onMessage.addListener(onMessage);
chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL || details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    // Setup Default Settings
    SettingsHelper.createFeatures(DefaultSettings.features as SettingsFeatures);
  }
});