import { request } from '@umijs/max';

export interface CreatePolicyRequest {
  name?: string;
  description?: string;
  type?: string;
  subjects?: string[];
  effect?: string;
  resources?: string[];
  actions?: string[];
  status?: string;
  owner?: string;
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
