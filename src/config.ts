export interface Config {
  v:         number;
  adsConfig: AdsConfig;
}

export interface AdsConfig {
  urlPatterns:            string[];
  selectors:              Selectors;
  texts:                  Texts;
  mutationObserverConfig: MutationObserverConfig;
}

export interface MutationObserverConfig {
  attributes: boolean;
  childList:  boolean;
  subtree:    boolean;
}

export interface Selectors {
  inboxContainer:      string[];
  inboxRow:            string[];
  inboxRowAdIndicator: string[];
}

export interface Texts {
  inboxRowAdIndicatorText: string[];
}
