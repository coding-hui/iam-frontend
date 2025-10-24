import { request } from '@@/exports';

export async function deleteApiKey(instanceId: string, options?: Record<string, unknown>) {
  return request(`/api/v1/apikeys/${instanceId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
