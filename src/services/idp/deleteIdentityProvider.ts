import { request } from '@umijs/max';

type Response = null;

export async function deleteIdentityProvider(instanceId: string, options?: { [key: string]: any }) {
  return request<Response>(`/api/v1/identity_providers/${instanceId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
