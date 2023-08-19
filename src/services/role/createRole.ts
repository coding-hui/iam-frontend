import { request } from '@umijs/max';

export interface CreateRoleRequest {
  name: string;
  owner?: string;
  displayName?: string;
  description?: string;
}

const url = '/api/v1/roles';

export async function createRole(createReq: CreateRoleRequest, options?: { [key: string]: any }) {
  return request(url, {
    method: 'POST',
    data: createReq,
    ...(options || {}),
  });
}
