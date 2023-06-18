import { request } from '@umijs/max';

export type AssignRoleRequest = {
  targets: string[];
};

type Response = null;

export async function assignRole(
  instanceId: string,
  assignReq?: AssignRoleRequest,
  options?: { [key: string]: any },
) {
  return request<Response>(`/api/v1/roles/${instanceId}/assign`, {
    method: 'POST',
    data: assignReq,
    ...(options || {}),
  });
}
