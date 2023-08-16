import { request } from '@umijs/max';

export async function disableUser(instanceId: string) {
  return request(`/api/v1/users/${instanceId}/disable`, {
    method: 'GET',
  });
}
