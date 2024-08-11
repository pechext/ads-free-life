type ResourceType = chrome.declarativeNetRequest.ResourceType;
type RuleActionType = chrome.declarativeNetRequest.RuleActionType;
type RequestMethod = chrome.declarativeNetRequest.RequestMethod;
type RuleCondition = chrome.declarativeNetRequest.RuleCondition;

export interface BlockDnrRule {
  resourceTypes: ResourceType[];
  urlsFilter: string[];
}

export interface DnrRule {
  id: number;
  priority: number;
  action: Action;
  condition: RuleCondition;
}

export interface Action {
  type: RuleActionType;
}


abstract class Rule {
  constructor (private readonly ruleId: number) { }

  getRule(): DnrRule {
    const condition = this.getCondition();
    const initiatorDomains = this.getInitiatorDomains();
    const excludedInitiatorDomains = this.getExcludedInitiatorDomains();
    if (initiatorDomains) condition.initiatorDomains = initiatorDomains;
    if (excludedInitiatorDomains) condition.excludedInitiatorDomains = excludedInitiatorDomains;
    return {
      id: this.ruleId,
      priority: 1,
      condition,
      action: { type: this.getAction() }
    };
  }

  getRuleId = (): number => this.ruleId;

  abstract getCondition(): RuleCondition;
  abstract getAction(): RuleActionType;
  abstract getInitiatorDomains(): string[];
  abstract getExcludedInitiatorDomains(): string[];
}

export class AjaxBlockingRule extends Rule {
  constructor (
    ruleId: number,
    public url: string,
    private initiatorDomains?: string[],
    private excludedInitiatorDomains?: string[],
    private resourceTypes?: ResourceType[]
  ) {
    super(ruleId);
  }

  getCondition(): RuleCondition {
    return {
      urlFilter: `*${this.url}*`,
      resourceTypes: this.resourceTypes || [chrome.declarativeNetRequest.ResourceType.SCRIPT, chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST]
    };
  }

  getAction(): RuleActionType {
    return chrome.declarativeNetRequest.RuleActionType.BLOCK;
  }

  getInitiatorDomains(): string[] {
    return this.initiatorDomains || [];
  }

  getExcludedInitiatorDomains(): string[] {
    return this.excludedInitiatorDomains || [];
  }
}

export class ReqBlockingRule extends Rule {
  constructor (
    ruleId: number,
    public url: string,
    private initiatorDomains?: string[],
    private excludedInitiatorDomains?: string[],
    private resourceTypes?: ResourceType[],
    private requestMethods?: RequestMethod[],
  ) {
    super(ruleId);
  }

  getCondition(): RuleCondition {
    return {
      urlFilter: `*${this.url}*`,
      resourceTypes: this.resourceTypes || [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME, chrome.declarativeNetRequest.ResourceType.SUB_FRAME],
      requestMethods: this.requestMethods,
    };
  }

  getAction(): RuleActionType {
    return chrome.declarativeNetRequest.RuleActionType.BLOCK;
  }

  getInitiatorDomains(): string[] {
    return this.initiatorDomains || [];
  }

  getExcludedInitiatorDomains(): string[] {
    return this.excludedInitiatorDomains || [];
  }
}
