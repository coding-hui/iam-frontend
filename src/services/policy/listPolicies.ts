import { request } from '@umijs/max';

export type ListPolicyParams = {
  fuzzyName?: string;
} & API.PageParams;

const url = '/api/v1/policies';

export async function listPolicies(params: ListPolicyParams, options?: { [key: string]: any }) {
  return request<API.PolicyList>(url, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
