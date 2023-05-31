import { request } from '@umijs/max';

export type UserInfoResponse = API.UserInfo;

export async function getUserInfo(instanceId: string) {
  return request<UserInfoResponse>(`/api/v1/users/${instanceId}`, {
    method: 'GET',
  });
}
