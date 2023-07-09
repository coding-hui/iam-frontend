import { request } from '@umijs/max';

export async function getPolicyInfo(instanceId: string) {
  return request<API.Policy>(`/api/v1/policies/${instanceId}`, {
    method: 'GET',
  });
}
