export const OAuthCallbackAPI = '/api/v1/oauth/callback/';

export const getRedirectURL = (name?: string) => {
  return `${window.location.protocol}//${window.location.host}${OAuthCallbackAPI}${name}`;
};
