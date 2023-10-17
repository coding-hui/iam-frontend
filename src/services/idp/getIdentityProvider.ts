import { request } from '@umijs/max';

export async function getIdentityProvider(instanceId: string) {
  return request<App.IdentityProvider>(`/api/v1/identity_providers/${instanceId}`, {
    method: 'GET',
  });
}
