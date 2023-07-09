import { request } from '@umijs/max';

export interface UpdatePolicyRequest {
  name?: string;
  description?: string;
  type?: string;
  subjects?: string[];
  status?: string;
  owner?: string;
  statements?: API.Statement[];
}

export async function updatePolicy(
  instanceId: string,
  updateReq: UpdatePolicyRequest,
  options?: { [key: string]: any },
) {
  return request(`/api/v1/policies/${instanceId}`, {
    method: 'PUT',
    data: updateReq,
    ...(options || {}),
  });
}
