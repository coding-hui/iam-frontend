import { request } from '@umijs/max';

const url = '/api/v1/roles';

export async function listRoles(params: API.PageParams, options?: { [key: string]: any }) {
  return request<API.RoleList>(url, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
