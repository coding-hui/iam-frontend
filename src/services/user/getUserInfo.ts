import { request } from '@umijs/max';

export async function getUserInfo(instanceId: string) {
  return request<API.UserInfo>(`/api/v1/users/${instanceId}`, {
    method: 'GET',
  });
}
