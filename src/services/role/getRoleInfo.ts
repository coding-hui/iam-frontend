import { request } from '@umijs/max';

export async function getRoleInfo(instanceId: string, options?: { [key: string]: any }) {
  return request<API.Role>(`/api/v1/roles/${instanceId}`, {
    method: 'GET',
    ...(options || {}),
  });
}
