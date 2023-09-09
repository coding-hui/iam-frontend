import { request } from '@umijs/max';

export async function getOrganization(instanceId: string) {
  return request<API.Organization>(`/api/v1/organizations/${instanceId}`, {
    method: 'GET',
  });
}
