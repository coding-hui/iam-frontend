import { request } from '@umijs/max';

type Response = null;

export async function deleteOrganization(instanceId: string, options?: { [key: string]: any }) {
  return request<Response>(`/api/v1/organizations/${instanceId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
