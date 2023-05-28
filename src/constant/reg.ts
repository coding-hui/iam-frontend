export const USER = {
  NAME_LENGTH: /^.{1,50}$/,
  PASSWORD_LENGTH: /^.{8,255}$/,
  PASSWORD_NUMBER: /\d{1,}/,
  PASSWORD_LETTER: /[a-zA-Z]{1,}/,
  PASSWORD_SYMBOL: /[~`!@#$%^&*()\-_+={}[\]|\\;:"<>,./?]{1,}/,
  PHONE: /^1[3-9]\d{9}$/,
} as const;
