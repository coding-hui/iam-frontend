import { request } from '@umijs/max';

type Response = null;

export async function deletePolicy(instanceId: string, options?: { [key: string]: any }) {
  return request<Response>(`/api/v1/policies/${instanceId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
