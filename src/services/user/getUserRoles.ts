import { request } from '@umijs/max';

export async function getUserRoles(instanceId: string, pageParams?: API.ListOptions) {
  return request<API.RoleList>(`/api/v1/users/${instanceId}/roles`, {
    method: 'GET',
    params: pageParams,
  });
}
