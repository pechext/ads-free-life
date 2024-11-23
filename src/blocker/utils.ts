export function generateRuleId(rulesPrefix: number, ruleId: number): number {
  return Math.floor(rulesPrefix + ruleId + (Date.now() * Math.random() / 1000));
}

export function getStorageKey(configKey: string, ruleKey: string): string {
  return `${configKey}_${ruleKey}`;
}
