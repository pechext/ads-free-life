export function generateRuleId(extKey: string, rulesPrefix: number, ruleId: number): number {
  let extKeyVal = extKey.length;
  Array.from(extKey).forEach(ch => {
    extKeyVal += ch.charCodeAt(0);
  });
  return Math.floor(extKeyVal * rulesPrefix + ruleId);
}

export function isRelevantId(id: number, extKey: string, rulesPrefix: number): boolean {
  let extKeyVal = extKey.length;
  Array.from(extKey).forEach(ch => {
    extKeyVal += ch.charCodeAt(0);
  });
  id = Math.floor(id / extKeyVal);
  return id === rulesPrefix;
}
