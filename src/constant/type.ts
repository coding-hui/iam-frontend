export const USER_STATUS = {
  ACTIVED: 0,
  DISABLED: 1,
} as const;

export const POLICY_TYPES = {
  DEFAULT: 'DEFAULT',
  SYSTEM: 'SYSTEM',
};

export const POLICY_EFFECT = {
  ALLOW: 'allow',
  REJECT: 'reject',
};

export const POLICY_EFFECT_VALUE_ENUM = {
  allow: '允许',
  reject: '拒绝',
};
