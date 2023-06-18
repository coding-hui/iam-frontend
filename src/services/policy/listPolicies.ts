import { request } from '@umijs/max';

const url = '/api/v1/policies';

export async function listPolicies(params: API.PageParams, options?: { [key: string]: any }) {
  return request<API.PolicyList>(url, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
