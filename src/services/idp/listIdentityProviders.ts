import { request } from '@@/exports';

export type ListIdentityProvidersOptions = API.ListOptions;

export async function listIdentityProviders(
  params: ListIdentityProvidersOptions,
  options?: { [key: string]: any },
) {
  return request<App.IdentityProviderList>('/api/v1/identity-providers', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
