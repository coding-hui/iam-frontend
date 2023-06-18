import { request } from '@umijs/max';

type Response = null;

export async function deleteRole(instanceId: string, options?: { [key: string]: any }) {
  return request<Response>(`/api/v1/roles/${instanceId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
