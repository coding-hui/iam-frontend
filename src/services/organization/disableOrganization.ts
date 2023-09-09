import { request } from '@umijs/max';

export async function disableOrganization(instanceId: string) {
  return request(`/api/v1/organizations/${instanceId}/disable`, {
    method: 'GET',
  });
}
