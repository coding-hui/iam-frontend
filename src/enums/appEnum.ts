export const DEFAULT_APP = 'built-in-app';

export enum IdentityProviderType {
  GitHub = 'GitHub',
  Gitee = 'Gitee',
  Coding = 'Coding',
  WeChat = 'WeChat',
  LDAP = 'LDAP',
  WeChatMiniProgram = 'WeChatMiniProgram',
}

export enum ProviderCategory {
  OAuth = 'OAuth',
  Generic = 'Generic',
}

export enum PolicyType {
  CUSTOM = 'CUSTOM',
  SYSTEM = 'CUSTOM',
  DEFAULT = 'DEFAULT',
}
