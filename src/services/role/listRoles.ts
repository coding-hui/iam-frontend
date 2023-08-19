import { request } from '@umijs/max';

export type ListRoleOptions = API.ListOptions;

const url = '/api/v1/roles';

export async function listRoles(params: ListRoleOptions, options?: { [key: string]: any }) {
  return request<API.RoleList>(url, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
