import { request } from '@umijs/max';

export interface UpdateRoleRequest {
  owner?: string;
  description?: string;
}

export async function updateRole(
  instanceId: string,
  updateReq: UpdateRoleRequest,
  options?: { [key: string]: any },
) {
  return request(`/api/v1/roles/${instanceId}`, {
    method: 'PUT',
    data: updateReq,
    ...(options || {}),
  });
}
