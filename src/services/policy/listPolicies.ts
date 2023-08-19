import { request } from '@umijs/max';

export type ListPolicyOptions = API.ListOptions;

const url = '/api/v1/policies';

export async function listPolicies(params: ListPolicyOptions, options?: { [key: string]: any }) {
  return request<API.PolicyList>(url, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
