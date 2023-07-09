import { request } from '@umijs/max';

export type ListRoleParams = {
  fuzzyName: string;
} & API.PageParams;

const url = '/api/v1/roles';

export async function listRoles(params: ListRoleParams, options?: { [key: string]: any }) {
  return request<API.RoleList>(url, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
