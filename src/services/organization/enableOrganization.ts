import { request } from '@umijs/max';

export async function enableOrganization(instanceId: string) {
  return request(`/api/v1/organizations/${instanceId}/enable`, {
    method: 'GET',
  });
}
