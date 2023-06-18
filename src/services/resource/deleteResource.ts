import { request } from '@umijs/max';

type Response = null;

export async function deleteResource(instanceId: string, options?: { [key: string]: any }) {
  return request<Response>(`/api/v1/resources/${instanceId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
