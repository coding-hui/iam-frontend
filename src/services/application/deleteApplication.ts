import { request } from '@umijs/max';

type Response = null;

export async function deleteApplication(instanceId: string, options?: { [key: string]: any }) {
  return request<Response>(`/api/v1/applications/${instanceId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
