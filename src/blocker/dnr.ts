type UpdateRuleOptions = chrome.declarativeNetRequest.UpdateRuleOptions;
type MatchedRuleInfoDebug = chrome.declarativeNetRequest.MatchedRuleInfoDebug;
type Rule = chrome.declarativeNetRequest.Rule;

abstract class OnRuleMatchedDebug {
  abstract addListener(callback: (info: MatchedRuleInfoDebug) => void): void;
}

export abstract class DeclarativeNetRequest {
  abstract updateDynamicRules(options: UpdateRuleOptions): Promise<void>;
  abstract getDynamicRules(): Promise<Rule[]>;
  onRuleMatchedDebug?: OnRuleMatchedDebug;
}

/**
 * A wrapper for the declarativeNetRequest API
 */
class DNRHelper extends DeclarativeNetRequest {
  updateDynamicRules = async (options: UpdateRuleOptions): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      chrome.declarativeNetRequest.updateDynamicRules(options, () => {
        const err = chrome.runtime?.lastError;
        if (err) reject(err);
        else resolve();
      });
    });
  };

  getDynamicRules = async (): Promise<Rule[]> => {
    return new Promise<any[]>((resolve, reject) => {
      chrome.declarativeNetRequest.getDynamicRules((rules: Rule[]) => {
        const err = chrome.runtime?.lastError;
        if (err) reject(err);
        else resolve(rules);
      });
    });
  };

  onRuleMatchedDebug = {
    addListener(callback: (info: MatchedRuleInfoDebug) => void): void {
      chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(callback);
    }
  };
}

export default new DNRHelper();
