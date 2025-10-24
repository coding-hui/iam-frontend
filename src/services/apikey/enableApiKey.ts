import { request } from '@@/exports';

export async function enableApiKey(instanceId: string, options?: Record<string, unknown>) {
  return request<API.ApiKey>(`/api/v1/apikeys/${instanceId}/enable`, {
    method: 'PUT',
    ...(options || {}),
  });
}
