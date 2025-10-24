import { request } from '@@/exports';

export async function disableApiKey(instanceId: string, options?: Record<string, unknown>) {
  return request<API.ApiKey>(`/api/v1/apikeys/${instanceId}/disable`, {
    method: 'PUT',
    ...(options || {}),
  });
}
