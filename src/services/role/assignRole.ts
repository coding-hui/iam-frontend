import { request } from '@umijs/max';

export type AssignRoleRequest = {
  targets: string[];
};

export type BatchAssignRoleRequest = {
  instanceIds: string[];
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

export async function batchAssignRole(
  assignReq?: BatchAssignRoleRequest,
  options?: { [key: string]: any },
) {
  return request<Response>(`/api/v1/roles/batch-assign`, {
    method: 'POST',
    data: assignReq,
    ...(options || {}),
  });
}
