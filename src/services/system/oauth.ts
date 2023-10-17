export const OAuthCallbackAPI = '/login/oauth/callback/';

export const getRedirectURL = (name?: string) => {
  return `${window.location.protocol}//${window.location.host}${OAuthCallbackAPI}${name}`;
};
