import { request } from '@umijs/max';

type Response = null;

export async function deleteUser(instanceId: string, options?: { [key: string]: any }) {
  return request<Response>(`/api/v1/users/${instanceId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
