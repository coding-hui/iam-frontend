import { request } from '@umijs/max';

export type RevokeRoleRequest = {
  targets: string[];
};

type Response = null;

export async function revokeRole(
  instanceId: string,
  revokeReq?: RevokeRoleRequest,
  options?: { [key: string]: any },
) {
  return request<Response>(`/api/v1/roles/${instanceId}/revoke`, {
    method: 'POST',
    data: revokeReq,
    ...(options || {}),
  });
}
