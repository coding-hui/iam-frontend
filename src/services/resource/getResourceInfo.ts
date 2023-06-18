import { request } from '@umijs/max';

export async function getResourceInfo(instanceId: string) {
  return request<API.Resource>(`/api/v1/resources/${instanceId}`, {
    method: 'GET',
  });
}
