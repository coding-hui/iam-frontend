import { request } from '@umijs/max';

export interface CreatePolicyRequest {
  name?: string;
  description?: string;
  type?: string;
  subjects?: string[];
  status?: string;
  owner?: string;
  statements?: API.Statement[];
}

export async function createPolicy(
  createReq: CreatePolicyRequest,
  options?: { [key: string]: any },
) {
  return request(`/api/v1/policies`, {
    method: 'POST',
    data: createReq,
    ...(options || {}),
  });
}
