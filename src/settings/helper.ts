import { IStorage, LocalStorage, StorageItem } from '@pechext/extension-essentials-lib';
import { Settings, SettingsFeature, SettingsFeatures } from './model';

type SettingsChangedListener = (featureKey: string, feature: SettingsFeature) => void;

export class _SettingsHelper {
  private settings: Settings;
  private listeners: SettingsChangedListener[] = [];

  constructor (storage: IStorage) {
    this.settings = Settings.get(storage);
    this.settings.registerListener((storageItem: StorageItem) => {
      const features = (storageItem as unknown as Settings).features;
      Object.keys(features).forEach(key => this.notifyFeatureChanged(key, features[key]));
    });
  }

  async getFeatures(): Promise<SettingsFeatures> {
    await this.settings.load();
    return this.settings.features;
  }

  async getFeature(feature: string): Promise<SettingsFeature> {
    await this.settings.load();
    return this.settings.features[feature];
  }

  async createFeature(featureKey: string, featureName: string, state: boolean): Promise<void> {
    await this.settings.load();
    this.settings.features[featureKey] = { name: featureName, state };
    await this.settings.save();
  }

  async createFeatures(features: SettingsFeatures): Promise<void> {
    const promises = Object.keys(features).map(f => this.createFeature(f, features[f].name, features[f].state));
    await Promise.all(promises);
  }

  async enableFeature(featureKey: string): Promise<void> {
    await this.toggleFeature(featureKey, true);
    console.log(`Enabled ${featureKey}.`);
  }

  async disableFeature(featureKey: string): Promise<void> {
    await this.toggleFeature(featureKey, false);
    console.log(`Disabled ${featureKey}.`);
  }

  registerListener(onSettingsChangedListener: SettingsChangedListener): void {
    this.listeners.push(onSettingsChangedListener);
    this.getFeatures().then(
      (features: SettingsFeatures) => {
        Object
          .keys(features)
          .forEach(key => onSettingsChangedListener(key, features[key]));
      }
    );
  }

  unregisterListener(onSettingsChangedListener: SettingsChangedListener): void {
    this.listeners = this.listeners.filter(l => l !== onSettingsChangedListener);
  }

  private async toggleFeature(featureKey: string, state: boolean): Promise<void> {
    await this.settings.load();
    this.settings.features[featureKey].state = state;
    await this.settings.save();
  }

  private notifyFeatureChanged(featureKey: string, feature: SettingsFeature) {
    this.listeners.forEach(l => l(featureKey, feature));
  }
}

const SettingsHelper = new _SettingsHelper(new LocalStorage());
export default SettingsHelper;