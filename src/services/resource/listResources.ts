import { request } from '@umijs/max';

const url = '/api/v1/resources';

export async function listResources(params: API.PageParams, options?: { [key: string]: any }) {
  return request<API.ResourceList>(url, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
