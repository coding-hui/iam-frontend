import { request } from '@umijs/max';

export async function enableUser(instanceId: string) {
  return request(`/api/v1/users/${instanceId}/enable`, {
    method: 'GET',
  });
}
